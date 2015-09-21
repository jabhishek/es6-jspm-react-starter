import React from 'react';
import ReactAddons from 'react/addons';
import Header from './components/common/header';
import Router from 'react-router';

var RouteHandler = Router.RouteHandler;

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Header/>
                <div className="view">
                    <RouteHandler />
                </div>
            </div>
        );
    }
}