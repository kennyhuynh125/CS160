import React, { Component } from 'react';
import { Container, Button, Row, Col, Form } from 'reactstrap';
import axios from 'axios';
import AirportDropdown from '../AirportDropdown';
import StandaloneSearchBox from '../Reusable/Searchbox';
import MapWithADirectionsRenderer from '../Reusable/DirectionsRenderer';
import BookingPayment from '../BookingPayment';
import BlockedPage from '../BlockedPage';
import { SFO, OAK, SJO, SPACER } from '../../constants';
import {
  updateDriverLocation,
  updateDriverStatus,
  updateFixedDriverLocation,
  updateFixedDriverStatus,
} from '../../helper';

/*
This component is the booking page, users can select or input locations
and then book a ride
*/
class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: [0, 0],
      dest: [0, 0],
      refresh: false,
      locationError: false,
      dropdDown1: false,
      dropDown1Text: 'Select Airport',
      dropDown2: false,
      dropDown2Text: 'Select Airport',
      toAirport: false,
      fromAirport: false,
      currentLatitude: 0,
      currentLongitude: 0,
      nearestDriver: -1,
      distance: -1,
      duration: -1,
      driverUserId: null,
      driverLatitude: 0,
      driverLongitude: 0,
      driverId: null,
      isWaiting: false,
      requestId: 0,
      driverHasAccepted: null,
      points: [],
      fare: 0,
      pointIndex: 0,
      driverToCustomer: false,
      initialStart: [],
      initialDest: [],
      updateDriverInterval: null,
      isFixedDriver: false,
      rideFinished: false,
      allowedLocation: true,
      savedCards: [],
      doneLoading: false,
      isRerouted: false,
      driverStatus: 0,
      statusInterval: null,
      notLoggedOn: false,
      selectedDestination: false,
      selectedStart: false,
    };
  }

  // when component mounts, get the user's current location
  componentDidMount() {
    const userId = sessionStorage.getItem('userId');
    if (userId === null) {
      this.setState({
        notLoggedOn: true,
      });
    } else {
      axios
        .get(`/api/getcards/${userId}`)
        .then(response => {
          this.setState({
            savedCards: response.data,
            doneLoading: true,
          });
        })
        .catch(error => {
          console.log(error.message);
        });
      this.getGeoLocation();
    }
  }

  getGeoLocation = () => {
    const geolocation = navigator.geolocation;
    if (geolocation) {
      geolocation.getCurrentPosition(
        position => {
          this.setState({
            currentLatitude: position.coords.latitude,
            currentLongitude: position.coords.longitude,
            allowedLocation: true,
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
      this.setState({
        allowedLocation: false,
      });
    }
  };

  // handles changes in start location
  updateStart = (lat, lng) => {
    this.setState(
      {
        start: [lat, lng],
      },
      () => {
        this.getDistanceAndDuration();
      }
    );
  };

  // make api request to get distance and duration from point A to point B
  getDistanceAndDuration() {
    axios
      .post('/api/getdirectioninfo', {
        startLat: this.state.start[0],
        startLong: this.state.start[1],
        destLat: this.state.dest[0],
        destLong: this.state.dest[1],
      })
      .then(response => {
        console.log(response);
        this.setState({
          duration: response.data[0].duration,
          distance: response.data[0].distance,
        });
        this.calculateFare();
      });
  }

  // handles changes in end location
  updateDestination = (lat, lng) => {
    this.setState(
      {
        dest: [lat, lng],
      },
      () => {
        this.getDistanceAndDuration();
        this.getDriver();
      }
    );
  };

  refreshMap = () => {
    this.setState({
      refresh: true,
    });
  };

  toggle1 = () => {
    this.setState({
      dropDown1: !this.state.dropDown1,
    });
  };

  // change state when user selects new dropdown option
  select1 = event => {
    const chosenAirport = event.target.innerText;
    const targetVal = event.target.value.split(',');
    const coordinates = [
      parseFloat(targetVal[0], 10),
      parseFloat(targetVal[1], 10),
    ];
    this.setState(
      {
        dropDown1Text: chosenAirport,
        start: coordinates,
        selectedStart: true,
      },
      () => {
        this.getDistanceAndDuration();
        this.getDriver();
      }
    );
  };

  toggle2 = () => {
    this.setState({
      dropDown2: !this.state.dropDown2,
    });
  };

  // change state when user selects new dropdown option
  select2 = event => {
    const chosenAirport = event.target.innerText;
    const targetVal = event.target.value.split(',');
    const coordinates = [
      parseFloat(targetVal[0], 10),
      parseFloat(targetVal[1], 10),
    ];
    this.setState(
      {
        dropDown2Text: chosenAirport,
        dest: coordinates,
        selectedDestination: true,
      },
      () => {
        this.getDistanceAndDuration();
        this.getDriver();
      }
    );
  };

  handleToAirportChange = () => {
    this.setState({
      start: [this.state.currentLatitude, this.state.currentLongitude],
      dest: [0, 0],
      toAirport: true,
      fromAirport: false,
      selectedDestination: false,
      selectedStart: false,
    });
  };

  handleFromAirportChange = () => {
    this.setState({
      start: [0, 0],
      dest: [0, 0],
      toAirport: false,
      fromAirport: true,
      selectedStart: false,
      selectedDestination: false,
    });
  };

  // makes api call to get nearest driver
  getDriver = () => {
    axios
      .post(`/api/getdriver`, {
        latitude: this.state.start[0],
        longitude: this.state.start[1],
      })
      .then(response => {
        console.log(response);
        this.setState({
          nearestDriver: response.data[0].duration,
          driverUserId: response.data[0].driverUserId,
          driverLatitude: response.data[0].driverLatitude,
          driverLongitude: response.data[0].driverLongitude,
          driverId: response.data[0].driverId,
          driverStatus: response.data[0].status,
        });
      });
  };

  // makes a request to nearest driver
  requestRide = () => {
    // null means that the nearest driver is a fixed driver
    // if available, start driving
    if (this.state.driverUserId === null) {
      const initialStart = [this.state.start[0], this.state.start[1]];
      const initialDest = [this.state.dest[0], this.state.dest[1]];
      const dest = [this.state.start[0], this.state.start[1]];
      const start = [this.state.driverLatitude, this.state.driverLongitude];
      axios
        .post('/api/addriderequest', {
          driverId: this.state.driverId,
          userId: null,
          customerLatitude: this.state.start[0],
          customerLongitude: this.state.start[1],
          destinationLatitude: this.state.dest[0],
          destinationLongitude: this.state.dest[1],
          driverLatitude: this.state.driverLatitude,
          driverLongitude: this.state.driverLongitude,
          accepted: 1,
        })
        .then(response => {
          if (response.data === true) {
            console.log('added fixed driver ride request to db');
          }
        })
        .catch(error => {
          console.log(error);
        });

      if (this.state.driverStatus === 2) {
        // 3 means that it has picked up another customer
        updateFixedDriverStatus(this.state.driverId, 3, () => {
          this.setState({
            driverToCustomer: true,
            start,
            dest,
            initialStart,
            initialDest,
            interval: setInterval(() => {
              this.walkThroughPath(this.state.pointIndex);
            }, 250),
            updateDriverInterval: setInterval(() => {
              this.updateLocation(false);
            }, 1000),
            isFixedDriver: true,
            driverStatus: 3,
          });
        });
      } else {
        updateFixedDriverStatus(this.state.driverId, 2, () => {
          this.setState({
            driverToCustomer: true,
            start,
            dest,
            initialStart,
            initialDest,
            interval: setInterval(() => {
              this.walkThroughPath(this.state.pointIndex);
            }, 250),
            updateDriverInterval: setInterval(() => {
              this.updateLocation(false);
            }, 1000),
            isFixedDriver: true,
            driverStatus: 2,
            isWaiting: false,
            driverHasAccepted: true,
          });
        });
      }
    } else {
      // driver is a user
      axios
        .post(`/api/addriderequest`, {
          driverId: this.state.driverId,
          userId: this.state.driverUserId,
          customerLatitude: this.state.start[0],
          customerLongitude: this.state.start[1],
          destinationLatitude: this.state.dest[0],
          destinationLongitude: this.state.dest[1],
          driverLatitude: this.state.driverLatitude,
          driverLongitude: this.state.driverLongitude,
          accepted: 0,
        })
        .then(response => {
          if (response.data !== false) {
            this.setState(
              {
                isWaiting: true,
                requestId: response.data,
              },
              () => {
                const interval = setInterval(() => {
                  this.findRide();
                }, 3000);
                this.setState({
                  interval,
                });
              }
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  // makes api call to check if driver accepted/decline ride request
  findRide = () => {
    axios
      .post('/api/getcustomerrequests', {
        requestId: this.state.requestId,
      })
      .then(response => {
        const request = response.data[0];
        if (request.accepted === 1) {
          clearInterval(this.state.interval);
          const initialStart = [this.state.start[0], this.state.start[1]];
          const initialDest = [this.state.dest[0], this.state.dest[1]];
          const dest = [this.state.start[0], this.state.start[1]];
          const start = [this.state.driverLatitude, this.state.driverLongitude];
          updateDriverStatus(this.state.driverUserId, 'true', 3, () => {
            this.setState({
              driverHasAccepted: true,
              driverToCustomer: true,
              isWaiting: false,
              start,
              dest,
              initialStart,
              initialDest,
              driverStatus: 3,
              interval: setInterval(() => {
                this.walkThroughPath(this.state.pointIndex);
              }, 250),
              updateDriverInterval: setInterval(() => {
                this.updateLocation(true);
              }, 1000),
            });
          });
        } else if (request.accepted === -1) {
          this.setState(
            {
              driverHasAccepted: false,
              driverToCustomer: false,
              isWaiting: false,
              selectedStart: false,
              selectedDestination: false,
            },
            () => {
              clearInterval(this.state.interval);
              clearInterval(this.state.updateDriverInterval);
            }
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // calculates fare based on distance and duration
  calculateFare = () => {
    if (this.state.distance <= 2) {
      this.setState({
        fare: 0,
      });
    } else if (this.state.isRerouted === true) {
      this.setState({
        fare: (
          15 +
          0.5 * this.state.distance +
          0.25 * this.state.duration -
          10
        ).toFixed(2),
      });
    } else {
      this.setState({
        fare: (
          15 +
          0.5 * this.state.distance +
          0.25 * this.state.duration
        ).toFixed(2),
      });
    }
  };

  // sets array of points along the route
  setPath = path => {
    if (path !== null) {
      const points = [];
      for (const point of path) {
        points.push([point.lat(), point.lng()]);
      }
      this.setState({
        point: points,
      });
    }
  };

  // walks trough the path
  walkThroughPath = pointIndex => {
    // driver to customer
    if (pointIndex >= this.state.point.length && this.state.driverToCustomer) {
      alert('Driver has arrived.');
      this.setState({
        pointIndex: 0,
        driverToCustomer: false,
        start: this.state.initialStart,
        dest: this.state.initialDest,
        statusInterval: setInterval(() => {
          this.getDriverStatus();
        }, 2000),
      });
    } else if (
      pointIndex >= this.state.point.length &&
      this.state.driverToCustomer === false
    ) {
      // if driver reaches destination, update status/location of driver and clear intervals
      const destination = Object.assign([], this.state.dest);
      alert('You have arrived at your destination.');
      this.setState(
        {
          rideFinished: true,
        },
        () => {
          if (this.state.isFixedDriver === true) {
            updateFixedDriverLocation(
              this.state.driverId,
              destination[0],
              destination[1]
            );
            updateFixedDriverStatus(this.state.driverId, 1);
          } else {
            updateDriverLocation(
              this.state.driverUserId,
              'true',
              destination[0],
              destination[1]
            );
            updateDriverStatus(this.state.driverUserId, 'true', 1);
          }
          clearInterval(this.state.interval);
          clearInterval(this.state.updateDriverInterval);
          clearInterval(this.state.statusInterval);
        }
      );
    } else {
      // walk through path until we get to customer or destination
      const point = this.state.point[pointIndex];
      this.setState({
        pointIndex: this.state.pointIndex + 1,
        driverLatitude: point[0],
        driverLongitude: point[1],
      });
    }
  };

  // updates driver's location to the current coordinate
  updateLocation = isUser => {
    if (this.state.pointIndex < this.state.point.length) {
      const coordinate = this.state.point[this.state.pointIndex];
      if (isUser) {
        updateDriverLocation(
          this.state.driverUserId,
          'true',
          coordinate[0],
          coordinate[1],
          () => {
            console.log('driver location updated.');
          }
        );
      } else {
        updateFixedDriverLocation(
          this.state.driverId,
          coordinate[0],
          coordinate[1],
          () => {
            console.log('driver location updated.');
          }
        );
      }
    }
  };

  // set interval to get driver status to see if it changes
  getDriverStatus = () => {
    axios
      .post('/api/driverstatus', {
        driverId: this.state.driverId,
      })
      .then(response => {
        console.log(response);
        if (response.data.length !== 0) {
          const status =
            response.data[0].status !== null ? response.data[0].status : null;
          console.log('Current Status: ', status);
          if (status === 3 && status !== this.state.driverStatus) {
            const newStartLatitude =
              response.data[0].startLatitude !== null
                ? response.data[0].startLatitude
                : this.state.start[0];
            const newStartLongitude =
              response.data[0].startLongitude !== null
                ? response.data[0].startLongitude
                : this.state.start[1];
            alert(
              `There is a new passenger in your ride and will cause a reroute. You will get $10 discount at the end of the ride.`
            );
            this.setState(
              {
                driverStatus: 3,
                isRerouted: true,
                start: [newStartLatitude, newStartLongitude],
                pointIndex: 0,
              },
              () => {
                this.calculateFare();
                clearInterval(this.state.statusInterval);
                clearInterval(this.state.updateDriverInterval);
              }
            );
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        {this.state.doneLoading && (
          <Container>
            {this.state.allowedLocation && this.state.savedCards.length !== 0 && (
              <div>
                {!this.state.rideFinished && (
                  <div style={{ textAlign: 'center' }}>
                    <br />
                    <h1>Book a Ride</h1>
                    <Row>
                      <Col xs="6">
                        <Button
                          color="info"
                          onClick={this.handleToAirportChange}
                          block
                        >
                          To Airport
                        </Button>
                      </Col>
                      <Col xs="6">
                        <Button
                          color="info"
                          onClick={this.handleFromAirportChange}
                          block
                        >
                          From Airport
                        </Button>
                      </Col>
                    </Row>
                    <div style={SPACER} />
                    {this.state.toAirport && (
                      <div>
                        <hr />
                        <h2>Select Destination Airport</h2>
                        <AirportDropdown
                          labelText={this.state.dropDown2Text}
                          label1="SFO"
                          label2="OAK"
                          label3="SJC"
                          loc1={SFO}
                          loc2={OAK}
                          loc3={SJO}
                          onClick={this.select2}
                        />
                        <div style={SPACER} />
                      </div>
                    )}
                    {this.state.fromAirport && (
                      <div>
                        <hr />
                        <h2>Select Airport to Depart From</h2>
                        <AirportDropdown
                          labelText={this.state.dropDown1Text}
                          label1="SFO"
                          label2="OAK"
                          label3="SJO"
                          loc1={SFO}
                          loc2={OAK}
                          loc3={SJO}
                          onClick={this.select1}
                        />
                        <div style={SPACER} />
                        <h2>Select Destination Location</h2>
                        <StandaloneSearchBox
                          onPlacesChanged={this.updateDestination}
                        />
                        <div style={SPACER} />
                      </div>
                    )}
                    {(this.state.toAirport || this.state.fromAirport) && (
                      <div>
                        <div>
                          <MapWithADirectionsRenderer
                            latitude={this.state.start[0]}
                            longitude={this.state.start[1]}
                            destLatitude={this.state.dest[0]}
                            destLongitude={this.state.dest[1]}
                            setPath={this.setPath}
                            driverLat={this.state.driverLatitude}
                            driverLng={this.state.driverLongitude}
                          />
                        </div>
                        <div style={SPACER} />
                        {this.state.duration !== -1 &&
                          this.state.distance !== -1 && (
                            <div>
                              <h2>Ride Information</h2>
                              <p>
                                <b>Distance:</b> {this.state.distance} miles
                              </p>
                              <p>
                                <b>Duration:</b> {this.state.duration} minutes
                              </p>
                              <p>
                                <b>Fare:</b> ${this.state.fare}
                              </p>
                            </div>
                          )}
                        {this.state.nearestDriver !== -1 &&
                          this.state.nearestDriver <= 30 && (
                            <p>
                              Nearest driver is {this.state.nearestDriver}{' '}
                              minutes away.
                            </p>
                          )}
                        {this.state.nearestDriver !== -1 &&
                          this.state.nearestDriver > 30 && (
                            <p>
                              There are no drivers in your area. Please try
                              again later.
                            </p>
                          )}
                        {!this.state.isWaiting &&
                          this.state.driverHasAccepted !== true && (
                            <div>
                              {this.state.driverHasAccepted === false && (
                                <p>Driver declined. Please try again.</p>
                              )}
                              {(this.state.selectedStart ||
                                this.state.selectedDestination) &&
                                (this.state.nearestDriver >= 0 &&
                                  this.state.nearestDriver <= 30) && (
                                  <Form>
                                    <center>
                                      <hr />
                                      <Button
                                        onClick={this.requestRide}
                                        color="info"
                                      >
                                        Request a Ride
                                      </Button>
                                    </center>
                                  </Form>
                                )}
                              <div style={SPACER} />
                            </div>
                          )}
                        {this.state.isWaiting && <p>Notifying driver...</p>}
                        {!this.state.isWaiting &&
                          this.state.driverHasAccepted && (
                            <p>
                              Driver has accepted. Driver is now on its way.
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                )}
                {this.state.rideFinished && (
                  <BookingPayment
                    distance={this.state.distance}
                    duration={this.state.duration}
                    destination={`${this.state.dest[0]} / ${
                      this.state.dest[1]
                    }`}
                    totalCost={this.state.fare}
                    isRerouted={this.state.isRerouted}
                  />
                )}
              </div>
            )}
            {this.state.savedCards.length === 0 && this.state.allowedLocation && (
              <div style={SPACER}>
                <h3>
                  You do not have any cards saved! You cannot book unless you
                  have at least one card added to your account. Please go to the
                  Payment Settings page and add a new card first.
                </h3>
              </div>
            )}
            {!this.state.allowedLocation && <BlockedPage />}
          </Container>
        )}
        {this.state.notLoggedOn && (
          <div style={SPACER}>
            <h3>You must be logged on to view this page.</h3>
          </div>
        )}
      </div>
    );
  }
}

export default Booking;
