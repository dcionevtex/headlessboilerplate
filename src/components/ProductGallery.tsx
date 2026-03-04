'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImage {
    imageId: string;
    imageUrl: string;
    imageText: string;
}

interface ProductGalleryProps {
    images: ProductImage[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={images[selectedImage].imageUrl}
                    alt={images[selectedImage].imageText || productName}
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={image.imageId}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                    ? 'border-red-500 ring-2 ring-red-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={image.imageUrl}
                                alt={image.imageText || `${productName} - Image ${index + 1}`}
                                fill
                                className="object-contain"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
