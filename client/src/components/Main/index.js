import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Route } from 'react-router';

import Home from '../Home';
import LogIn from '../LogIn';
import SignUp from '../SignUp';
import Settings from '../Settings';
import Payment from '../Payment';
import RouteMap from '../Route';
import Booking from '../Booking';
/*
This component handles all the routes to the different urls.
There is a route for each path and each route renders a component.
For example if the user goes to localhost:3000/ it would render the Home component.
*/
class Main extends Component {
    render() {
        return (
            <Container>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={LogIn} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/settings" component={Settings} />
                <Route exact path="/payment" component={Payment} />
                <Route exact path="/route" component={RouteMap} />
				<Route exact path="/booking" component={Booking} />
            </Container>
        )
    }
}

export default Main;
