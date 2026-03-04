'use client';

import { VTEXItem } from '@/types/vtex';

interface SKUSelectorProps {
    items: VTEXItem[];
    selectedSKU: string;
    onSelectSKU: (itemId: string) => void;
}

export default function SKUSelector({ items, selectedSKU, onSelectSKU }: SKUSelectorProps) {
    if (!items || items.length <= 1) {
        return null;
    }

    // Try to find explicit variation metadata
    const firstItem = items[0];
    const variationName = firstItem.variations?.[0]; // e.g. "Color" or "Size"

    // Determine Label
    let label = 'Select Option';

    // Helper to get display name for an item
    const getDisplayName = (item: VTEXItem): string => {
        // Strategy 1: Explicit Variation Value
        if (variationName && item.variationValues?.[variationName]?.[0]) {
            return item.variationValues[variationName][0];
        }

        // Strategy 2: Common Prefix Removal (Fallback)
        return item.complementName || item.name;
    };

    // Calculate Prefix for Fallback Strategy only if no explicit variation
    let prefix = '';
    if (!variationName) {
        const names = items.map(i => i.complementName || i.name);
        if (names.length > 0) {
            prefix = names[0];
            for (let i = 1; i < names.length; i++) {
                while (names[i].indexOf(prefix) !== 0) {
                    prefix = prefix.substring(0, prefix.length - 1);
                    if (prefix === '') break;
                }
            }
        }

        const hasMeaningfulPrefix = prefix.length > 2 && prefix.trim().length > 0;
        if (hasMeaningfulPrefix) {
            label = prefix.trim().replace(/:$/, '');
        }
    } else {
        label = variationName;
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 capitalize">
                    {label}:
                </label>
                <div className="flex flex-wrap gap-2">
                    {items.map((item) => {
                        let displayName = getDisplayName(item);

                        // Strategy 3: Dynamic Stripping
                        // If the display name starts with the label (e.g. Label: "Size", Value: "Size 40"), strip it.
                        // This handles cases where VTEX API returns the full name in the variation value or fallback.
                        if (label && label !== 'Select Option') {
                            // Escape special characters in label for regex
                            const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(`^${escapedLabel}\\s*`, 'i');
                            displayName = displayName.replace(regex, '');
                        }

                        // Apply legacy prefix stripping if fallback strategy is active and still needed
                        // (Only if Dynamic Stripping didn't already handle it effectively via label match)
                        if (!variationName && prefix && displayName.startsWith(prefix)) {
                            const hasMeaningfulPrefix = prefix.length > 2 && prefix.trim().length > 0;
                            if (hasMeaningfulPrefix) {
                                displayName = displayName.slice(prefix.length);
                            }
                        }

                        const isSelected = item.itemId === selectedSKU;
                        const isAvailable = item.sellers.length > 0 &&
                            item.sellers[0].commertialOffer.AvailableQuantity > 0;

                        return (
                            <button
                                key={item.itemId}
                                onClick={() => onSelectSKU(item.itemId)}
                                disabled={!isAvailable}
                                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${isSelected
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : isAvailable
                                        ? 'border-gray-300 hover:border-red-300 text-gray-700'
                                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {displayName}
                                {!isAvailable && (
                                    <span className="ml-2 text-xs">(Out of Stock)</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
