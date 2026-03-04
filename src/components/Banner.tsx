import Image from 'next/image';
import siteContent from '@/site-content.json';

export default function Banner() {
    const { banner } = siteContent;

    return (
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        {banner.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 drop-shadow-md">
                        {banner.subtitle}
                    </p>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                        {banner.ctaText}
                    </button>
                </div>
            </div>
        </section>
    );
}
