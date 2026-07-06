import config from '@/config.json';

export default function TopBar() {
    const { enabled, message } = config.topBar;

    if (!enabled || !message) return null;

    return (
        <div className="bg-black text-white text-center text-xs sm:text-sm font-medium py-2 px-4">
            {message}
        </div>
    );
}
