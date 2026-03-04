'use client';

interface SortDropdownProps {
    currentSort: string;
    onSortChange: (sort: string) => void;
}

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
    return (
        <div className="flex items-center gap-2 mb-6">
            <span className="text-gray-600 text-sm font-medium">Sort by:</span>
            <div className="relative">
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
                >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A-Z</option>
                    <option value="name_desc">Name: Z-A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
