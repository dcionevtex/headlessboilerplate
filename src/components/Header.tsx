'use client';

// ... imports
import Image from 'next/image';
import headerContent from '@/header-content.json';
import { useCart } from '@/context/CartContext';
import MiniCart from '@/components/MiniCart';
import Navigation from '@/components/Navigation';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { useLocation } from '@/context/LocationContext';
import AddressSelectorModal from '@/components/AddressSelectorModal';

export default function Header() {
    const { itemCount, openCart } = useCart();
    const { addressString, openModal } = useLocation();

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                {/* Desktop: Row 1 (Logo - Search - Cart) */}
                <div className="hidden lg:flex items-center justify-between gap-6 mb-3">
                    {/* Logo */}
                    <a href="/" className="flex-shrink-0">
                        <Image
                            src={headerContent.logo.src}
                            alt={headerContent.logo.alt}
                            width={200}
                            height={80}
                            className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                            priority
                        />
                    </a>

                    {/* Search Bar - Full Width */}
                    <div className="flex-1 max-w-3xl">
                        <SearchAutocomplete placeholder={headerContent.searchPlaceholder} size="md" />
                    </div>

                    {/* Store Locator Icon */}
                    <a
                        href="/store-locator"
                        className="flex-shrink-0 flex items-center gap-2 p-2 text-gray-700 hover:text-red-500 transition-colors font-medium"
                        aria-label="Store Locator"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Store Locator</span>
                    </a>

                    {/* Deliver to Icon */}
                    <button
                        onClick={openModal}
                        className="flex-shrink-0 flex flex-col items-start px-3 py-1 bg-gray-50 hover:bg-red-50 rounded-lg border border-gray-100 hover:border-red-200 transition-all group"
                        aria-label="Deliver to"
                    >
                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-gray-400 group-hover:text-red-400 transition-colors">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Deliver to</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[150px]">
                            {addressString}
                        </span>
                    </button>

                    {/* Cart Icon */}
                    <button
                        onClick={openCart}
                        className="flex-shrink-0 p-2 text-gray-700 hover:text-red-500 transition-colors relative"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {itemCount}
                        </span>
                    </button>

                    <MiniCart />
                </div>

                {/* Desktop: Row 2 (Navigation Menu) */}
                <div className="hidden lg:block border-t pt-3">
                    <div className="flex justify-center">
                        <Navigation />
                    </div>
                </div>

                {/* Mobile/Tablet: Single Row Layout */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        {/* Mobile Menu Button + Logo */}
                        <div className="flex items-center gap-3">
                            <Navigation />
                            <a href="/" className="flex-shrink-0">
                                <Image
                                    src={headerContent.logo.src}
                                    alt={headerContent.logo.alt}
                                    width={200}
                                    height={80}
                                    className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                                    priority
                                />
                            </a>
                        </div>

                        {/* Mobile Right Side: Location + Cart */}
                        <div className="flex items-center gap-1">
                            {/* Deliver to Icon (Mobile) */}
                            <button
                                onClick={openModal}
                                className="p-2 text-gray-700 hover:text-red-500 transition-colors relative"
                                aria-label="Deliver to"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>

                            <button
                                onClick={openCart}
                                className="flex-shrink-0 p-2 text-gray-700 hover:text-red-500 transition-colors relative"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            </button>
                        </div>

                        <MiniCart />
                    </div>

                    {/* Mobile Search Bar */}
                    <SearchAutocomplete placeholder={headerContent.searchPlaceholder} size="sm" />
                </div>
            </div>
            <AddressSelectorModal />
        </header>
    );
}
