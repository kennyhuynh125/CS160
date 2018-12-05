import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Route } from 'react-router';
import axios from 'axios';

import Home from '../Home';
import LogIn from '../LogIn';
import SignUp from '../SignUp';
import Settings from '../Settings';
import Payment from '../Payment';
import RouteMap from '../Route';
import Booking from '../Booking';
import HomePage from '../HomePage';

/*
This component handles all the routes to the different urls.
There is a route for each path and each route renders a component.
For example if the user goes to localhost:3000/ it would render the Home component.
*/
class Main extends Component {
    
    /*
    Left here in case it is needed
    openingCode = () =>
    {
        const userId = sessionStorage.getItem('userId');
        const data = {
            logoutUserId: userId
        };
        let headers = {
            type: 'application/json'
        };
        const blob = new Blob([JSON.stringify(data)], headers);
        navigator.sendBeacon('/api/clearlogouttimer', blob);
    }
    */
    // When users move or close pages, this is called
    closingCode = () => {
        const userId = sessionStorage.getItem('userId');
        const data = {
            logoutUserId: userId
        };
        let headers = {
            type: 'application/json'
        };
        const blob = new Blob([JSON.stringify(data)], headers);
        navigator.sendBeacon('/api/startlogouttimer', blob);
    }
    // Whenever users load a page, signal the backend not to logout the user
    // Also add the listener to check page close/refresh
    componentDidMount() {
        if(sessionStorage.getItem('isLoggedIn'))
        {
            const userId = sessionStorage.getItem('userId');
            axios.post('/api/clearlogouttimer', {
                logoutUserId: userId
            })
            .catch((error) => {
                console.log(error);
            });
        }
        window.addEventListener("beforeunload", this.closingCode);
    }
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
                <Route exact path="/homepage" component={HomePage} />
            </Container>
        )
    }
}

export default Main;
