import { motion } from 'framer-motion';

/**
 * Premium Page Loader
 * Highly aesthetic loading screen with brand-aligned animations.
 * Uses Framer Motion for smooth, high-end transitions.
 */
const PageLoader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
            <div className="relative flex flex-col items-center overflow-hidden">
                <motion.div
                    initial={{ y: "120%" }}
                    animate={{ y: 0 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.19, 1, 0.22, 1]
                    }}
                    className="flex flex-col items-center"
                >
                    <span className="text-[14px] font-display font-black uppercase tracking-[0.8em] text-brand-charcoal mb-6 ml-[0.8em]">
                        QISSEY
                    </span>

                    {/* Minimal Progress Trace */}
                    <div className="w-24 h-[1px] bg-brand-charcoal/5 relative overflow-hidden">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut",
                                repeatDelay: 0.2
                            }}
                            className="absolute inset-0 bg-brand-charcoal/40"
                        />
                    </div>
                </motion.div>

                {/* Secondary Staggered Reveal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                    className="mt-12 overflow-hidden px-4 py-1 border-x border-brand-charcoal/10"
                >
                    <motion.p
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[8px] uppercase font-bold tracking-[0.4em] text-brand-charcoal whitespace-nowrap"
                    >
                        Refined Materiality • Minimal Design
                    </motion.p>
                </motion.div>
            </div>

            {/* Soft Ambient Background Pulse */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.03, 0.07, 0.03]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[500px] h-[500px] bg-brand-charcoal rounded-full blur-[120px] pointer-events-none"
            />
        </motion.div>
    );
};

export default PageLoader;
