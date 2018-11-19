import React from 'react';
import {
    SPACER
} from '../../constants';

const BlockedPage = () => {
    return (
        <div style={SPACER}>
            <center>
                <h2>Error: Browser not supported or location is blocked.</h2>
                <p>Please use a new browser or allow location settings and try again.</p>
            </center>
        </div>
    )
}

export default BlockedPage;
