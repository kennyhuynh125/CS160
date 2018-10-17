import axios from 'axios';

// makes api call to add a new driver to the database
export const addDriver = (userId, isDriver, status, latitude, longitude) => {
    if (isDriver === 'true' && userId !== null) {
        axios.post('/api/adddriver', {
            userId: userId,
            status: status,
            currentLatitude: latitude,
            currentLongitude: longitude
        })
        .then((response) => {
            if (response.data) {
                console.log('Added new driver');
            } else {
                console.log('Driver already in db');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};

// makes api call to update driver status
export const updateDriverStatus = (userId, isDriver, newStatus) => {
    if (isDriver === 'true' && userId !== null) {
        axios.post('/api/updatestatus', {
            userId: userId,
            status: newStatus
        })
        .then((response) => {
            console.log(response);
            console.log('Status updated.');
        })
        .catch((error) => {
            console.log(error);
        });
    }
};

// make api call to update driver's latitude and longitude
export const updateDriverLocation = (userId, isDriver, newLatitude, newLongitude) => {
    if (isDriver === 'true' && userId !== null) {
        axios.post('/api/updatelocation', {
            userId: userId,
            latitude: newLatitude,
            longitude: newLongitude,
        })
        .then((response) => {
            console.log(response);
            console.log('Location updated');
        })
        .catch((error) => {
            console.log(error);
        });
    }
};