import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ShippingPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Shipping Policy</p>
                    <p className="text-[11px] md:text-[12px] uppercase tracking-widest opacity-60">
                        Everything you need to know about our delivery process.
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Delivery Overview</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                At Qissey, we are committed to delivering your order quickly, safely, and efficiently.
                            </p>
                            <p>
                                We offer free delivery across all locations in India, ensuring a seamless shopping experience for our customers.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Processing & Delivery Times</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                All orders are processed within 24–48 hours (excluding Sundays and public holidays). Once dispatched, your order will be shipped through our trusted courier partners and is expected to be delivered within 4 to 7 business days, depending on your location.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Order Tracking</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                As soon as your order is shipped, you will receive a tracking link via SMS/email, allowing you to monitor your shipment in real time.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Cash on Delivery (COD)</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                We provide Cash on Delivery (COD) for your convenience. Please ensure someone is available to receive the order at the provided address.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Delivery Delays</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>While we strive to deliver within the estimated timeframe, delays may occur due to:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Remote locations</li>
                                <li>Unexpected weather conditions</li>
                                <li>High order volumes during sales or festive seasons</li>
                            </ul>
                            <p className="mt-4">We appreciate your patience in such cases.</p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Incorrect Address or Failed Delivery</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>Please ensure that your shipping details are accurate. In case of:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Incorrect/incomplete address</li>
                                <li>Recipient unavailable</li>
                            </ul>
                            <p className="mt-4">The order may be delayed or returned to us. Re-shipping charges may apply.</p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Need Help?</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>For any queries regarding shipping, tracking, or delivery:</p>
                            <ul className="space-y-2 mt-2">
                                <li>📧 Email: <a href="mailto:support@qissey.com" className="hover:text-black hover:underline transition-all">support@qissey.com</a></li>
                                <li>📞 Phone: <a href="tel:+917862930732" className="hover:text-black hover:underline transition-all">+91 78629 30732</a></li>
                            </ul>
                            <p className="mt-4">Our support team will be happy to assist you.</p>

                        </div>
                    </section>

                    <div className='mt-8'>
                        <Link
                            to="/contact"
                            className="inline-block px-8 bg-black text-white py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 flex justify-center items-center gap-3 rounded-sm"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
