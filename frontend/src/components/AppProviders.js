import React from 'react';
import {ParkingProvider} from '../context/ParkingContext';
import {BookingProvider} from '../context/BookingContext';

export const ParkingWrapper = ({children}) => (
    <ParkingProvider>
        {children}
    </ParkingProvider>
);

export const BookingWrapper = ({children}) => (
    <BookingProvider>
        {children}
    </BookingProvider>
);

export const AllProvidersWrapper = ({children}) => (
    <ParkingProvider>
        <BookingProvider>
            {children}
        </BookingProvider>
    </ParkingProvider>
);
