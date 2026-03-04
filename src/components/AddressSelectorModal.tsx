'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useLocation, LocationState } from '@/context/LocationContext';
import config from '@/config.json';
import { getProductById } from '@/lib/product';


// Helper to find country code (ISO 3-digit) from address components
const findCountryCode = (components: google.maps.GeocoderAddressComponent[]): string | null => {
    const country = components.find(c => c.types.includes('country'));
    return country ? country.short_name : null; // Google often returns 2 digit, needs conversion if strict 3 digit required. 
    // VTEX often accepts ISO 3-digit (USA, BRA). 
    // Google Maps `short_name` is ISO-3166-1 alpha-2 (US, BR).
    // `long_name` is full name.

    // We might need a small mapping if VTEX STRICTLY fails on 2-digit.
    // NOTE: User prompt says "countryCode-ISO-3-digits". 
    // We will attempt to get 3 digit if possible or map common ones, but for now lets store what we get and handle mapping if needed.
    // Actually, we can use a library or a small map. Let's start with basic extraction.
};

// Map alpha-2 to alpha-3 for common countries if needed, or rely on downstream handling. 
// For now, let's implement a simple mapper for common ones to be safe.
const alpha2ToAlpha3: Record<string, string> = {
    'US': 'USA', 'AE': 'ARE', 'GB': 'GBR', 'BR': 'BRA', 'IN': 'IND', 'CA': 'CAN', 'AU': 'AUS',
    // ... add more as needed or use a package. 
};

const getAlpha3 = (code: string): string => {
    return alpha2ToAlpha3[code] || code; // Fallback to code if not in simple map
}


