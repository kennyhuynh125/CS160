import React, {Component} from 'react';
import {Container, Button, Row, Col, Form } from 'reactstrap';
import axios from 'axios';
import AirportDropdown from '../AirportDropdown';
import StandaloneSearchBox from '../Reusable/Searchbox'
import MapWithADirectionsRenderer from '../Reusable/DirectionsRenderer'
import {
	SFO,
	OAK,
	SJO,
	SPACER
} from '../../constants';

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
			dropdDown1: false,
			dropDown1Text: "Select Airport",
			dropDown2: false,
			dropDown2Text: "Select Airport",
			toAirport: false,
			fromAirport: false,
			currentLatitude: 0,
			currentLongitude: 0,
			nearestDriver: -1,
			distance: -1,
			duration: -1,
			fare: 0,
			path: new Array(),
        }
	}
	
	// when component mounts, get the user's current location
	componentDidMount() {
        this.getGeoLocation()
	}
	
    getGeoLocation = () => {
        const geolocation = navigator.geolocation;
        if (geolocation) {
            geolocation.getCurrentPosition((position) => {
                this.setState({
                    currentLatitude: position.coords.latitude,
                    currentLongitude: position.coords.longitude
                })
            });
        } else {
            console.log('Not supported');
        }
	}
	
	// handles changes in start location
    updateStart = (lat, lng) => {
		this.setState({
			start:[lat,lng]
		}, () => {
			this.getDistanceAndDuration()
		});
	}
	
	// make api request to get distance and duration from point A to point B
	getDistanceAndDuration() {
		axios.post('/api/getdirectioninfo', {
			startLat: this.state.start[0],
			startLong: this.state.start[1],
			destLat: this.state.dest[0],
			destLong: this.state.dest[1],
		})
		.then((response) => {
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
        this.setState({
			dest:[lat,lng]
		}, () => {
			this.getDistanceAndDuration()
		});
	}
	
    refreshMap = () => {
		this.setState({
			refresh: true
		});
	}

	toggle1 = () => {
    this.setState({
		dropDown1: !this.state.dropDown1,
		});
	}

	// change state when user selects new dropdown option
	select1 = (event) => {
	const chosenAirport = event.target.innerText;
	const targetVal = event.target.value.split(",");
	const coordinates = [parseFloat(targetVal[0],10), parseFloat(targetVal[1],10)]
    this.setState({
		dropDown1Text: chosenAirport,
		start: coordinates,
		}, () => {
			this.getDistanceAndDuration()
		});
	}

	toggle2 = () => {
    this.setState({
		dropDown2: !this.state.dropDown2,
		});
	}

	// change state when user selects new dropdown option
	select2 = (event) => {
	const chosenAirport = event.target.innerText;
	const targetVal = event.target.value.split(",");
	const coordinates = [parseFloat(targetVal[0],10), parseFloat(targetVal[1],10)]
    this.setState({
		dropDown2Text: chosenAirport,
		dest: coordinates,
		}, () => {
			this.getDistanceAndDuration()
		});
	}

	handleToAirportChange = () => {
		this.setState({
			start: [this.state.currentLatitude, this.state.currentLongitude],
			dest: [0,0],
			toAirport: true,
			fromAirport: false,
		});
	}

	handleFromAirportChange = () => {
		this.setState({
			start: [0,0],
			dest: [0,0],
			toAirport: false,
			fromAirport: true,
		});
	}

	// makes api call to get nearest driver
	getDriver = () => {
		axios.post(`/api/getdriver`, {
			latitude: this.state.start[0],
			longitude: this.state.start[1],
		})
		.then((response) => {
			this.setState({
				nearestDriver: response.data[0].duration,
			})
			console.log(response);
		});
	}

	calculateFare = () => {
		if(this.state.distance <= 2) this.setState({fare: 0,});
		else this.setState({fare: 15 + 0.5 * this.state.distance + 0.25 * this.state.duration,});
	}

    render() {
		console.log(this.state);
        return (
            <Container>
                <h1>Book a Ride</h1>
					<Row>
						<Col xs="3">
							<Button color="primary" onClick={this.handleToAirportChange}>To Airport</Button>
						</Col>
						<div style={SPACER} />
						<Col xs="3">
							<Button color="primary" onClick={this.handleFromAirportChange}>From Airport</Button>
						</Col>
					</Row>
					<div style={SPACER} />
					{
						this.state.toAirport && (
							<div>
								<h1>Select Destination Airport</h1>
								<AirportDropdown
									labelText={this.state.dropDown2Text}
									label1={'SFO'}
									label2={'OAK'}
									label3={'SJO'}
									loc1={SFO}
									loc2={OAK}
									loc3={SJO}
									onClick={this.select2}
								/>
								<div style={SPACER} />
							</div>
						)
					}
					{
						this.state.fromAirport && (
							<div>
								<h1>Select Airport to Depart From</h1>
								<AirportDropdown
									labelText={this.state.dropDown1Text}
									label1={'SFO'}
									label2={'OAK'}
									label3={'SJO'}
									loc1={SFO}
									loc2={OAK}
									loc3={SJO}
									onClick={this.select1}
								/>
								<div style={SPACER} />
								<h1>Select Destination Location</h1>
								<StandaloneSearchBox onPlacesChanged={this.updateDestination}/>
								<div style={SPACER} />
							</div>
						)
					}
					{
						(this.state.toAirport || this.state.fromAirport) && (
							<div>
								<MapWithADirectionsRenderer 
									latitude={this.state.start[0]} 
									longitude={this.state.start[1]} 
									destLatitude={this.state.dest[0]} 
									destLongitude={this.state.dest[1]} 
                            	/>
								<div style={SPACER} />
								{
									this.state.duration !== -1 && this.state.distance !== -1 && (
										<div>
											<p><b>Distance:</b> {this.state.distance} miles</p>
											<p><b>Duration:</b> {this.state.duration} minutes</p>
											<p><b>Fare:</b> ${this.state.fare}</p>
										</div>
									)
								}
								{
									this.state.nearestDriver !== -1 && this.state.nearestDriver <= 30 && (
										<p>Nearest driver is {this.state.nearestDriver} minutes away.</p>
									)
								}
								{
									this.state.nearestDriver !== -1 && this.state.nearestDriver > 30 && (
										<p>There are no drivers in your area. Please try again later.</p>
									)
								}
								{this.state.refresh && (<p>Replace with call to backend</p>)}
								<Form>
									<Button onClick={this.getDriver}>Request a Ride</Button>
								</Form>
							</div>
						)
					}
            </Container>
        )
    }
}

export default Booking;
