import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Privacy Policy</p>
                </div>

                <div className="space-y-12">
                    <section>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                At Qissey, your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or make a purchase.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Information We Collect</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>When you interact with our website, we may collect the following types of information:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing address.</li>
                                <li><strong>Payment Information:</strong> We use secure third-party payment gateways (we do not store your credit card or payment details on our servers).</li>
                                <li><strong>Device and Usage Data:</strong> IP address, browser type, device information, and browsing activity on our site.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">How We Use Your Information</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>We use the collected data for the following purposes:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To process and fulfill your orders, including sending order confirmations and shipping updates.</li>
                                <li>To provide customer support and respond to your inquiries.</li>
                                <li>To improve our website, product offerings, and user experience.</li>
                                <li>To send promotional emails (only if you have opted in). You can unsubscribe at any time.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Information Sharing</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>We do not sell or rent your personal information to third parties. However, we do share your data with trusted service providers to run our business, including:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Shipping and logistics partners to deliver your orders.</li>
                                <li>Payment processors to securely handle your transactions.</li>
                                <li>IT and analytics providers to help us optimize our website.</li>
                            </ul>
                            <p className="mt-4">We may also disclose your information if required by law or to protect our legal rights.</p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Data Security</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                We implement industry-standard security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All sensitive information (like payment details) is encrypted during transmission.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Cookies</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, though some parts of our site may not function properly without them.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Your Rights</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Access and update the personal information we hold about you.</li>
                                <li>Request deletion of your data (subject to certain legal obligations).</li>
                                <li>Opt-out of marketing communications at any time.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Changes to This Policy</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>
                                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. Any updates will be posted on this page.
                            </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-4">Contact Us</p>
                        <div className="text-[15px] opacity-80 space-y-4 leading-relaxed font-medium">
                            <p>If you have any questions or concerns about this Privacy Policy, please reach out to us:</p>
                            <ul className="space-y-2 mt-2">
                                <li>📧 Email: <a href="mailto:support@qissey.com" className="hover:text-black hover:underline transition-all">support@qissey.com</a></li>
                                <li>📞 Phone: <a href="tel:+917862930732" className="hover:text-black hover:underline transition-all">+91 78629 30732</a></li>
                            </ul>
                        </div>
                    </section>

                    <div className='mt-16'>
                        <Link
                            to="/contact"
                            className="inline-block px-8 bg-black text-white py-4 text-[12px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] transition-colors flex justify-center items-center gap-3 rounded-sm w-fit"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
