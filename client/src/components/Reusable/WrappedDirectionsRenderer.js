import React, {Component} from 'react';
import MapWithADirectionsRenderer from './DirectionsRenderer';
/*
This component renders the form for users to log in.
Form contains field for username and password.
*/
class WrappedDirectionsRenderer extends Component {

    render() {
        return (
            <MapWithADirectionsRenderer 
                latitude={this.props.startLat} 
                longitude={this.props.startLong} 
                destLatitude={this.props.destLat} 
                destLongitude={this.props.destLong}
                setPath={this.props.setPath}/> 
        )
    }
}
export default WrappedDirectionsRenderer;
