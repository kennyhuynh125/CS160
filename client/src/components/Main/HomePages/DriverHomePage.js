import React, { Component } from 'react';
import { Button, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledAlert } from 'reactstrap';
import {
    updateDriverStatus,
    updateDriverLocation,
} from '../../../helper';
import {
    SPACER
} from '../../../constants';

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
        }
    }

    // makes request to api to update status
    updateStatus = () => {
        const userId = sessionStorage.getItem('userId');
        const isDriver = sessionStorage.getItem('driver');
        const newStatus = this.state.selectedStatus;
        updateDriverStatus(userId, isDriver, newStatus, () => {
            this.setState({
                hasUpdatedStatus: true,
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
                updateDriverLocation(userId, isDriver, latitude, longitude, () => {
                    this.setState({
                        hasUpdatedLocation: true,
                        newLatitude: latitude,
                        newLongitude: longitude,
                    });
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

    render() {
        return (
            <div>
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
            </div>
        )
    }
}

export default DriverHomePage;
