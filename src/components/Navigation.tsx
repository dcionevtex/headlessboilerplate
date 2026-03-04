'use client';

import { useState } from 'react';
import Link from 'next/link';
import menuContent from '@/menu-content.json';

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const { categories } = menuContent;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    const toggleCategory = (categoryId: number) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-700 hover:text-red-500 transition-colors"
                aria-label="Toggle menu"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
                {categories.map((category) => (
                    <div key={category.id} className="relative group">
                        <Link
                            href={category.href}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        >
                            {category.name}
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="absolute left-0 top-full mt-0 w-56 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-2">
                                {category.subcategories.map((subcategory) => (
                                    <Link
                                        key={subcategory.id}
                                        href={subcategory.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        {subcategory.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 z-50 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Content */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        {categories.map((category) => (
                            <div key={category.id} className="mb-2">
                                {/* Category Header */}
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={category.href}
                                        onClick={toggleMobileMenu}
                                        className="flex-1 px-4 py-3 text-sm font-semibold text-gray-900 hover:text-red-500 transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="p-3 text-gray-500 hover:text-red-500 transition-colors"
                                        aria-label={`Toggle ${category.name} submenu`}
                                    >
                                        <svg
                                            className={`w-5 h-5 transform transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Subcategories */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${expandedCategory === category.id ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="pl-4 py-2 space-y-1 bg-gray-50 rounded-lg mt-1">
                                        {category.subcategories.map((subcategory) => (
                                            <Link
                                                key={subcategory.id}
                                                href={subcategory.href}
                                                onClick={toggleMobileMenu}
                                                className="block px-4 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-white rounded transition-colors"
                                            >
                                                {subcategory.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Mobile Menu Footer */}
                    <div className="p-4 border-t bg-gray-50">
                        <Link
                            href="/store-locator"
                            onClick={toggleMobileMenu}
                            className="flex items-center gap-3 w-full p-2 text-gray-700 hover:text-red-500 transition-colors rounded-lg hover:bg-white"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Store Locator</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
