/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { getVenues, getTags, creatTag } from '../../libs/api';
import { reSetShare } from '../../libs/wechat';
import { trackPageView, trackPageLeave } from '../../libs/track';

import { loading, loadSuccess, loadFail, hideBar, showBar } from '../../store/actions/appStatus';
import { addTag, addVenues } from '../../store/actions/publish';

import './search.scss';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {
        pageName: 'community_search',
        startTime: null,
      },
      input: false,
      pageIndex: 0,
      limit: 20,
      list: [],
      gps: null,
      total: 0,
      search: "",
      searchPlaceholder: null,
      type: null
    };
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.change = this.change.bind(this);
    this.handler = this.handler.bind(this);
    this.getMore = this.getMore.bind(this);
    this.creatTag = this.creatTag.bind(this);
  }

  componentWillMount() {
    trackPageView({
      pageName: this.state.track.pageName
    });
    this.setState({
      track: {
        pageName: this.state.track.pageName,
        startTime: new Date(),
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const { gps } = nextProps;
    this.setState({ gps })
  }

  fetch() {
    const self = this;
    const { pageIndex, limit, search, type, gps } = this.state;
    const { loading, loadSuccess, loadFail, location } = this.props;
    loading();
    if (type === 'venues') {
      const key = search ? `, key: "${search}"` : '';
      const gpsStr = (gps && gps.lat && gps.lng) ? `, latitude: "${gps.lat}", longitude: "${gps.lng}"` : '';
      const query = `query=query
      {
        venues(isValid: 1, isDeleted: 0, offset: ${pageIndex * limit}, limit: ${limit}${key}${gpsStr}){
          count,
          rows{
            _id, name, address, images
          }
        }
      }`
      getVenues(query).then(res => {
        if (res.code === 200) {
          const { rows, count } = res.data.venues;
          loadSuccess();
          const list = pageIndex === 0 ? rows : self.state.list.concat(rows);
          self.setState({
            list: list,
            total: count
          });
        } else {
          loadFail();
        }
      }, error => {
        loadFail();
      });
    } else {
      getTags(search ? `?tag=${search}` : '').then(res => {
        loadSuccess();
        const list = pageIndex === 0 ? res.data : self.state.list.concat(res.data);
        self.setState({
          list: list
        });
      }, error => {
        loadFail();
      });
    }
  }

  getMore() {
    let pageIndex = this.state.pageIndex * 1;
    pageIndex++;
    this.setState({
      pageIndex: pageIndex
    }, () => {
      this.fetch()
    })
  }

  focus() {
    this.setState({
      input: true
    })
  }

  blur() {
    const { search, list } = this.state;
    if (!search) {
      this.setState({
        input: false
      });
    } else {
      if (!list.length) {
        
      }
    }
  }
  creatTag() {
    const { history, addTag, publish } = this.props;
    creatTag({
      tag: this.state.search
    }).then(res => {
      if(res.code === 200) {
        const tags = publish.tags ? publish.tags : [];
        let isRepeate = false;
        tags.forEach(cell => {
          if(cell._id === res.data._id) {
            isRepeate = true;
          }
        });
        if(!isRepeate) {
          addTag(tags.concat(res.data.map(cell => {
            return {
              _id: cell._id,
              tag: cell.tag
            }
          })));
        }
        // return history.push(`${BASENAME}publish`);
        history.goBack();
      }
    }, error => {
      console.log(error);
    });
  }

  change(e) {
    this.setState({
      search: e.target.value,
      pageIndex: 0
    }, () => {
      this.fetch()
    })
  }

  handler(cell) {
    const { history, addTag, addVenues, publish } = this.props;
    const { type } = this.state;
    if (type === "venues") {
      addVenues({
        cell
      });
    } else {
      const tags = publish.tags ? publish.tags : [];
      let isRepeate = false;
      tags.forEach(item => {
        if(item._id === cell._id) {
          isRepeate = true;
        }
      });
      if(!isRepeate) {
        addTag(tags.concat({
          _id: cell._id,
          tag: cell.tag
        }));
      }
    }
    // return history.push(`${BASENAME}publish`);
    history.goBack();
  }

  render() {
    const { type, input, search, searchPlaceholder, list, total } = this.state;
    const listStr = list.map((cell, index) => {
      return (
        <li key={cell._id} onClick={this.handler.bind(this, cell)}>
          <h4>{type === "venues" ? cell.name : cell.tag}</h4>
          {
            type === "venues" ? <p>{cell.address}</p> : ""
          }
        </li>
      )
    });

    return (
      <div className="search-page">
        <div className={input ? "input-box focus" : "input-box"}>
          <i className="icon ion-search-square"></i>
          <input type="text" value={search} placeholder={searchPlaceholder} className="search-input" onBlur={this.blur}
            onFocus={this.focus} onChange={this.change} />
        </div>
        {
          type === 'tags' && !list.length && search.length ?
          <div className='creatTag-box'>
            <button onClick={this.creatTag}>创建这个标签</button>
          </div>
          : ''
        }
        {
          type === 'tags' ?
            <h3>热门话题</h3>
            : ""
        }
        <ul className={type}>
          {listStr}
        </ul>
        {
          list.length < total ? <button className='showMore' onClick={this.getMore}>显示更多数据</button> : ''
        }
      </div>
    )
  }
  componentDidMount() {
    const self = this;
    const { showBar, router, location, hideBar, gps } = this.props;
    const pathname = router.location.pathname;
    hideBar();
    const type = location && location.state && location.state.type;
    let searchPlaceholder = null;
    switch (type) {
      case "venues":
        searchPlaceholder = "搜索商户关键字";
        break;
      case "tags":
        searchPlaceholder = "搜索话题关键字";
        break;
      default:
        searchPlaceholder = "搜索商户关键字";
        break;
    }
    this.setState({
      searchPlaceholder: searchPlaceholder,
      type: type,
      gps
    }, () => {
      setTimeout(() => {
        self.fetch();
      }, 500);
    });

    reSetShare();
  }

  componentWillUnmount() {
    trackPageLeave({
      pageName: this.state.track.pageName,
      pageStayTime: ((new Date().getTime() - this.state.track.startTime.getTime()) / 1000)
    });
  }
}

const mapStateToProps = state => {
  const { appStatus, router, publish } = state;
  return {
    loading: appStatus.loading || false,
    gps: appStatus.gps || false,
    router,
    publish
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loading: () => {
      dispatch(loading())
    },
    loadSuccess: () => {
      dispatch(loadSuccess())
    },
    loadFail: () => {
      dispatch(loadFail())
    },
    addTag: (cell) => {
      dispatch(addTag(cell))
    },
    addVenues: (cell) => {
      dispatch(addVenues(cell))
    },
    hideBar: () => {
      dispatch(hideBar())
    },
    showBar: () => {
      dispatch(showBar())
    }
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));