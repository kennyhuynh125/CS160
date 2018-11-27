import React, { Component } from 'react';
import { Container } from 'reactstrap';
import axios from 'axios';

import CustomerHomePage from '../CustomerHomePage';
import DriverHomePage from '../DriverHomePage';
import BlockedPage from '../BlockedPage';

/*
This component is distinguished from Home in that this page displays the customer or driver homepage as necessary
*/
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      location: [],
      isCustomer: null,
      isLoggedIn: false,
      allowedLocation: true,
    };
  }

  componentDidMount() {
    const isCustomer = sessionStorage.getItem('customer');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    this.setState({
      isCustomer:
        isCustomer === 'true' ? true : isCustomer === 'false' ? false : null,
      isLoggedIn:
        isLoggedIn === 'true' ? true : isLoggedIn === 'false' ? false : null,
    });
    this.getGeoLocation();
  }

  getGeoLocation = () => {
    const geolocation = navigator.geolocation;

    if (geolocation) {
      geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.log(error);
          if (error.code !== undefined && error.code === 1) {
            this.setState({
              allowedLocation: false,
            });
          }
        }
      );
    } else {
      console.log('Not supported');
    }
  };

  getLocation = () => {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    axios
      .get(`/api/location/${latitude}/${longitude}`)
      .then(response => {
        this.setState({ location: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <Container>
        <center>
          {this.state.allowedLocation && (
            <div>
              {this.state.isCustomer === true && <CustomerHomePage />}
              {this.state.isCustomer === false && <DriverHomePage />}
            </div>
          )}
          {!this.state.allowedLocation && <BlockedPage />}
        </center>
      </Container>
    );
  }
}

export default HomePage;
