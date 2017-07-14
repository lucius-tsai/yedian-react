import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Message from '../../components/Message';
import VenuesCell from '../../components/VenuesCell';
import Comment from '../../components/Comment';
import './communityInfo.scss';
import { getMessageInfo, getVenues } from '../../libs/api';

import { loading, loadSuccess, loadFail, hideBar, showBar } from '../../store/actions/appStatus';

class CommunityInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInfo: null,
      venuesInfo: null,
      __showComment: false,
    }
    this.__openComment = this.__openComment.bind(this);
    this.__hiddenComment = this.__hiddenComment.bind(this);
  }

  componentWillMount() {
    const self = this;
    this._isMounted = true;
    const { loading, loadSuccess, loadFail, hideBar, location, match } = this.props;
    const id = match && match.params && match.params.id ? match.params.id : '';
    hideBar();
    loading();
    getMessageInfo(id).then(res => {
      loadSuccess();
      if (res.code === 200 && res.data && res.data.length) {
        self._isMounted && self.setState({
          messageInfo: res.data[0]
        });
        res.data[0].affiliates && res.data[0].affiliates.forEach(cell => {
          if (cell.type === 'venues') {
            const query = `query=query
            {
              venues(isValid: 1, isDeleted: 0, _id: "${cell.targetId}"){
                count,
                rows{
                  _id, name, images
                }
              }
            }`
            getVenues(encodeURI(query)).then(res => {
              if (res.code === 200 && res.data.venues.count === 1) {
                const venuesInfo = res.data.venues.rows[0];
                self._isMounted && self.setState({
                  venuesInfo
                });
              }
            }, error => {

            })
          }
        });
      }
    }, error => {
      loadFail();
      console.log(error);
    });
  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  __openComment(show) {
    this.setState({
      __showComment: show
    });
  }
  __hiddenComment(e) {
    this.setState({
      __showComment: false
    });
  }

  render() {
    const { messageInfo, venuesInfo, __showComment } = this.state;
    let venuesID = null;
    messageInfo && messageInfo.affiliates && messageInfo.affiliates.forEach(cell => {
      venuesID = cell.type === 'venues' ? cell.targetId : null;
    });
    return (
      <div className="community-info-box" onClick={this.__hiddenComment}>
        <div className="community-info">
          {
            messageInfo ?
              <Message post={messageInfo} canLink={false} __showComment={__showComment} />
              : ""
          }
          {
            venuesInfo ?
              <a href={`http://staging-app.ye-dian.com/dist/?#!/ktv/${venuesInfo._id}`}>
                <VenuesCell venuesInfo={venuesInfo} />
              </a>
              : ""
          }
        </div>
        {
          messageInfo ?
            <Comment target={messageInfo} openComment={this.__openComment} />
            : ''
        }
      </div>
    )
  }

  componentDidMount() {
    document.title = "Night+--呃呃呃～算是吧～";
    document.body.scrollTop = 0;
    this._isMounted = true;
  }

  componentWillUnmount() {
    const { showBar, router } = this.props;
    this._isMounted = false;
    const pathname = router.location.pathname;
    if (pathname !== `${BASENAME}topic`) {
      showBar();
    }
  }
}

const mapStateToProps = state => {
  const { router, appStatus } = state;
  return {
    router
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
    hideBar: () => {
      dispatch(hideBar())
    },
    showBar: () => {
      dispatch(showBar())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CommunityInfo);