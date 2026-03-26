import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ReturnPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Returns & Exchanges</p>

                </div>

                <div className="space-y-12">
                    <section>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                At Qissey, we strive to deliver products that you love. However, if something isn't right, we're here to help.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Order Cancellation</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Orders can be cancelled within 1 hours of placing the order.</li>
                                <li>Once the order has been processed or shipped, cancellation requests will not be accepted.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Returns & Exchanges</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>We offer exchange / return under limited conditions:</p>
                            <p>You can request a return or exchange within 7 days of delivery if:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>You received a damaged or defective product</li>
                                <li>You received the wrong item</li>
                                <li>The product is significantly different from what was shown</li>
                            </ul>
                            <p className="mt-4"> To initiate a request, contact us within 7 days with:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Order ID</li>
                                <li>Clear photos/videos of the issue</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Conditions for Return & Exchange</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>To be eligible:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Item must be unused, unwashed, and in original condition</li>
                                <li>All tags and packaging must be intact</li>
                                <li>Request must be raised within the given timeframe</li>
                            </ul>
                            <p className="mt-4">We reserve the right to decline requests that do not meet these conditions.</p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Non-Returnable Items</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Items purchased on sale or discount (unless defective)</li>
                                <li>Custom-made or personalized products</li>
                                <li>Products damaged due to misuse or improper handling</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Custom Orders Policy</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>All custom-made products are created specifically for you. Therefore:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>No return, exchange, or cancellation is allowed</li>
                                <li>Customers must ensure accurate measurements and details</li>
                                <li>Slight variations in color, texture, or finish may occur</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Refund Policy</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Once your return is approved and inspected, refunds will be processed within 3–5 business days</li>
                                <li>Refunds will be credited to your original payment method</li>
                                <li>For COD orders, refund will be issued via bank transfer or UPI</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Failed Deliveries</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>If delivery fails due to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Incorrect address</li>
                                <li>Customer unavailable</li>
                            </ul>
                            <p className="mt-4">Re-shipping charges may apply.</p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Important Notes</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>We are not responsible for delays caused by courier partners or unforeseen circumstances</li>
                                <li>By placing an order, you agree to our policies and terms governed under Indian laws</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Need Help?</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <ul className="space-y-2 mt-2">
                                <li>📧 Email: <a href="mailto:support@qissey.com" className="hover:text-black hover:underline transition-all">support@qissey.com</a></li>
                                <li>📞 Phone: <a href="tel:+917862930732" className="hover:text-black hover:underline transition-all">+91 78629 30732</a></li>
                            </ul>
                        </div>
                    </section>
                </div>

                <div className='mt-16'>
                    <Link
                        to="/contact"
                        className="inline-block px-8 bg-black text-white py-4 text-[12px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] transition-colors flex justify-center items-center gap-3 rounded-sm"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
