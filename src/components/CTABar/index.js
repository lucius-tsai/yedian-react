import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './ctabar.scss';

export default class CTABar extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const {fix} = this.props;
        return (
            <div className={fix ? "cta-box clearfix" : "cta-box fix"}>
                <div className="cell _like">
                    <div className="icon ion-cta-like">&nbsp;</div>
                    <span className="text">23</span>
                </div>
                <div className="cell _collection">
                    <div className="icon ion-cta-collection">&nbsp;</div>
                    <span className="text">23</span>
                </div>
                <div className="cell _comment">
                    <div className="icon ion-cta-comment">&nbsp;</div>
                    <span className="text">23</span>
                </div>
            </div>
        )
    }
}