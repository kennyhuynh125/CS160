import axios from 'axios';

// makes api call to add a new driver to the database
export const addDriver = (
  userId,
  isDriver,
  status,
  latitude,
  longitude,
  callback
) => {
  if (isDriver === 'true' && userId !== null) {
    axios
      .post('/api/adddriver', {
        userId,
        status,
        currentLatitude: latitude,
        currentLongitude: longitude,
      })
      .then(response => {
        if (response.data) {
          console.log('Added new driver');
        } else {
          console.log('Driver already in db');
        }
        if (callback) {
          callback();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};

// makes api call to update driver status
export const updateDriverStatus = (userId, isDriver, newStatus, callback) => {
  if (isDriver === 'true' && userId !== null) {
    axios
      .post('/api/updatestatus', {
        userId,
        status: newStatus,
      })
      .then(response => {
        console.log(response);
        console.log('Status updated.');
        if (callback) {
          callback();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export const updateFixedDriverStatus = (driverId, newStatus, callback) => {
  if (driverId !== null) {
    axios
      .post('/api/updatefixedstatus', {
        fixedDriverId: driverId,
        status: newStatus,
      })
      .then(response => {
        console.log(response);
        console.log('Status updated.');
        if (callback) {
          callback();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};

// make api call to update driver's latitude and longitude
export const updateDriverLocation = (
  userId,
  isDriver,
  newLatitude,
  newLongitude,
  callback
) => {
  if (isDriver === 'true' && userId !== null) {
    axios
      .post('/api/updatelocation', {
        userId,
        latitude: newLatitude,
        longitude: newLongitude,
      })
      .then(response => {
        console.log(response);
        console.log('Location updated');
        if (callback) {
          callback(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export const updateFixedDriverLocation = (
  driverId,
  newLatitude,
  newLongitude,
  callback
) => {
  console.log(driverId);
  if (driverId !== null) {
    axios
      .post('/api/updatefixedlocation', {
        fixedDriverId: driverId,
        latitude: newLatitude,
        longitude: newLongitude,
      })
      .then(response => {
        console.log(response);
        console.log('Location updated');
        if (callback) {
          callback(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};

// make api call to update request decision.
export const updateRequest = (driverUserId, accepted, callback) => {
  axios
    .post('/api/updaterequest', {
      driverUserId,
      accepted,
    })
    .then(response => {
      console.log('updated.');
      console.log(response);
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      console.log(error);
    });
};
