'use client';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    maxQuantity?: number;
    minQuantity?: number;
}

export default function QuantitySelector({
    quantity,
    onQuantityChange,
    maxQuantity = 99,
    minQuantity = 1,
}: QuantitySelectorProps) {
    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > minQuantity) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || minQuantity;
        const clampedValue = Math.max(minQuantity, Math.min(maxQuantity, value));
        onQuantityChange(clampedValue);
    };

    return (
        <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold text-gray-900">Quantity:</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                    onClick={handleDecrement}
                    disabled={quantity <= minQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <input
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    min={minQuantity}
                    max={maxQuantity}
                    className="w-16 text-center border-x-2 border-gray-300 py-2 focus:outline-none font-medium"
                />
                <button
                    onClick={handleIncrement}
                    disabled={quantity >= maxQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
