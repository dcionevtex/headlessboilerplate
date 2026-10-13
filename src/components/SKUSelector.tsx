'use client';

import { VTEXItem } from '@/types/vtex';

interface SKUSelectorProps {
    items: VTEXItem[];
    selectedSKU: string;
    onSelectSKU: (itemId: string) => void;
}

const isItemAvailable = (item: VTEXItem) =>
    item.sellers.length > 0 && item.sellers[0].commertialOffer.AvailableQuantity > 0;

const variantValue = (item: VTEXItem, dimension: string) => item.variationValues?.[dimension]?.[0];

export default function SKUSelector(props: SKUSelectorProps) {
    if (!props.items || props.items.length <= 1) {
        return null;
    }

    // Dimensions (e.g. "Colour", "Memory Size") that actually carry values on the SKUs
    const dimensions = (props.items[0].variations || [])
        .filter(dimension => props.items.some(item => variantValue(item, dimension)));

    return dimensions.length > 0
        ? <VariantMatrixSelector {...props} dimensions={dimensions} />
        : <FallbackSelector {...props} />;
}

// One row of options per dimension; picking a value keeps the other dimensions' current
// values when that combination exists, otherwise jumps to any SKU carrying the value.
function VariantMatrixSelector({ items, selectedSKU, onSelectSKU, dimensions }: SKUSelectorProps & { dimensions: string[] }) {
    const selectedItem = items.find(item => item.itemId === selectedSKU) || items[0];

    const resolveSKU = (dimension: string, value: string) => {
        const withValue = items.filter(item => variantValue(item, dimension) === value);
        const sameOthers = withValue.find(item => dimensions.every(d =>
            d === dimension || variantValue(item, d) === variantValue(selectedItem, d)));
        return sameOthers || withValue.find(isItemAvailable) || withValue[0];
    };

    return (
        <div className="space-y-4">
            {dimensions.map(dimension => {
                const values = [...new Set(items.map(item => variantValue(item, dimension)).filter(Boolean))] as string[];
                return (
                    <div key={dimension}>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            {dimension}: <span className="font-normal text-gray-600">{variantValue(selectedItem, dimension)}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {values.map(value => {
                                const target = resolveSKU(dimension, value);
                                const isSelected = variantValue(selectedItem, dimension) === value;
                                const isAvailable = isItemAvailable(target);
                                return (
                                    <button
                                        key={value}
                                        onClick={() => onSelectSKU(target.itemId)}
                                        disabled={!isAvailable}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${isSelected
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : isAvailable
                                                ? 'border-gray-300 hover:border-red-300 text-gray-700'
                                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {value}
                                        {!isAvailable && (
                                            <span className="ml-2 text-xs">(Out of Stock)</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Products without variation metadata: derive option labels from SKU names
function FallbackSelector({ items, selectedSKU, onSelectSKU }: SKUSelectorProps) {

    const selectOptionLabel = 'Select Option';
    let label = selectOptionLabel;
    const getDisplayName = (item: VTEXItem): string => item.complementName || item.name;

    // Common prefix across SKU names (e.g. "Size ") becomes the label and is stripped from options
    const names = items.map(getDisplayName);
    let prefix = names[0];
    for (let i = 1; i < names.length; i++) {
        while (names[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === '') break;
        }
    }
    const hasMeaningfulPrefix = prefix.length > 2 && prefix.trim().length > 0;
    if (hasMeaningfulPrefix) {
        label = prefix.trim().replace(/:$/, '');
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
                        if (label && label !== selectOptionLabel) {
                            // Escape special characters in label for regex
                            const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(`^${escapedLabel}\\s*`, 'i');
                            displayName = displayName.replace(regex, '');
                        }

                        // Apply legacy prefix stripping if fallback strategy is active and still needed
                        // (Only if Dynamic Stripping didn't already handle it effectively via label match)
                        if (hasMeaningfulPrefix && displayName.startsWith(prefix)) {
                            displayName = displayName.slice(prefix.length);
                        }

                        const isSelected = item.itemId === selectedSKU;
                        const isAvailable = isItemAvailable(item);

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
