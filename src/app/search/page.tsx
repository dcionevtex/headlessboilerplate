import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchPageContent from './SearchPageContent';

// Force dynamic rendering since we use search params
export const dynamic = 'force-dynamic';

function SearchFallback() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading...</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchFallback />}>
            <SearchPageContent />
        </Suspense>
    );
}
