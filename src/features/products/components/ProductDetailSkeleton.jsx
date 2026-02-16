import React from 'react';

const ProductDetailSkeleton = () => {
    return (
        <div className="pt-30 bg-white animate-pulse">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left side - Images skeleton */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        {[1, 2, 3].map((idx) => (
                            <div
                                key={idx}
                                className="bg-neutral-200 aspect-[3/4] w-full rounded"
                            ></div>
                        ))}
                    </div>

                    {/* Right side - Product info skeleton */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="sticky top-24 space-y-8">

                            {/* Title and price skeleton */}
                            <div>
                                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                                <div className="h-5 bg-neutral-200 rounded w-1/4 mb-1"></div>
                                <div className="h-3 bg-neutral-200 rounded w-1/3 mt-1"></div>
                            </div>

                            {/* Colors and Add button skeleton */}
                            <div className="border-t border-neutral-200 pt-6">
                                <div className="flex gap-2 mb-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 bg-neutral-200 rounded"></div>
                                    ))}
                                </div>
                                <div className="h-14 bg-neutral-200 rounded w-full"></div>
                            </div>

                            {/* Description skeleton */}
                            <div className="space-y-3">
                                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                                <div className="h-3 bg-neutral-200 rounded w-full"></div>
                                <div className="h-3 bg-neutral-200 rounded w-full"></div>
                                <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                            </div>

                            {/* Drawer buttons skeleton */}
                            <div className="border-t border-neutral-100 pt-6 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 bg-neutral-200 rounded w-full"></div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;
