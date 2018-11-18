import axios from 'axios';

// makes api call to add a new driver to the database
export const addDriver = (userId, isDriver, status, latitude, longitude) => {
    alert('called')
    if (isDriver && userId !== null) {
        alert('passed')
        axios.post('/api/adddriver', {
            userId: userId,
            status: status,
            currentLatitude: latitude,
            currentLongitude: longitude
        })
        .then((response) => {
            if (response.data) {
                alert('Added new driver')
                console.log('Added new driver');
            } else {
                alert('Driver already in db')
                console.log('Driver already in db');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};

// makes api call to update driver status
export const updateDriverStatus = (userId, isDriver, newStatus, callback) => {
    if (isDriver === 'true' && userId !== null) {
        axios.post('/api/updatestatus', {
            userId: userId,
            status: newStatus
        })
        .then((response) => {
            console.log(response);
            console.log('Status updated.');
            if (callback) {
                callback();
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};

// make api call to update driver's latitude and longitude
export const updateDriverLocation = (userId, isDriver, newLatitude, newLongitude, callback) => {
    if (isDriver && userId !== null) {
        axios.post('/api/updatelocation', {
            userId: userId,
            latitude: newLatitude,
            longitude: newLongitude,
        })
        .then((response) => {
            console.log(response);
            console.log('Location updated');
            if(callback) {
                callback();
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};

// make api call to update request decision.
export const updateRequest = (driverUserId, accepted, callback) => {
    axios.post('/api/updaterequest', {
        driverUserId: driverUserId,
        accepted: accepted,
    })
    .then((response) => {
        console.log('updated.');
        console.log(response);
        if(callback) {
            callback(response);
        }
    })
    .catch((error) => {
        console.log(error);
    });
}
