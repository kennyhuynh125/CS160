import React, { Component } from 'react';
import { Button, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledAlert } from 'reactstrap';
import axios from 'axios';
import BookingPayment from '../BookingPayment';
import BlockedPage from '../BlockedPage';
import RideRequestInformation from '../RideRequestInformation';
import MapWithADirectionsRenderer from '../Reusable/DirectionsRenderer'
import {
    updateDriverStatus,
    updateDriverLocation,
    updateRequest,
} from '../../helper';
import {
    SPACER
} from '../../constants';

/*
* This component is the home page when a user logs in as a driver.
*/
class DriverHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dropDownText: 'Select Status',
            selectedStatus: null,
            hasUpdatedStatus: false,
            hasUpdatedLocation: false,
            driverId: '',
            foundRider: false,
            findCustomerInterval: null,
            rideRequestInfo: {},
            hasAccepted: null,
            coordinates: [],
            initialDestCoords: [0,0],
            initialStartCoords: [0,0],
            walkPathInterval: null,
            coordinateIndex: 0,
            rideComplete: false,
            reachedCustomer: false,
            driverLatitude: 0,
            driverLongitude: 0,
            startCoords: [0,0],
            destCoords: [0,0],
            currentStatus: 0,
            allowedLocation: true,
        }
    }
    componentDidMount() {
        const userId = sessionStorage.getItem('userId');
        axios.post('/api/getcurrentdriver', {
            id: userId,
        })
        .then((response) => {
            console.log(response);
            if (response.data.length === 1) {
                this.setState({
                    driverLatitude: response.data[0].driverLatitude,
                    driverLongitude: response.data[0].driverLongitude,
                    driverId: response.data[0].driverId
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });   
    }

    checkForNewCustomers = (userId) => {
        console.log(userId);
       axios.post('/api/getdriverrequests', {
           driverUserId: userId,
       })
       .then((response) => {
           if (response.data.length > 0) {
               const rideRequestData = response.data[0];
               console.log(rideRequestData);
               if (rideRequestData.accepted === 0) {
                    this.setState({
                        foundRider: true,
                        rideRequestInfo: rideRequestData,
                        startCoords: [rideRequestData.customerLatitude, rideRequestData.customerLongitude],
                        destCoords: [rideRequestData.destinationLatitude, rideRequestData.destinationLongitude],
                    }, () => {
                        clearInterval(this.state.findCustomerInterval);
                    });
               }
           } else {
               console.log('No new requests for this driver');
           }
       })
       .catch((error) => {
           console.log(error);
       });
    }
    
    // makes request to api to update status
    updateStatus = () => {
        const userId = sessionStorage.getItem('userId');
        const isDriver = sessionStorage.getItem('driver');
        const newStatus = this.state.selectedStatus;
        updateDriverStatus(userId, isDriver, newStatus, () => {
            let interval;
            if (newStatus === 0) {
                clearInterval(this.state.findCustomerInterval);
            } else if (newStatus === 1) {
                interval = setInterval(() => { this.checkForNewCustomers(userId) }, 3000); 
            }
            this.setState({
                hasUpdatedStatus: true,
                findCustomerInterval: interval,
                currentStatus: newStatus,
            });
        })
    }

    // makes request to api to update location
    updateLocation = () => {
        const geolocation = navigator.geolocation;
        if (geolocation) {
            geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const userId = sessionStorage.getItem('userId');
                const isDriver = sessionStorage.getItem('driver');
                updateDriverLocation(userId, isDriver, latitude, longitude, (response) => {
                    if (response.data === true) {
                        this.setState({
                            hasUpdatedLocation: true,
                            driverLatitude: latitude,
                            driverLongitude: longitude,
                        });
                    }
                });
            });
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    // selects new status and set states based on chosen dropdown option
    selectStatus = (e) => {
        this.setState({
            dropDownText: e.target.innerText,
            selectedStatus: parseInt(e.target.value, 10),
            hasUpdatedStatus: false,
        })
    }

    // accepts customer request, notify customer that driver is coming.
    accept = () => {
        const userId = sessionStorage.getItem('userId');
        const isDriver = sessionStorage.getItem('driver');
        const initialStart = [this.state.startCoords[0], this.state.startCoords[1]];
        const initialDest = [this.state.destCoords[0], this.state.destCoords[1]];
        const dest = [this.state.startCoords[0], this.state.startCoords[1]];
        const start = [this.state.driverLatitude, this.state.driverLongitude];
        updateRequest(userId, 1, () => {
            updateDriverStatus(userId, isDriver, 3, () => {
                this.setState({
                    hasAccepted: true,
                    foundRider: true,
                    reachedCustomer: true,
                    startCoords: start,
					destCoords: dest,
					initialStartCoords: initialStart,
                    initialDestCoords: initialDest,
                    currentStatus: 3,
                    walkPathInterval: setInterval(() => { this.walkThroughPath(this.state.coordinateIndex)}, 250),
                }, () => {
                });
            })
        });
    }

    // if user declines ride request, notify customer and start looking for rides again.
    decline = () => {
        // set accepted column in db to 0
        const userId = sessionStorage.getItem('userId');
        updateRequest(userId, -1, () => {
            this.setState({
                hasAccepted: false,
                foundRider: false,
            }, () => {
                let interval = setInterval(() => { this.checkForNewCustomers(userId) }, 3000);
                this.setState({
                    findCustomerInterval: interval,
                });
            });
        });
    }

    // walks trough the path 
	walkThroughPath = (coordinateIndex) => {
		// driver to customer
		if (coordinateIndex >= this.state.coordinates.length && this.state.reachedCustomer) {
			alert('Picked up customer.');
			this.setState({
				coordinateIndex: 0,
				reachedCustomer: false,
				startCoords: this.state.initialStartCoords,
				destCoords: this.state.initialDestCoords,
			});
		} else if (coordinateIndex >= this.state.coordinates.length && this.state.reachedCustomer === false) {
			alert('Arrived at destination.');
			this.setState({
				rideComplete: true,
			}, () => {
                clearInterval(this.state.walkPathInterval);
			})
		} else {
			// walk through path until we get to customer or destination
			const point = this.state.coordinates[coordinateIndex];
			this.setState({
				coordinateIndex: this.state.coordinateIndex + 1,
				driverLatitude: point[0],
				driverLongitude: point[1],
			});
		}
	}

    setPath = (path) => {
		if(path !== null) {
			let points = []
			for (const point of path) {
				points.push([point.lat(), point.lng()]);
			}
			this.setState({
				coordinates: points,
			});
		}
    }
    
    render() {
        console.log(this.state);
        return (
            <div>
                <div style={SPACER} />
                {
                    this.state.allowedLocation && (
                        <div>
                            {
                                !this.state.foundRider && !this.state.rideComplete && (
                                    <div>
                                    <h1>Welcome back!</h1>
                                    To begin accepting rides or disable requests, update your status below.
                                    <div style={SPACER} />
                                    <Col>
                                        <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                                            <DropdownToggle caret>
                                                {this.state.dropDownText}
                                            </DropdownToggle>
                                        <DropdownMenu>
                                                <DropdownItem value={0} onClick={this.selectStatus}>Not Available</DropdownItem>
                                                <DropdownItem value={1} onClick={this.selectStatus}>Available</DropdownItem>
                                                </DropdownMenu>
                                        </Dropdown>
                                        <div style={SPACER} />
                                        {
                                            this.state.selectedStatus !== null && (
                                                <Button color="primary" onClick={this.updateStatus}>Update Status</Button>
                                            )
                                        }
                                        <div style={SPACER} />
                                        {
                                            this.state.hasUpdatedStatus && (
                                                <UncontrolledAlert color="success">Successfully updated status!</UncontrolledAlert>
                                            )
                                        }
                                    </Col>
                                    <div style={SPACER} />
                                    <Col>
                                        <Button color="primary" onClick={this.updateLocation}>Update Location</Button>
                                        <div style={SPACER} />
                                        {
                                            this.state.hasUpdatedLocation && (
                                                <UncontrolledAlert color="success">
                                                    <p>Successfully updated location! New Location:</p>
                                                    <p>Latitude: {this.state.driverLatitude}</p>
                                                    <p>Longitude: {this.state.driverLongitude}</p>
                                                </UncontrolledAlert>
                                            )
                                        }
                                    </Col>
                                </div>
                                )
                            }
                            {
                                this.state.foundRider && !this.state.rideComplete && (
                                    <div>
                                        {
                                            this.state.hasAccepted === null && (
                                                <div>
                                                    <p>A ride has been requested.</p>
                                                    <RideRequestInformation
                                                        customerLat={this.state.rideRequestInfo.customerLatitude}
                                                        customerLong={this.state.rideRequestInfo.customerLongitude}
                                                        destinationLat={this.state.rideRequestInfo.destinationLatitude}
                                                        destinationLong={this.state.rideRequestInfo.destinationLongitude}
                                                        accept={this.accept}
                                                        decline={this.decline}
                                                    />
                                                </div>
                                            )
                                        }
                                        {
                                            this.state.hasAccepted === true && (
                                                <div>
                                                    <UncontrolledAlert color="success">
                                                        <p>Ride request accepted. Customer has been notified.</p>
                                                        <p>Status has been set to DRIVING.</p>
                                                    </UncontrolledAlert>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                this.state.foundRider && this.state.hasAccepted === false && !this.state.rideComplete && (
                                    <UncontrolledAlert color="danger">
                                        Ride request declined. Customer has been notified.
                                    </UncontrolledAlert>
                                )
                            }
                            {
                                !this.state.rideComplete && (
                                    <MapWithADirectionsRenderer 
                                        latitude={this.state.startCoords[0]} 
                                        longitude={this.state.startCoords[1]} 
                                        destLatitude={this.state.destCoords[0]} 
                                        destLongitude={this.state.destCoords[1]}
                                        setPath={this.setPath}
                                        driverLat={this.state.driverLatitude}
                                        driverLng={this.state.driverLongitude}
                                    />
                                )
                            }
                            {
                                this.state.rideComplete && (
                                    <BookingPayment
                                        isDriver={true}
								    />
                                )
                            }
                        </div>
                    )
                }
                {
                    !this.state.allowedLocation && (
                        <BlockedPage />
                    )
                }
            </div>
        )
    }
}

export default DriverHomePage;
