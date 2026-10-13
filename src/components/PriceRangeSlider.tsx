'use client';

interface PriceRangeSliderProps {
    bounds: { min: number; max: number };
    /** Current [from, to]; [0, 0] is the shared "no price filter" sentinel (see FilterState) */
    value: [number, number];
    onChange: (range: [number, number]) => void;
    formatPrice: (value: number) => string;
    labels: { min: string; max: string };
}

// Two native range inputs stacked on one track: keeps keyboard, touch and RTL support for free.
// The inputs ignore pointer events except on their thumbs, so each handle stays grabbable.
const THUMB = '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-grab '
    + '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900 [&::-moz-range-thumb]:cursor-grab';
const INPUT = `absolute inset-0 w-full h-5 appearance-none bg-transparent pointer-events-none focus:outline-none ${THUMB}`;

export default function PriceRangeSlider({ bounds, value, onChange, formatPrice, labels }: PriceRangeSliderProps) {
    const { min } = bounds;
    const step = Math.max(1, Math.round((bounds.max - min) / 100));
    // Round the top up to a whole step so the browser's step snapping can always reach it
    const max = min + Math.ceil((bounds.max - min) / step) * step;
    const isUnset = value[0] === 0 && value[1] === 0;
    const from = isUnset ? min : Math.max(min, value[0]);
    const to = isUnset ? max : Math.min(max, value[1]);
    const percent = (n: number) => ((n - min) / (max - min)) * 100;

    // Back at the full span means "no filter", so clear instead of storing [min, max]
    const commit = (nextFrom: number, nextTo: number) =>
        onChange(nextFrom <= min && nextTo >= max ? [0, 0] : [nextFrom, nextTo]);

    return (
        <div>
            <div className="relative h-5">
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
                <div
                    className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-red-500"
                    style={{ insetInlineStart: `${percent(from)}%`, width: `${percent(to) - percent(from)}%` }}
                />
                <input
                    type="range" min={min} max={max} step={step} value={from}
                    aria-label={labels.min}
                    // Overlapping handles: whichever can still move away must be on top (lower near the max)
                    style={{ zIndex: from > (min + max) / 2 ? 3 : 1 }}
                    onChange={e => commit(Math.min(Number(e.target.value), to), to)}
                    className={INPUT}
                />
                <input
                    type="range" min={min} max={max} step={step} value={to}
                    aria-label={labels.max}
                    style={{ zIndex: 2 }}
                    onChange={e => commit(from, Math.max(Number(e.target.value), from))}
                    className={INPUT}
                />
            </div>
            <div className="mt-3 flex justify-between text-sm font-medium text-gray-700">
                <span>{formatPrice(from)}</span>
                <span>{formatPrice(to)}</span>
            </div>
        </div>
    );
}
