import axios from 'axios';

// makes api call to add a new driver to the database
export const addDriver = (userId, isDriver, status, latitude, longitude, callback) => {
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
            if (callback) {
                callback();
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

export const updateFixedDriverStatus = (driverId, newStatus, callback) => {
    if (driverId !== null) {
        axios.post('/api/updatefixedstatus', {
            fixedDriverId: driverId,
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
    if (isDriver === 'true' && userId !== null) {
        axios.post('/api/updatelocation', {
            userId: userId,
            latitude: newLatitude,
            longitude: newLongitude,
        })
        .then((response) => {
            console.log(response);
            console.log('Location updated');
            if(callback) {
                callback(response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};

export const updateFixedDriverLocation = (driverId, newLatitude, newLongitude, callback) => {
    console.log(driverId);
    if (driverId !== null) {
        axios.post('/api/updatefixedlocation', {
            fixedDriverId: driverId,
            latitude: newLatitude,
            longitude: newLongitude,
        })
        .then((response) => {
            console.log(response);
            console.log('Location updated');
            if(callback) {
                callback(response);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

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

export const isCreditCardValid = (ccNumber, ccType) => {
    let results = "";
    switch(ccType) {
        case "visa":
            if (ccNumber.substring(0,1) !== '4') {
                results += "Visa cards must start with a 4.";
            }
            break;
        case "mastercard":
            let number = parseInt(ccNumber.substring(0,2), 10);
            if (number < 50 || number > 55) {
                results += "First two digits of mastercards must be between 50-55";
            }
            break;
        case "amex":
            if (ccNumber.substring(0,2) !== '34' || ccNumber.substring(0,2) !== '37') {
                results += "American Express first two digits must be 34 or 37.";
            }
            break;
        case "discover":
            //Discover Card	6011, 622126-622925, 644-649, 65
            let typeOne = parseInt(ccNumber.substring(0,7), 10);
            let typeTwo = parseInt(ccNumber.substring(0,4), 10);
            let typeThree = parseInt(ccNumber.substring(0,1), 10);
            let typeFour = parseInt(ccNumber.substring(0,4), 10);
            let isValid = false;
            if (typeOne >= 62216 && typeOne <= 62295) {
                isValid = true;
            }

            if (typeTwo >= 644 && typeTwo <= 649) {
                isValid = true;
            }

            if (typeThree === 65) {
                isValid = true;
            }

            if (typeFour === 6011) {
                isValid = true;
            }
            if (isValid === false) {
                results += "Discover cards must start with 6011, 65, or be between 62216-622925 or 644-649";
            }
            break;
        default:
            results += "";
    }
    return results;
}
