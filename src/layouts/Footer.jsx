import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Primitives';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-charcoal text-white pt-32 pb-12 px-6 md:px-12">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    <div className="lg:col-span-5">
                        <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-8 italic">
                            QISSEY
                        </h2>
                        <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-12">
                            WE ARE A CREATIVE STUDIO FOCUSING ON THE INTERSECTION OF DESIGN, CULTURE, AND SUSTAINABLE MATERIALITY.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white/60 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white/60 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white/60 transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Connect</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            <li><Link to="/shop" className="hover:opacity-50 transition-opacity">Archive</Link></li>
                            <li><a href="#" className="hover:opacity-50 transition-opacity">Journal</a></li>
                            <li><a href="#" className="hover:opacity-50 transition-opacity">Sustainability</a></li>
                            <li><a href="#" className="hover:opacity-50 transition-opacity">About</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Service</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            <li><a href="#" className="hover:opacity-50 transition-opacity">Shipping</a></li>
                            <li><a href="#" className="hover:opacity-50 transition-opacity">Returns</a></li>
                            <li><a href="#" className="hover:opacity-50 transition-opacity">Size Guide</a></li>
                            <li><a href="#" className="hover:opacity-50 transition-opacity">Contact</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3 space-y-8">
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/30">Bulletin</h3>
                        <div className="relative border-b border-white/10 pb-4 group">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="bg-transparent w-full outline-none text-[10px] font-bold tracking-widest placeholder:text-white/20"
                            />
                            <button className="absolute right-0 top-0 hover:translate-x-1 transition-transform">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest leading-loose">
                            By subscribing, you agree to our Privacy Policy and consent to receive updates.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
                    <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-white/20">
                        © {currentYear} QISSEY STUDIO. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8 text-[9px] uppercase font-bold tracking-[0.3em] text-white/20">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
