import React from 'react';

export default class AboutPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="aboutPage">
                <h1>About</h1>

                <p>This application uses the following technologies:-</p>
                <ul>
                    <li>React</li>
                    <li>Flux</li>
                    <li>Ecmascript 2015 (ES6)</li>
                    <li>Nodejs</li>
                    <li>Express</li>
                    <li>React Router</li>
                    <li>Gulp</li>
                    <li>jspm</li>
                </ul>
            </div>
        );
    }
}
