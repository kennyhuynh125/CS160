import React, { Component } from 'react';
import { Button } from 'reactstrap';
/*
This component is the main page when the user goes on our site.
*/
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            latitude: 0,
            longitude: 0,
        }
        this.getLocation = this.getLocation.bind(this);
    }

    // before we render the home page, make an api call to get all users
    // and set the response to the users state.
    async componentDidMount() {
        try {
            const res = await fetch('/api/');
            const users = await res.json();
            this.setState({
                users: users,
            });
        } catch (e) {
            console.log(e);
        }
    }

    getLocation = () => {
        const geolocation = navigator.geolocation;
        if (geolocation) {
            console.log(geolocation.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
                console.log(position);
            }));
        } else {
            console.log('Not supported');
        }
    }

    render() {
        // print state to see if are retrieving users for testing purposes
        console.log(this.state);
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        return (
            <div>
                Hello World!
                {
                    isLoggedIn && (
                        <p>You are logged in!</p>
                    )
                }
                <p>Customer? {sessionStorage.getItem('customer')}</p>
                <p>Driver? {sessionStorage.getItem('driver')}</p>
                <p>User Id? {sessionStorage.getItem('userId')}</p>
                <Button onClick={this.getLocation}>Click</Button>
                {
                    this.state.latitude !== 0 && this.state.longitude !== 0 && (
                        <div>
                            <p>Latitude: {this.state.latitude}</p>
                            <p>Longitude: {this.state.longitude}</p>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Home;
