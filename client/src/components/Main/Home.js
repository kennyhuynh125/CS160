import React, { Component } from 'react';
import { Container } from 'reactstrap';
import axios from 'axios';

import { CustomerHomePage, DriverHomePage } from './HomePages';

/*
This component is the main page when the user goes on our site.
*/
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            location: [],
            isDriver: null,
        }
    }

    componentDidMount() {
        const isDriver = sessionStorage.getItem('driver');
        this.setState({
            isDriver: (isDriver === 'true') ? true : (isDriver === 'false') ? false : null,
        });
    }
    getGeoLocation = () => {
        const geolocation = navigator.geolocation;
        if (geolocation) {
            geolocation.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            });
        } else {
            console.log('Not supported');
        }
    }

    getLocation = () => {
        const latitude = this.state.latitude;
        const longitude = this.state.longitude;
        axios.get(`/api/location/${latitude}/${longitude}`)
        .then((response) => {
            this.setState({ location: response.data });
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <Container>
                <center>
                    <div>
                        {
                            this.state.isDriver === false && (
                                <CustomerHomePage />
                            )
                        }
                        {
                            this.state.isDriver === true && (
                                <DriverHomePage />
                            )
                        }
                    </div>
                </center>
            </Container>
        )
    }
}

export default Home;
