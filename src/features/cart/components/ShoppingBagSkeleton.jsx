const ShoppingBagSkeleton = () => {
    return (
        <div className="min-h-screen pt-24 md:pt-48 pb-24 px-6 md:px-12 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    {/* Left Column: Items */}
                    <div className="w-full md:w-3/5">
                        {/* Title */}
                        <div className="flex items-end gap-3 mb-12">
                            <div className="h-8 md:h-10 bg-neutral-200 rounded w-64"></div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-12">
                            {[1, 2].map((idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-black/5">
                                    {/* Image Placeholder */}
                                    <div className="w-full sm:w-48 aspect-[3/4] bg-neutral-200 rounded"></div>

                                    {/* Details Placeholder */}
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="h-6 bg-neutral-200 rounded w-48"></div>
                                                <div className="w-5 h-5 bg-neutral-200 rounded"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-neutral-200 rounded w-24"></div>
                                                <div className="h-3 bg-neutral-200 rounded w-28"></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-8 sm:mt-0 pt-8 sm:pt-0">
                                            <div className="h-10 bg-neutral-200 rounded w-32"></div>
                                            <div className="h-6 bg-neutral-200 rounded w-24"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-neutral-100 p-8 md:p-12 space-y-8">
                            <div className="h-6 bg-neutral-200 rounded w-40 mb-8"></div>

                            <div className="space-y-6">
                                <div className="flex justify-between">
                                    <div className="h-3 bg-neutral-200 rounded w-16"></div>
                                    <div className="h-3 bg-neutral-200 rounded w-20"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-3 bg-neutral-200 rounded w-16"></div>
                                    <div className="h-3 bg-neutral-200 rounded w-32"></div>
                                </div>
                                <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                                    <div className="h-4 bg-neutral-200 rounded w-12"></div>
                                    <div className="h-7 bg-neutral-200 rounded w-28"></div>
                                </div>
                            </div>

                            <div className="h-14 bg-neutral-200 rounded w-full"></div>

                            <div className="mt-12 space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-5 h-5 bg-neutral-200 rounded shrink-0"></div>
                                    <div className="h-3 bg-neutral-200 rounded w-full"></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-5 h-5 bg-neutral-200 rounded shrink-0"></div>
                                    <div className="h-3 bg-neutral-200 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingBagSkeleton;
