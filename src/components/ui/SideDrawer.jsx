import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './Primitives';

/**
 * A generic side drawer component that slides in from the right.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the drawer is open.
 * @param {Function} props.onClose - Function to call when the drawer should close.
 * @param {string} props.title - Title to display at the top of the drawer.
 * @param {React.ReactNode} props.children - Content to display inside the drawer.
 */
export default function SideDrawer({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b border-black/5 flex items-center justify-between">
                            <p className="text-xl uppercase font-medium tracking-tight">{title}</p>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
