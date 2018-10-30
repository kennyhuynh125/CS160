import React, {Component} from 'react';
import {Container, Button, Form, FormGroup, Alert, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import history from '../../history';
import StandaloneSearchBox from '../Reusable/searchbox'
import MapWithADirectionsRenderer from '../Reusable/directionsrenderer'

import { Margin, Padding } from 'styled-components-spacing';
/*
This component is the booking page, users can select or input locations
and then book a ride
*/
class Booking extends Component {
	
    constructor(props) {
        super(props);
		// This is really ugly
        this.state = {
            start: [0,0],
            dest: [0,0],
			refresh: false,
			locationError: false,
			dropdown1: false,
			dropdown1text: "Airports",
			dropdown2: false,
			dropdown2text: "Airports",
        }
		this.toggle1 = this.toggle1.bind(this);
		this.toggle2 = this.toggle2.bind(this);
		this.select1 = this.select1.bind(this);
		this.select2 = this.select2.bind(this);
    }
	// handles changes in start location
    updateStart = (lat, lng) => {
		this.setState({start:[lat,lng]})
    }
    // handles changes in end location
    updateDestination = (lat, lng) => {
        this.setState({dest:[lat,lng]})
    }
    refreshMap = () =>
	{
		//this.setState({refresh: false})
		this.setState({refresh: true})
	}
	toggle1() {
    this.setState(prevState => ({
		dropdown1: !prevState.dropdown1
		}));
	}
	select1(event) {
	let targettext = event.target.innerText
	let targetval = event.target.value
    this.setState(prevState => ({
		dropdown1: !prevState.dropdown1,
		dropdown1text: targettext,
		start: targetval 
		}));
	}
	toggle2() {
    this.setState(prevState => ({
		dropdown2: !prevState.dropdown2
		}));
	}
	select2(event) {
	let targettext = event.target.innerText
	let targetval = event.target.value
    this.setState(prevState => ({
		dropdown2: !prevState.dropdown2,
		dropdown2text: targettext,
		dest: targetval
		}));
	}
    // authenticates and logs user if username/password is valid
    authenticate = (e) => {
        let userId;
        let isDriver;
        /*axios.post(`/api/loguser`, {
            username: this.state.username,
            password: this.state.password,
        })
        .then((response) => { // logs user
            if (response.data) {
                sessionStorage.setItem('isLoggedIn', true);
                sessionStorage.setItem('driver', !this.state.isCustomer);
                sessionStorage.setItem('customer', this.state.isCustomer);
                sessionStorage.setItem('userId', response.data);
                userId = sessionStorage.getItem('userId');
                isDriver = sessionStorage.getItem('driver');
                const geolocation = navigator.geolocation;
                if (geolocation) {
                    geolocation.getCurrentPosition((position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        return addDriver(userId, isDriver, 1, latitude, longitude);
                    });
                }
				// push to home page on successful login
				history.push('/');
            } else {
				this.setState({
					loginError: true
				});	
            }
        })
        .catch((error) => {
            console.log(error);
        })
        e.preventDefault();
		*/
    }

    render() {
		let SFO = [37.6213129,-122.3789554];
		let OAK = [37.7125689,-122.2197428];
		let SJO = [37.3639472,-121.92893750000002];
        return (
            <Container>
                <h1>Book a ride</h1>
					<StandaloneSearchBox onPlacesChanged={this.updateStart}/>
					<p>{this.state.dropdown1.toString()}</p>
					<Dropdown isOpen={this.state.dropdown1} toggle={this.toggle1}>
						<DropdownToggle caret>
						{this.state.dropdown1text}
						</DropdownToggle>
						<DropdownMenu>
						<DropdownItem value={[37.6213129,-122.3789554]} onClick={this.select1}>San Francisco International Airport</DropdownItem>
						<DropdownItem value={OAK} onClick={this.select1}>Oakland International Airport</DropdownItem>
						<DropdownItem value={SJO} onClick={this.select1}>San Jose International Airport</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<p>Start Latitude: {this.state.start[0]}</p>
					<p>Start Longitude: {this.state.start[1]}</p>
					<StandaloneSearchBox onPlacesChanged={this.updateDestination}/>
					<Dropdown isOpen={this.state.dropdown2} toggle={this.toggle2}>
						<DropdownToggle caret>
						{this.state.dropdown2text}
						</DropdownToggle>
						<DropdownMenu>
						<DropdownItem value={[37.6213129,-122.3789554]} onClick={this.select2}>San Francisco International Airport</DropdownItem>
						<DropdownItem value={OAK} onClick={this.select2}>Oakland International Airport</DropdownItem>
						<DropdownItem value={SJO} onClick={this.select2}>San Jose International Airport</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<p>End Latitude: {this.state.dest[0]}</p>
					<p>End Longitude: {this.state.dest[1]}</p>
					<MapWithADirectionsRenderer 
                                latitude={this.state.start[0]} 
                                longitude={this.state.start[1]} 
                                destLatitude={this.state.dest[0]} 
                                destLongitude={this.state.dest[1]} 
                            />
					{this.state.refresh && (<p>Replace with call to backend</p>)}
				<Form onSubmit={this.authenticate}>
					<Padding top={{ mobile: 1, tablet: 1, desktop: 1 }}>
						<Button onClick={this.refreshMap}>Request a Ride</Button>
					</Padding>
                </Form>
            </Container>
        )
    }
}

export default Booking;
