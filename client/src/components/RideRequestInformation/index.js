import React from 'react';
import { Button } from 'reactstrap';

const RideRequestInformation = props => (
  <div>
    <p>Details:</p>
    <p>Customer Location: {`${props.customerLat} / ${props.customerLong}`}</p>
    <p>
      Destination Location:{' '}
      {`${props.destinationLat} / ${props.destinationLat}`}
    </p>
    <Button color="primary" onClick={props.accept}>
      Accept?
    </Button>
    <Button color="danger" onClick={props.decline}>
      Decline?
    </Button>
  </div>
);

export default RideRequestInformation;
