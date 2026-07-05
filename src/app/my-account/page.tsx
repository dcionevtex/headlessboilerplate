'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { getProfile, getOrders } from '@/lib/auth';
import config from '@/config.json';

interface AccountAddress {
    addressType: string;
    receiverName: string;
    addressId: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    street: string;
    number: string;
    neighborhood: string;
    complement: string | null;
    reference: string | null;
    geoCoordinates: number[];
}

interface AccountProfileResponse {
    userProfileId: string;
    availableAddresses: AccountAddress[];
    userProfile: {
        email: string;
        firstName: string;
        lastName: string;
        document: string;
        documentType: string;
        phone: string;
        isCorporate: boolean;
    };
    isComplete: boolean;
}

interface AccountOrder {
    orderId: string;
    creationDate: string;
    totalValue: number;
    status: string;
    statusDescription: string;
    sequence: string;
    totalItems: number;
    currencyCode: string;
    paymentNames: string[];
}

interface AccountOrdersResponse {
    list: AccountOrder[];
    paging: {
        total: number;
        pages: number;
        currentPage: number;
        perPage: number;
    };
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: config.globalSettings.currency,
    }).format(value);

const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

export default function MyAccountPage() {
    const { email, sessionToken, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [profile, setProfile] = useState<AccountProfileResponse | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(false);

    const [orders, setOrders] = useState<AccountOrdersResponse | null>(null);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !email || !sessionToken) return;

        let cancelled = false;

        const fetchProfile = async () => {
            setProfileLoading(true);
            setProfileError(false);
            try {
                const data = await getProfile(sessionToken);
                if (!cancelled) setProfile(data);
            } catch (err) {
                console.error('Error loading profile:', err);
                if (!cancelled) setProfileError(true);
            } finally {
                if (!cancelled) setProfileLoading(false);
            }
        };

        const fetchOrders = async () => {
            setOrdersLoading(true);
            setOrdersError(false);
            try {
                const data = await getOrders(sessionToken);
                if (!cancelled) setOrders(data);
            } catch (err) {
                console.error('Error loading orders:', err);
                if (!cancelled) setOrdersError(true);
            } finally {
                if (!cancelled) setOrdersLoading(false);
            }
        };

        fetchProfile();
        fetchOrders();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, email, sessionToken]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />

                <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">My Account</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        Sign in to view your profile, saved addresses and order history.
                    </p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-black hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                    >
                        Sign In
                    </button>
                </main>

                <Footer />

                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">My Account</h1>
                    <button
                        onClick={logout}
                        className="text-sm font-semibold text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors"
                    >
                        Log Out
                    </button>
                </div>

                {/* Profile */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>

                    {profileLoading && (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
                        </div>
                    )}

                    {!profileLoading && profileError && (
                        <p className="text-red-600">Failed to load your profile. Please try again later.</p>
                    )}

                    {!profileLoading && !profileError && profile && (
                        <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">Name</p>
                                <p className="text-gray-900 font-medium">
                                    {profile.userProfile.firstName} {profile.userProfile.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">Email</p>
                                <p className="text-gray-900 font-medium">{profile.userProfile.email}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">Phone</p>
                                <p className="text-gray-900 font-medium">{profile.userProfile.phone}</p>
                            </div>
                            {profile.userProfile.document && (
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">Document</p>
                                    <p className="text-gray-900 font-medium">{profile.userProfile.document}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Saved Addresses */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Addresses</h2>

                    {profileLoading && (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
                        </div>
                    )}

                    {!profileLoading && profileError && (
                        <p className="text-red-600">Failed to load your saved addresses. Please try again later.</p>
                    )}

                    {!profileLoading && !profileError && profile && (
                        profile.availableAddresses.length === 0 ? (
                            <p className="text-gray-500">No saved addresses.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profile.availableAddresses.map((address) => (
                                    <div key={address.addressId} className="bg-white rounded-xl shadow-md p-6">
                                        <p className="font-semibold text-gray-900 mb-2">{address.receiverName}</p>
                                        <p className="text-gray-600 text-sm">
                                            {address.street}, {address.number}
                                        </p>
                                        <p className="text-gray-600 text-sm">{address.neighborhood}</p>
                                        <p className="text-gray-600 text-sm">
                                            {address.city} - {address.state}, {address.country}
                                        </p>
                                        <p className="text-gray-600 text-sm">{address.postalCode}</p>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </section>

                {/* Order History */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>

                    {ordersLoading && (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
                        </div>
                    )}

                    {!ordersLoading && ordersError && (
                        <p className="text-red-600">Failed to load your orders. Please try again later.</p>
                    )}

                    {!ordersLoading && !ordersError && orders && (
                        orders.list.length === 0 ? (
                            <p className="text-gray-500">No orders yet.</p>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-400 font-semibold">Order</th>
                                            <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-400 font-semibold">Date</th>
                                            <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-400 font-semibold">Status</th>
                                            <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-400 font-semibold">Items</th>
                                            <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-400 font-semibold">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.list.map((order) => (
                                            <tr key={order.orderId} className="border-b last:border-0">
                                                <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">#{order.sequence}</td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatDate(order.creationDate)}</td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{order.statusDescription}</td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{order.totalItems}</td>
                                                <td className="px-6 py-4 text-gray-900 font-semibold whitespace-nowrap">{formatCurrency(order.totalValue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
