'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}

interface CarouselBannerProps {
    slides: CarouselSlide[];
    autoPlayInterval?: number;
}

export default function CarouselBanner({
    slides,
    autoPlayInterval = 5000
}: CarouselBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlaying, slides.length, autoPlayInterval]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-900">
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                        </div>

                        {/* Content */}
                        <div className="relative container mx-auto px-4 h-full flex items-center">
                            <div className="max-w-2xl text-white">
                                <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                                    {slide.title}
                                </h2>
                                <p className="text-lg md:text-xl mb-8 drop-shadow-md animate-fade-in-delay">
                                    {slide.subtitle}
                                </p>
                                <a
                                    href={slide.ctaLink}
                                    className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg animate-fade-in-delay-2"
                                >
                                    {slide.ctaText}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10 group"
                aria-label="Previous slide"
            >
                <svg
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10 group"
                aria-label="Next slide"
            >
                <svg
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all ${index === currentSlide
                            ? 'w-12 bg-red-500'
                            : 'w-3 bg-white/50 hover:bg-white/75'
                            } h-3 rounded-full`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Auto-play indicator */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm transition-all"
                    aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                >
                    {isAutoPlaying ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>
            </div>
        </section>
    );
}
