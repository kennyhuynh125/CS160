import React, { Component } from 'react';
import { Button, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledAlert } from 'reactstrap';
import axios from 'axios';

import RideRequestInformation from '../RideRequestInformation';
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
            newLatitude: 0,
            newLongitude: 0,
            driverId: '',
            foundRider: false,
            interval: null,
            rideRequestInfo: {},
            hasAccepted: null,
        }
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
                    }, () => {
                        clearInterval(this.state.interval);
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
                clearInterval(this.state.interval);
            } else if (newStatus === 1) {
                interval = setInterval(() => { this.checkForNewCustomers(userId) }, 3000); 
            }
            this.setState({
                hasUpdatedStatus: true,
                interval: interval,
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
                    if (response === true) {
                        this.setState({
                            hasUpdatedLocation: true,
                            newLatitude: latitude,
                            newLongitude: longitude,
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
        // set accepted column in db to 1 and drive
        const userId = sessionStorage.getItem('userId');
        updateRequest(userId, 1, () => {
            // call updateStatus here
            this.setState({
                hasAccepted: true,
                foundRider: false,
            }, () => {
                clearInterval(this.state.interval);
            });
        });

    }

    // if user declines ride request, notify customer and start looking for rides again.
    decline = () => {
        // set accepted column in db to 0
        const userId = sessionStorage.getItem('userId');
        updateRequest(userId, -1, () => {
            this.setState({
                hasAcepted: false,
                foundRider: false,
            }, () => {
                let interval = setInterval(() => { this.checkForNewCustomers(userId) }, 3000);
                this.setState({
                    interval: interval,
                });
            });
        });
    }

    render() {
        return (
            <div>
                <div style={SPACER} />
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
                                Successfully updated location!
                                New Location:
                                Latitude: {this.state.newLatitude}
                                Longitude: {this.state.newLongitude}
                            </UncontrolledAlert>
                        )
                    }
                </Col>
                {
                    this.state.foundRider && (
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
                    !this.state.foundRider && this.state.hasAccepted && (
                        <UncontrolledAlert color="success">
                            Ride request accepted. Customer has been notified.
                        </UncontrolledAlert>
                    )
                }
                {
                    !this.state.foundRider && this.state.hasAccepted === false && (
                        <UncontrolledAlert color="danger">
                            Ride request declined. Customer has been notified.
                        </UncontrolledAlert>
                    )
                }
            </div>
        )
    }
}

export default DriverHomePage;
