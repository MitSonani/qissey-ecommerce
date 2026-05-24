import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, Instagram, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../features/auth';
import { submitContactMessage } from '../services/contactService';
import SEO from '../components/ui/SEO';

export default function Contact() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await submitContactMessage({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                user_id: user?.id || null
            });
            toast.success('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const contactBreadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Contact Us', path: '/contact' }
    ];

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <SEO 
                title="Contact Us | Premium Customer Support"
                description="Get in touch with QISSEY. We are here to help you with questions about collections, custom order sizing, measurements, shipping, returns, and support."
                breadcrumbs={contactBreadcrumbs}
            />
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Get in Touch</p>
                    <p className="text-[11px] md:text-[12px] uppercase tracking-widest opacity-60">
                        Have a question or feedback? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                    {/* Contact Information */}
                    <div>
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-8">Contact Information</p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-[#F5F5F5] flex-shrink-0 rounded-sm">
                                    <Mail size={18} className="opacity-60" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Email</p>
                                    <a href="mailto:support@qissey.com" className="text-[12px] opacity-60 font-medium hover:opacity-100 transition-opacity">support@qissey.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-[#F5F5F5] flex-shrink-0 rounded-sm">
                                    <Phone size={18} className="opacity-60" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Phone</p>
                                    <a href="tel:+917862930732" className="text-[12px] opacity-60 font-medium hover:opacity-100 transition-opacity">+91 78629 30732</a>
                                </div>
                            </div>



                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-[#F5F5F5] flex-shrink-0 rounded-sm">
                                    <Instagram size={18} className="opacity-60" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Follow Us</p>
                                    <a href="https://www.instagram.com/qissey._/" target="_blank" className="text-[12px] opacity-60 font-medium">@qissey.shop</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[#F9F9F9] p-8 md:p-10 border border-[#1A1A1A]/5 rounded-sm">
                        <p className="text-[16px] uppercase font-bold tracking-[0.1em] mb-8">Send us a Message</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="contact-name" className="text-[10px] uppercase font-bold tracking-widest mb-2 block cursor-pointer">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    required
                                    aria-required="true"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your name"
                                    className="w-full border border-[#1A1A1A]/20 bg-white py-3 px-4 text-[12px] font-medium tracking-wide outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#1A1A1A]/30 rounded-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact-email" className="text-[10px] uppercase font-bold tracking-widest mb-2 block cursor-pointer">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    required
                                    aria-required="true"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    className="w-full border border-[#1A1A1A]/20 bg-white py-3 px-4 text-[12px] font-medium tracking-wide outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#1A1A1A]/30 rounded-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact-subject" className="text-[10px] uppercase font-bold tracking-widest mb-2 block cursor-pointer">
                                    Subject
                                </label>
                                <input
                                    id="contact-subject"
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="How can we help?"
                                    className="w-full border border-[#1A1A1A]/20 bg-white py-3 px-4 text-[12px] font-medium tracking-wide outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#1A1A1A]/30 rounded-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact-message" className="text-[10px] uppercase font-bold tracking-widest mb-2 block cursor-pointer">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    required
                                    aria-required="true"
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tell us more about your inquiry..."
                                    className="w-full border border-[#1A1A1A]/20 bg-white py-3 px-4 text-[12px] font-medium tracking-wide outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#1A1A1A]/30 resize-none rounded-sm"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-white py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 flex justify-center items-center gap-3 rounded-sm"
                                >
                                    <Send size={14} />
                                    {isLoading ? 'Sending...' : 'Send Message'}
                                </button>
                                <p className="text-[9px] text-center uppercase font-medium tracking-widest text-[#1A1A1A]/50 mt-4">
                                    We typically respond within 24-48 hours during business days.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
