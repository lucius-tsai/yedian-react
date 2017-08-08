import React, { Component } from 'react';

import styles from './loading.scss';
import styleIcons from  "../../icons/scss/ionicons";

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
                    <div className={styleIcons['ion-loading']} data-icon></div>
                    <p className={styles["text"]}>正在加载…</p>
                </div>
            </div>
        )
    }
}