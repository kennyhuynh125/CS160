import React, {Component} from 'react';
import {Container, Button, Row, Col, Form } from 'reactstrap';
import axios from 'axios';
import AirportDropdown from './AirportDropdown';
import {StandaloneSearchBox, MapWithADirectionsRenderer, WrappedDirectionsRenderer} from '../Reusable'
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
            airportPos: [0,0],
            selectedPos: [0,0],
            currentPos: [0,0],
			dropDown1Text: "Select Airport",
            buttonText: 'To Airport',
            isToAirport: true,
			distance: -1,
			duration: -1,
			requestId: 0,
			points: [],
			fare: 0,
			pointIndex: 0,
			driverToCustomer: false,
			initialStart: [],
			initialDest: [],
            displayMessage: false,
            message: 'hi',
        }
	}
	
	// when component mounts, get the user's current location
	componentDidMount() {
        this.getGeoLocation()
        this.setState({
            start: this.state.currentPos
        })
	}
	
    getGeoLocation = () => {
        const geolocation = navigator.geolocation;
        if (geolocation) {
            geolocation.getCurrentPosition((position) => {
                this.setState({
                    currentPos: [position.coords.latitude, position.coords.longitude]
                })
            });
        } else {
            console.log('Not supported');
        }
	}
	componentWillReceiveProps(nextProps) {
    this.setState({
      airportPos: nextProps.airportPos,
      selectedPos: nextProps.selectedPos,
      currentPos: nextProps.currentPos,
    });
  }
	// handles changes in end location
    updateDestination = (lat, lng) => {
        this.setState({
			selectedPos:[lat,lng]
		}, () => {
			this.getDistanceAndDuration()
		});
	}
	// make api request to get distance and duration from point A to point B
	getDistanceAndDuration() {
		axios.post('/api/getdirectioninfo', {
			startLat: this.state.isToAirport ? this.state.currentPos[0] : this.state.airportPos[0],
			startLong: this.state.isToAirport ? this.state.currentPos[1] : this.state.airportPos[1],
			destLat: this.state.isToAirport ? this.state.airportPos[0] : this.state.selectedPos[0],
			destLong: this.state.isToAirport ? this.state.airportPos[1] : this.state.selectedPos[1],
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
	// change state when user selects new dropdown option
	select1 = (event) => {
	const chosenAirport = event.target.innerText;
	const targetVal = event.target.value.split(",");
	const coordinates = [parseFloat(targetVal[0],10), parseFloat(targetVal[1],10)]
    this.setState({
		dropDown1Text: chosenAirport,
		airportPos: coordinates,
		}, () => {
			this.getDistanceAndDuration();
		} );
	}

	handleDirectionToggle= () => {
        this.setState(prevState => ({
            isToAirport: !prevState.isToAirport,
            buttonText: prevState.buttonText === 'To Airport' ? 'From Airport' : 'To Airport',
            dropDown1Text: 'Select an Airport',
            airportPos: [0,0],
            selectedPos: [0,0],
        }));
	}

	requestRide2 = (isFixed) => {
		axios.post(`api/addriderequest`, {
			customerLatitude: this.state.start[0],
			customerLongitude: this.state.start[1],
			destinationLatitude: this.state.dest[0],
			destinationLongitude: this.state.dest[1],
			userId: sessionStorage.getItem('userId'),
            fixedDriver: true,
		}).then((response) => {
			if(response.data[0].id !== false) {
                this.setState({
                        displayMessage: true,
                        duration: response.data[0].duration,
						message: 'Notifying driver...',
						requestId: response.data,
					}, () => {
						const interval = setInterval(() => {this.findRide()}, 5000);
						this.setState({
							interval: interval,
						})
					});
			}
		})
	}

	// makes api call to check if driver accepted/decline ride request
	findRide = () => {
		axios.post('/api/getcustomerrequests', {
			requestId: this.state.requestId
		})
		.then((response) => {
			const request = response.data[0];
			if (request.accepted === 1) {
				this.setState({
					message: 'Driver has accepted. Driver is now on its way.',
					driverToCustomer: true,
					interval: setInterval(() => { this.walkThroughPath(this.state.pointIndex)}, 150),
				})
			} else if(request.accepted === -1) {
				this.setState({
                    message: 'Driver declined. Please try again.',
					driverToCustomer: false,
				}, () => {
					clearInterval(this.state.interval);
				});
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}

	// calculates fare based on distance and duration
	calculateFare = () => {
		if(this.state.distance <= 2) this.setState({fare: 0,});
		else this.setState({fare: 15 + 0.5 * this.state.distance + 0.25 * this.state.duration,});
	}
  
	// sets array of points along the route
	setPath = (path) => {
		if(path !== null) {
			let points = []
			for (const point of path) {
				points.push([point.lat(), point.lng()]);
			}
			this.setState({
				point: points,
			});
		}
	}

	// walks trough the path 
	walkThroughPath = (pointIndex) => {
		if (pointIndex >= this.state.point.length) {
			if(this.state.driverToCustomer) {	
				alert('Driver has arrived.');
				this.setState({
					pointIndex: 0,
					driverToCustomer: false,
					start: this.state.initialStart,
					dest: this.state.initialDest,
				});
			} else {
				alert('You have arrived at your destination.');
				this.setState({
					pointIndex: 0,
					start: [0,0],
					dest: [0,0],
					initialStart: [],
					initialDest: [],
				}, () => {
					clearInterval(this.state.interval);
				})
			}	
		} else {
			const point = this.state.point[pointIndex];
			this.setState({
				pointIndex: this.state.pointIndex + 1,
				driverLatitude: point[0],
				driverLongitude: point[1],
			});
		}
	}

    render() {
        return (
            <Container>
                <h1>Book a Ride</h1>
					<Row>
						<Col xs="3">
							<Button color="primary" onClick={this.handleDirectionToggle}>{this.state.buttonText} and {this.state.isToAirport.toString()}</Button>
						</Col>
						<div style={SPACER} />
					</Row>
					<div style={SPACER} />
					{
						<div>
							<h1>Select an Airport</h1>
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
                            { !this.state.isToAirport && (
                                <Container>
                                    <div style={SPACER} />
                                    <h1>Select Destination Location</h1>
                                    <StandaloneSearchBox onPlacesChanged={this.updateDestination}/>
                                    <div style={SPACER} />
                                </Container>
                            )}
						</div>
					}
					{
						<div>
                                <div>
                                <h1>{this.state.airportPos}</h1>
                                </div>
                            <div>
                            {
                                this.state.isToAirport && (
                                    <MapWithADirectionsRenderer 
                                    latitude={this.state.currentPos[0]} 
                                    longitude={this.state.currentPos[1]} 
                                    destLatitude={this.state.airportPos[0]} 
                                    destLongitude={this.state.airportPos[1]}
                                    setPath={this.setPath}/> 
                                ) || (
                                    <MapWithADirectionsRenderer 
                                    latitude={this.state.airportPos[0]} 
                                    longitude={this.state.airportPos[1]} 
                                    destLatitude={this.state.selectedPos[0]} 
                                    destLongitude={this.state.selectedPos[1]}
                                    setPath={this.setPath}/> 
                                )
                            }
                            
                        	</div>
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
                            {this.state.displayDriverTime && (
                                <p>Your driver is {this.state.message} minutes away</p>
                            )}
                            {
                                this.state.displayMessage && (
                                <p>{this.state.message}</p>
                            )}
                            <Form>
								<Button onClick={this.requestRide2}>Request a Ride</Button>
							</Form>
                        </div>
					}
            </Container>
        )
    }
}

export default Booking;
