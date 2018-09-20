import React, { Component } from 'react';
import { Route } from 'react-router';

import Home from '../Home';

/*
This component handles all the routes to the different urls.
There is a route for each path and each route renders a component.
For example if the user goes to localhost:3000/ it would render the Home component.
*/
class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Home} />
            </div>
        )
    }
}

export default Main;
