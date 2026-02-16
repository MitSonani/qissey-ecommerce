import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button, cn } from '../../../components/ui/Primitives';

export default function CustomSizeModal({ isOpen, onClose, onSave }) {
    const [measurements, setMeasurements] = useState({
        chest: '',
        waist: '',
        hips: '',
        shoulder: '',
        length: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeasurements(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(measurements);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-md shadow-2xl relative"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-[14px] font-bold uppercase tracking-[0.2em]">Custom Size Info</p>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-neutral-100 transition-colors"
                            >
                                <X size={20} className="text-neutral-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Chest (IN)</label>
                                    <input
                                        type="number"
                                        name="chest"
                                        value={measurements.chest}
                                        onChange={handleChange}
                                        placeholder="e.g. 36.0"
                                        step="0.1"
                                        className="w-full border-b border-neutral-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Waist (IN)</label>
                                    <input
                                        type="number"
                                        name="waist"
                                        value={measurements.waist}
                                        onChange={handleChange}
                                        placeholder="e.g. 30.0"
                                        step="0.1"
                                        className="w-full border-b border-neutral-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Hips (IN)</label>
                                    <input
                                        type="number"
                                        name="hips"
                                        value={measurements.hips}
                                        onChange={handleChange}
                                        placeholder="e.g. 38.0"
                                        step="0.1"
                                        className="w-full border-b border-neutral-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Shoulder (IN)</label>
                                    <input
                                        type="number"
                                        name="shoulder"
                                        value={measurements.shoulder}
                                        onChange={handleChange}
                                        placeholder="e.g. 15.0"
                                        step="0.1"
                                        className="w-full border-b border-neutral-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Length (IN)</label>
                                    <input
                                        type="number"
                                        name="length"
                                        value={measurements.length}
                                        onChange={handleChange}
                                        placeholder="e.g. 28.0"
                                        step="0.1"
                                        className="w-full border-b border-neutral-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={measurements.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Any specific requirements..."
                                    className="w-full border border-neutral-200 p-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 py-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 py-3"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
