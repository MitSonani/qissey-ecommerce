import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PurchaseConditions() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Purchase Conditions</p>
                    <p className="text-[11px] md:text-[12px] uppercase tracking-widest opacity-60">
                        Terms of Sale & General Conditions
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Acceptance of Terms</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                By placing an order on Qissey, you accept and agree to be bound by these Purchase Conditions. Please read them carefully before completing your purchase. These terms outline your rights and responsibilities as a customer.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Product Information & Pricing</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>We strive to accurately display the colors, features, specifications, and details of our products. However:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>We do not guarantee that your device's display of colors will be entirely accurate.</li>
                                <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
                                <li>Prices and availability are subject to change without notice.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Orders & Acceptance</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>An order is considered accepted only when we dispatch the product and send an order confirmation.</li>
                                <li>We reserve the right to cancel or refuse any order at our sole discretion. This may happen due to limited inventory, pricing errors, or issues identified by our fraud prevention team.</li>
                                <li>In the event of cancellation after payment, a full refund will be processed to the original payment method.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Payments</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                We offer various secure payment methods, including credit/debit cards, UPI, net banking, and Cash on Delivery (COD). By submitting payment information, you represent that you have the legal right to use the chosen payment method.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Shipping & Delivery</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                We aim to deliver orders within the estimated timeframes provided at checkout. However, delivery timelines are estimates and not guarantees. We are not liable for delays caused by external factors such as courier issues or unforeseen circumstances.
                            </p>
                            <p>
                                For detailed information, please review our <Link to="/shipping-policy" className="underline hover:text-black transition-colors">Shipping Policy</Link>.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Returns & Exchanges</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                Certain items may be eligible for returns or exchanges within a specified period. Custom-made products and discounted items are generally final sale.
                            </p>
                            <p>
                                Please refer to our <Link to="/return-policy" className="underline hover:text-black transition-colors">Return Policy</Link> for full details and eligibility criteria.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Limitation of Liability</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                Qissey shall not be held liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services, even if informed of the possibility of such damages.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Governing Law</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                These Purchase Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of your purchase shall be subject to the exclusive jurisdiction of the courts in India.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[14px] uppercase font-bold tracking-[0.1em] mb-4">Contact Us</p>
                        <div className="text-[13px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>For any questions regarding your purchase or these conditions, please reach out:</p>
                            <ul className="space-y-2 mt-2">
                                <li>📧 Email: <a href="mailto:support@qissey.com" className="hover:text-black hover:underline transition-all">support@qissey.com</a></li>
                                <li>📞 Phone: <a href="tel:+917862930732" className="hover:text-black hover:underline transition-all">+91 78629 30732</a></li>
                            </ul>
                        </div>
                    </section>

                    <div className='mt-16'>
                        <Link
                            to="/contact"
                            className="inline-block px-8 bg-black text-white py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] transition-colors flex justify-center items-center gap-3 rounded-sm w-fit"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
