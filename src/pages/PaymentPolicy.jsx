import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PaymentPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Payment & Invoices</p>
                    <p className="text-[13px] md:text-[14px] uppercase tracking-widest opacity-60">
                        Secure, smooth, and hassle-free payments.
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Payment & Invoices Policy</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                At Qissey, we ensure that your payment experience is secure, smooth, and hassle-free.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Payment Options</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>We offer a variety of trusted payment methods for your convenience via RazorPay:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Debit & Credit Cards (Visa, MasterCard, RuPay, etc.)</li>
                                <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                                <li>Net Banking</li>
                                <li>Cash on Delivery (COD) – available at no additional cost</li>
                            </ul>
                            <p className="mt-4">
                                All payments are processed through secure and trusted payment gateways, ensuring complete protection of your personal and financial information.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Payment Security</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>Your security is our priority. All online transactions are:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Encrypted using industry-standard protocols</li>
                                <li>Processed through verified payment partners</li>
                                <li>Fully protected against unauthorized access</li>
                            </ul>
                            <p className="mt-4">We do not store your sensitive payment details on our servers.</p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Invoices</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                A digital invoice will be sent to your registered email address once your order is confirmed or shipped.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>The invoice will include product details, pricing, and applicable taxes (GST).</li>
                                <li>You can use this invoice for returns, exchanges, or warranty claims (if applicable).</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Failed Transactions</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>In case your payment fails but the amount is deducted:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>The amount is usually refunded automatically within 5–7 business days by your bank or payment provider.</li>
                                <li>If the issue persists, please contact us with your transaction details.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Need Assistance?</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>For any payment-related queries or invoice requests:</p>
                            <ul className="space-y-2 mt-2">
                                <li>📧 Email: <a href="mailto:support@qissey.com" className="hover:text-black hover:underline transition-all">support@qissey.com</a></li>
                                <li>📞 Phone: <a href="tel:+917862930732" className="hover:text-black hover:underline transition-all">+91 78629 30732</a></li>
                            </ul>
                            <p className="mt-4">Our team is always here to help.</p>

                        </div>
                        <div className='mt-8'>
                            <Link
                                to="/contact"
                                className="inline-block px-8 bg-black text-white py-4 text-[12px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 flex justify-center items-center gap-3 rounded-sm"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
