'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationState {
    address: string;
    lat: number | null;
    lng: number | null;
    countryCode: string | null; // ISO 3-digit
    postalCode: string | null;
}

interface LocationContextType {
    location: LocationState;
    setAddress: (locationData: LocationState) => void;
    // Backwards compatibility for now (or convenience helper)
    addressString: string;

    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_LOCATION: LocationState = {
    address: 'Select Location',
    lat: null,
    lng: null,
    countryCode: null,
    postalCode: null
};

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocationState] = useState<LocationState>(DEFAULT_LOCATION);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const savedLocation = localStorage.getItem('user_location_data');
        if (savedLocation) {
            try {
                const parsed = JSON.parse(savedLocation);
                setLocationState(parsed);
            } catch (e) {
                console.error("Failed to parse saved location", e);
                // Fallback to legacy address if exists
                const legacyAddress = localStorage.getItem('delivery_address');
                if (legacyAddress) {
                    setLocationState({
                        ...DEFAULT_LOCATION,
                        address: legacyAddress
                    });
                }
            }
        } else {
            // Fallback to legacy address if exists
            const legacyAddress = localStorage.getItem('delivery_address');
            if (legacyAddress) {
                setLocationState({
                    ...DEFAULT_LOCATION,
                    address: legacyAddress
                });
            }
        }
    }, []);

    const setAddress = (newLocation: LocationState) => {
        setLocationState(newLocation);
        localStorage.setItem('user_location_data', JSON.stringify(newLocation));
        localStorage.setItem('delivery_address', newLocation.address); // keep legacy sync
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <LocationContext.Provider
            value={{
                location,
                setAddress,
                addressString: location.address,
                isModalOpen,
                openModal,
                closeModal
            }}
        >
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
