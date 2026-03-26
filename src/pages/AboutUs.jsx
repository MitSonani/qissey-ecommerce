import React, { useEffect } from 'react';

export default function AboutUs() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">About Us</p>
                    <p className="text-[13px] md:text-[14px] uppercase tracking-widest opacity-60">
                        Discover the story behind your style
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Who We Are</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                Welcome to Qissey, a premium women's western wear brand designed for the modern woman who embraces elegance, comfort, and undeniable style. We believe that what you wear is a reflection of your unique story, and our collections are crafted to help you tell it beautifully.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Our Collection</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                At Qissey, we curate and create all types of everyday essentials and statement pieces. Our diverse range of women's western wear includes stunning silhouettes, versatile separates, and complete ensembles designed to transition seamlessly from day to night.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Custom Sizing For You</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                We know that every woman's body is beautifully unique, and standard sizing doesn't always provide the perfect fit. That's why our primary goal at Qissey is to offer custom-sized products tailored specifically to your measurements.
                            </p>
                            <p>
                                We believe fashion should fit you, not the other way around. By offering custom dimensions, we ensure that every piece you order from us flatters your body perfectly, providing exceptional comfort and confidence with every wear.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Our Promise</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                We are committed to delivering exceptional quality, flattering silhouettes, and trend-forward designs that empower you to look and feel your absolute best. Every piece in our collection is carefully selected to ensure you receive nothing but the finest in women's western fashion.
                            </p>

                        </div>
                    </section>

                    <p className="font-bold text-[18px]">
                        Thank you for choosing Qissey. We can't wait to be a part of your style journey.
                    </p>
                </div>
            </div>
        </div>
    );
}
