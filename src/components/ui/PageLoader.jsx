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
                    initial={{ scale: 0.55, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.19, 1, 0.22, 1]
                    }}
                    className="flex flex-col items-center"
                >
                    <img src="/logo.PNG" alt="QISSEY" className="h-16 md:h-20 w-auto object-contain mb-8 brightness-0" />

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
            </div>

        </motion.div>
    );
};

export default PageLoader;
