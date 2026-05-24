import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Scissors, Truck, RefreshCw, Sparkles } from 'lucide-react';
import SEO from '../components/ui/SEO';

const FAQ_SECTIONS = [
    {
        title: "Custom Sizing",
        icon: Scissors,
        questions: [
            {
                q: "How does custom sizing work at QISSEY?",
                a: "At QISSEY, we believe fashion should fit you, not the other way around. When viewing a product, you can select 'Custom Size' and provide your exact chest, waist, hip, and length measurements. Our studio tailors the garment precisely to your body, ensuring a flawless silhouette at no additional cost."
            },
            {
                q: "How do I measure myself correctly?",
                a: "To measure yourself accurately: use a flexible sewing tape measure, keep it level, and do not pull it too tight. For chest: measure around the fullest part. For waist: measure around your natural waistline (narrowest part). For hip: measure around the widest part of your hips. If in doubt, refer to our sizing guides or email our team."
            }
        ]
    },
    {
        title: "Shipping & Delivery",
        icon: Truck,
        questions: [
            {
                q: "What are your delivery charges and shipping times?",
                a: "We offer free delivery across all locations in India, ensuring a premium shopping experience. Orders are processed within 24–48 hours (excluding Sundays). Standard shipping takes between 4 to 7 business days, depending on your location. Tracking details are shared via SMS and email immediately upon dispatch."
            }
        ]
    },
    {
        title: "Returns & Exchanges",
        icon: RefreshCw,
        questions: [
            {
                q: "Can I return or exchange a custom-sized item?",
                a: "Because custom-sized garments are tailored specifically to your individual dimensions, we cannot accept returns or offer refunds on custom orders unless there is a clear manufacturing defect. However, we do offer one complimentary adjustment or sizing modification to help you achieve the perfect fit."
            },
            {
                q: "What is your standard return policy?",
                a: "For standard-sized items, we offer a hassle-free 7-day exchange or return policy from the date of delivery. The item must be unused, unwashed, with all original tags and packaging intact. To initiate a return, visit your account portal or contact us at support@qissey.com."
            }
        ]
    },
    {
        title: "Materials & Care",
        icon: Sparkles,
        questions: [
            {
                q: "What materials do you use, and how do I care for my garments?",
                a: "We prioritize premium, breathable, and sustainable materials including organic cotton, pure linen, and high-quality tencel. To keep your QISSEY garments looking their best, we recommend gentle hand washing or cold machine washing on a delicate cycle, using mild detergent, and hanging to dry in shade."
            }
        ]
    }
];

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQ_SECTIONS.flatMap(section => 
        section.questions.map(item => ({
            '@type': 'Question',
            'name': item.q,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.a
            }
        }))
    )
};

const faqBreadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' }
];

export default function FAQ() {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleQuestion = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Construct flat questions list with section indices
    let questionCounter = 0;
    const flatQuestions = FAQ_SECTIONS.flatMap((section) => 
        section.questions.map((item) => ({
            ...item,
            sectionTitle: section.title,
            SectionIcon: section.icon,
            globalIndex: questionCounter++
        }))
    );

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <SEO 
                title="FAQs | Sizing, Custom Orders, Shipping & Returns"
                description="Find answers to frequently asked questions about QISSEY. Learn about our free shipping across India, custom sizing process, returns, exchanges, and material care."
                schema={faqSchema}
                breadcrumbs={faqBreadcrumbs}
            />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">FAQ</p>
                    <p className="text-[13px] md:text-[14px] uppercase tracking-widest opacity-60">
                        Frequently Asked Questions & Studio Policies
                    </p>
                </div>

                {/* FAQ Main Layout */}
                <div className="space-y-12">
                    {FAQ_SECTIONS.map((section, secIdx) => {
                        const IconComponent = section.icon;
                        return (
                            <section key={secIdx} className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-black/5 pb-3">
                                    <IconComponent size={18} className="opacity-70 text-black" />
                                    <p className="text-[16px] uppercase font-bold tracking-[0.1em]">{section.title}</p>
                                </div>

                                <div className="space-y-3">
                                    {section.questions.map((item) => {
                                        // Find index in flat list
                                        const flatItem = flatQuestions.find(f => f.q === item.q);
                                        const isExpanded = expandedIndex === flatItem.globalIndex;

                                        return (
                                            <div 
                                                key={flatItem.globalIndex} 
                                                className={`border rounded-sm transition-all duration-300 ${
                                                    isExpanded ? 'border-black bg-[#FBFBFB]' : 'border-black/10 hover:border-black/30'
                                                }`}
                                            >
                                                <button
                                                    onClick={() => toggleQuestion(flatItem.globalIndex)}
                                                    className="w-full flex justify-between items-center text-left py-4 px-5 focus:outline-none"
                                                    aria-expanded={isExpanded}
                                                >
                                                    <span className="text-[14px] font-semibold tracking-wide">{item.q}</span>
                                                    <ChevronDown 
                                                        size={16} 
                                                        className={`transform transition-transform duration-300 opacity-60 ${
                                                            isExpanded ? 'rotate-180 text-black opacity-100' : ''
                                                        }`}
                                                    />
                                                </button>

                                                <div 
                                                    className={`overflow-hidden transition-all duration-300 ${
                                                        isExpanded ? 'max-h-60 border-t border-black/5' : 'max-h-0'
                                                    }`}
                                                >
                                                    <div className="py-4 px-5 text-[13px] opacity-80 leading-relaxed font-medium">
                                                        {item.a}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Additional Help Banner */}
                <div className="mt-16 bg-[#F9F9F9] p-8 border border-black/5 text-center rounded-sm">
                    <HelpCircle size={24} className="mx-auto mb-3 opacity-60" />
                    <p className="text-[14px] uppercase font-bold tracking-wider mb-2">Still have questions?</p>
                    <p className="text-[12px] opacity-60 max-w-md mx-auto mb-6">
                        If you need further help with custom sizing, measurement instructions, or order details, please reach out to us.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="mailto:support@qissey.com" 
                            className="px-6 py-3 border border-black text-[11px] uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-all rounded-sm"
                        >
                            Email Support
                        </a>
                        <a 
                            href="tel:+917862930732" 
                            className="px-6 py-3 bg-black text-white text-[11px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] transition-all rounded-sm"
                        >
                            Call Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
