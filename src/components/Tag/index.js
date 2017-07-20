/**
 * Created by townmi on 17/6/4.
 */
import React, { Component } from 'react';
import './tag.scss';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: null
        }
    }
    componentWillMount() {
        const { word } = this.props;
        this.setState({
            word: word
        });
    }
    render() {
        const { word, remove } = this.props;
        return (
            <div className="tag">
                <i className="icon" onClick={remove}>×</i>
                <span>{word}</span>
            </div>
        )
    }
}