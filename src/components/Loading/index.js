import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styles from './loading.scss';

export default class Loading extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <div className={styles["loading"]}>
                <div className={styles["_holder"]}>
                    <div className={`${styles['icon']} ${styles['ion-loading']}`}></div>
                    <p className={styles["text"]}>正在加载…</p>
                </div>
            </div>
        )
    }
}