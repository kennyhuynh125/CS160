import React, {Component} from 'react';
import {Container, Button, Form, FormGroup, Alert, Row, Col} from 'reactstrap';
import axios from 'axios';
import history from '../../history';
import {StandaloneSearchBox, MapWithADirectionsRenderer} from '../Reusable'
import AirportDropdown from '../Booking/AirportDropdown'

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
	select1 = (event) => {
	let targettext = event.target.labelText
	let targetval = event.target.value
    this.setState(prevState => ({
		dropdown1text: targettext,
		start: targetval 
		}));
	}

    render() {
		let SFO = [37.6213129,-122.3789554];
		let OAK = [37.7125689,-122.2197428];
		let SJO = [37.3639472,-121.92893750000002];
        return (
            <Container>
                <h1>Book a ride</h1>
					<StandaloneSearchBox onPlacesChanged={this.updateStart}/>
					<AirportDropdown labelText={this.state.dropdown1text} 
						label1="San Francisco International Airport"
						label2="Oakland International Airport"
						label3="San Jose International Airport"
						loc1="a" 
						loc2="b" 
						loc3="c" 
						onSelect={this.select1}/>
					<p>Start Latitude: {this.state.start[0]}</p>
					<p>Start Longitude: {this.state.start[1]}</p>
					<StandaloneSearchBox onPlacesChanged={this.updateDestination}/>
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
