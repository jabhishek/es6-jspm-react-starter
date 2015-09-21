import React from 'react';
import _ from 'lodash';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="home-page">
                <h1>Home</h1>
            </div>
        );
    }
}

HomePage.defaultProps = {user: "abhi"};
