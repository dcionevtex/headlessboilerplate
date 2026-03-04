'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { simulateShipping } from '@/lib/simulation';
import config from '@/config.json';

interface ShippingSimulationProps {
    skuId: string;
    sellerId: string;
    quantity: number;
}

export default function ShippingSimulation({ skuId, sellerId, quantity }: ShippingSimulationProps) {
    const { location, openModal } = useLocation();
    const [loading, setLoading] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    const hasLocation = !!location.address && !!location.countryCode;

    useEffect(() => {
        if (hasLocation && skuId && sellerId) {
            handleSimulation();
        }
    }, [location, skuId, quantity, sellerId]);

    const handleSimulation = async () => {
        // If we don't have a valid ISO country code, prompt user or default
        // For now, if missing countryCode but has address, we might try a default 'ARE' or skip
        const countryCode = location.countryCode || 'ARE'; // Fallback to ARE for demo if missing

        setLoading(true);
        try {
            const result = await simulateShipping(
                [{ id: skuId, quantity, seller: sellerId }],
                {
                    countryCode,
                    postalCode: location.postalCode,
                    lat: location.lat,
                    lng: location.lng
                }
            );
            setSimulationResult(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!hasLocation) {
        return (
            <div className="py-4 border-t border-b border-gray-100 my-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">Delivery Location</span>
                    </div>
                    <button
                        onClick={openModal}
                        className="text-red-600 font-bold text-sm hover:underline"
                    >
                        Select Location
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 border-t border-b border-gray-100 my-4 bg-gray-50/50 rounded-lg px-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Deliver to: <span className="font-bold text-gray-900">{location.address}</span></span>
                </div>
                <button
                    onClick={openModal}
                    className="text-gray-400 hover:text-red-500 text-xs"
                >
                    Change
                </button>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-red-500 animate-spin"></div>
                    Calculating shipping...
                </div>
            ) : simulationResult ? (
                <div className="space-y-2">
                    {/*
                         Note: Real VTEX simulation result parsing is complex (slas, logisticsInfo).
                         This is a simplified mock View based on typical simulation structure.
                         We check logisticsInfo[0].slas
                     */}
                    {simulationResult.logisticsInfo && simulationResult.logisticsInfo[0]?.slas?.length > 0 ? (
                        <div className="space-y-4 mt-3">
                            {(() => {
                                const slas = simulationResult.logisticsInfo[0].slas;
                                // Group by delivery channel
                                const deliveryOptions = slas.filter((sla: any) => sla.deliveryChannel === 'delivery');
                                const pickupOptions = slas.filter((sla: any) => sla.deliveryChannel === 'pickup-in-point');

                                const renderSlaItem = (sla: any) => {
                                    // Parse estimate (e.g. "3bd" -> "3 Business Days", "2d" -> "2 Days")
                                    const estimateRaw = sla.shippingEstimate || '';
                                    let estimateText = '';
                                    if (estimateRaw.includes('bd')) {
                                        estimateText = `${estimateRaw.replace('bd', '')} Business Days`;
                                    } else if (estimateRaw.includes('d')) {
                                        estimateText = `${estimateRaw.replace('d', '')} Days`;
                                    } else if (estimateRaw.includes('h')) {
                                        estimateText = `${estimateRaw.replace('h', '')} Hours`;
                                    } else if (estimateRaw.includes('m')) {
                                        estimateText = `${estimateRaw.replace('m', '')} Minutes`;
                                    }

                                    return (
                                        <div key={sla.id} className="flex justify-between items-start text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-semibold flex items-center gap-2">
                                                    {sla.deliveryChannel === 'pickup-in-point' ? (
                                                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                                    )}
                                                    {sla.name}
                                                </span>
                                                {estimateText && (
                                                    <span className="text-xs text-gray-500 ml-6">
                                                        {sla.deliveryChannel === 'pickup-in-point' ? 'Ready in ' : 'Arrives in '}
                                                        <span className="font-medium text-gray-700">{estimateText}</span>
                                                    </span>
                                                )}
                                                {/* Show pickup distance/address if available in future (requires more parsing) */}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-gray-900">
                                                    {sla.price === 0 ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency: config.globalSettings.currency }).format(sla.price / 100)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        {/* Delivery Options */}
                                        {deliveryOptions.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Options</h4>
                                                <div className="bg-white rounded-md border border-gray-100 p-2 space-y-2">
                                                    {deliveryOptions.map(renderSlaItem)}
                                                </div>
                                            </div>
                                        )}

                                        {/* Pickup Options (Only show if available) */}
                                        {pickupOptions.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                                    Pickup Options
                                                </h4>
                                                <div className="bg-white rounded-md border border-orange-100 p-2 space-y-2">
                                                    {pickupOptions.map(renderSlaItem)}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">No delivery options available for this location.</p>
                    )}
                </div>
            ) : null}
        </div>
    );
}