export default function AddressSelectorModal() {
    const { isModalOpen, closeModal, setAddress, location } = useLocation();
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [tempLocation, setTempLocation] = useState<Partial<LocationState>>({});

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const autocompleteInputRef = useRef<HTMLInputElement>(null);

    const [isLocating, setIsLocating] = useState(false);

    // Initialize map
    useEffect(() => {
        if (!isModalOpen) return;

        const initMap = async () => {
            const loader = new Loader({
                apiKey: config.globalSettings.googleMapsApiKey,
                version: 'weekly',
                libraries: ['places']
            });

            await loader.load();

            if (mapRef.current) {
                const initialLat = location.lat || 25.2048;
                const initialLng = location.lng || 55.2708;
                const initialPos = { lat: initialLat, lng: initialLng };

                // Reuse existing map if available to prevent flashing, but handling the blank issue
                // usually requires a fresh instance or a trigger.
                // Let's create a new one to be safe as this is a modal.
                const newMap = new google.maps.Map(mapRef.current, {
                    center: initialPos,
                    zoom: location.lat ? 17 : 13,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                const newMarker = new google.maps.Marker({
                    position: initialPos,
                    map: newMap,
                    draggable: true,
                });

                setMap(newMap);
                setMarker(newMarker);

                // Fix for blank map: Trigger a resize/re-center after a small delay
                // to allow modal animation to complete
                setTimeout(() => {
                    if (newMap) {
                        newMap.setCenter(initialPos);
                    }
                }, 300);

                if (location.address) {
                    setTempLocation(location);
                }

                // Add click listener to map
                newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
                    if (e.latLng) {
                        newMarker.setPosition(e.latLng);
                        updateAddressFromLatLng(e.latLng);
                    }
                });

                // Add dragend listener to marker
                newMarker.addListener('dragend', () => {
                    const position = newMarker.getPosition();
                    if (position) {
                        updateAddressFromLatLng(position);
                    }
                });

                // Initialize Autocomplete
                if (autocompleteInputRef.current) {
                    const newAutocomplete = new google.maps.places.Autocomplete(autocompleteInputRef.current, {
                        fields: ['formatted_address', 'geometry', 'address_components'],
                        // types: ['address'], // Removed to allow searching buildings/landmarks
                    });

                    newAutocomplete.addListener('place_changed', () => {
                        const place = newAutocomplete.getPlace();
                        if (place.geometry && place.geometry.location) {
                            newMap.setCenter(place.geometry.location);
                            newMap.setZoom(17);
                            newMarker.setPosition(place.geometry.location);

                            // Extract LatLng
                            const lat = place.geometry.location.lat();
                            const lng = place.geometry.location.lng();

                            // Parse components
                            let countryCode = null;
                            let postalCode = null;

                            if (place.address_components) {
                                const c = place.address_components.find(comp => comp.types.includes('country'));
                                if (c && c.short_name) countryCode = getAlpha3(c.short_name);

                                const p = place.address_components.find(comp => comp.types.includes('postal_code'));
                                if (p) postalCode = p.long_name;
                            }

                            setTempLocation({
                                address: place.formatted_address || '',
                                lat,
                                lng,
                                countryCode,
                                postalCode
                            });
                        }
                    });

                    setAutocomplete(newAutocomplete);
                }
            }
        };

        // Small timeout to ensure DOM is ready before init
        const timer = setTimeout(() => {
            initMap();
        }, 100);

        return () => clearTimeout(timer);

    }, [isModalOpen]); // Removed 'location' dependency to prevent re-init loop if location changes inside

    const updateAddressFromLatLng = (latLng: google.maps.LatLng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const res = results[0];
                const lat = latLng.lat();
                const lng = latLng.lng();

                let countryCode = null;
                let postalCode = null;

                // Extract details from Geocoding result
                if (res.address_components) {
                    const c = res.address_components.find(comp => comp.types.includes('country'));
                    if (c && c.short_name) countryCode = getAlpha3(c.short_name);

                    const p = res.address_components.find(comp => comp.types.includes('postal_code'));
                    if (p) postalCode = p.long_name;
                }

                setTempLocation({
                    address: res.formatted_address,
                    lat,
                    lng,
                    countryCode,
                    postalCode
                });
            }
        });
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const latLng = new google.maps.LatLng(latitude, longitude);

                if (map) {
                    map.setCenter(latLng);
                    map.setZoom(17);
                    if (marker) {
                        marker.setPosition(latLng);
                    }
                    updateAddressFromLatLng(latLng);
                }
                setIsLocating(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please check your permissions.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const handleConfirm = () => {
        if (tempLocation.address) {
            setAddress(tempLocation as LocationState);
            closeModal();
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Set Delivery Location</h2>
                        <p className="text-sm text-gray-500 font-medium">Find your address for faster delivery</p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 duration-300"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-8">
                    <div className="relative mb-8">
                        <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">
                            Your Delivery Address
                        </label>
                        <div className="relative group flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    ref={autocompleteInputRef}
                                    type="text"
                                    value={tempLocation.address || ''}
                                    onChange={(e) => setTempLocation({ ...tempLocation, address: e.target.value })}
                                    placeholder="Search for your street, building or area"
                                    className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-100 focus:border-red-500 focus:outline-none transition-all text-gray-900 shadow-sm group-hover:border-gray-200"
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500">
                                    <svg className="w-6 h-6 animate-bounce-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                            <button
                                onClick={handleUseCurrentLocation}
                                disabled={isLocating}
                                className="px-4 rounded-2xl border-2 border-gray-100 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center text-gray-400"
                                title="Use my current location"
                            >
                                {isLocating ? (
                                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18l.01-6m0 0a2 2 0 10-.01 6m0-6V6m0 12v2m0-2h6m-6 0H6" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* map container */}
                    <div className="relative">
                        <div
                            ref={mapRef}
                            className="w-full h-[450px] rounded-2xl border-4 border-gray-50 overflow-hidden mb-8 shadow-inner"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold text-gray-500 shadow-sm pointer-events-none">
                            DRAG PIN TO ADJUST
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={closeModal}
                            className="px-8 py-4 rounded-2xl font-bold border-2 border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!tempLocation.address}
                            className={`flex-1 px-8 py-4 rounded-2xl font-black text-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                                ${tempLocation.address ? 'bg-gray-900 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0' : 'bg-gray-200 cursor-not-allowed text-gray-400'}`}
                        >
                            CONFIRM DELIVERY LOCATION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
