import React from 'react';
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs } from 'react-google-maps';
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';

const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyDkOgKW9d-YxAC_8kar8EZ-aL90qazdSNc&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        places: [],
        isInvalidLocation: false,
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          this.setState(
            {
              places,
            },
            () => {
              const destination = this.state.places[0];
              if (destination === undefined) {
                this.setState({
                  isInvalidLocation: true,
                });
              } else {
                this.setState(
                  {
                    isInvalidLocation: false,
                  },
                  () => {
                    const destLat = destination.geometry.location.lat();
                    const destLng = destination.geometry.location.lng();
                    this.props.onPlacesChanged(destLat, destLng);
                  }
                );
              }
            }
          );
        },
      });
    },
  }),
  withScriptjs
)(props => (
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </StandaloneSearchBox>
    {props.isInvalidLocation && (
      <p>Inputted location is not valid. Please enter another one.</p>
    )}
  </div>
));
export default PlacesWithStandaloneSearchBox;
