import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import storeContent from '@/storelocator-content.json';

export const metadata = {
    title: 'Store Locator | DIY Tools Co.',
    description: 'Find a DIY Tools Co. location near you.',
};

export default function StoreLocatorPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{storeContent.title}</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">{storeContent.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {storeContent.stores.map((store) => (
                        <div key={store.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            {/* Store Image */}
                            <div className="relative h-64 w-full">
                                <Image
                                    src={store.image}
                                    alt={store.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold text-shadow">{store.name}</h3>
                                </div>
                            </div>

                            {/* Store Details */}
                            <div className="p-6 flex-grow flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-500 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-gray-600 text-sm leading-relaxed">{store.address}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-gray-600 text-sm hover:text-red-600 transition-colors">
                                        {store.phone}
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href={`mailto:${store.email}`} className="text-gray-600 text-sm hover:text-red-600 transition-colors">
                                        {store.email}
                                    </a>
                                </div>

                                <div className="flex items-start gap-3 mt-2 pt-4 border-t border-gray-100">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Opening Hours</p>
                                        <p className="text-gray-700 text-sm">{store.hours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
