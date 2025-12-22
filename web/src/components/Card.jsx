import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Card({ question, psychology, category, themeColor }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="relative w-[320px] h-[480px] perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden clay-card p-8 flex flex-col justify-between items-center text-center">
                    <div className="w-full flex justify-between items-center z-10">
                        <span className="text-[10px] uppercase tracking-widest text-textMuted font-medium">{category}</span>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: themeColor, boxShadow: `0 0 15px ${themeColor}88` }}
                        />
                    </div>

                    <h2 className="text-2xl font-medium leading-tight z-10 px-2">
                        {question}
                    </h2>

                    <div className="text-[12px] text-textMuted z-10 font-light tracking-wide">
                        Tap to mold the mirror
                    </div>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden clay-card p-8 flex flex-col justify-between items-center text-center rotate-y-180"
                    style={{ borderTop: `1px solid ${themeColor}33` }}
                >
                    <div className="w-full flex justify-start items-center z-10">
                        <span className="text-[10px] uppercase tracking-widest text-textMuted font-medium italic">Psychological Insight</span>
                    </div>

                    <p className="text-body text-textSecondary font-light leading-relaxed z-10 px-4">
                        {psychology}
                    </p>

                    <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: "linear" }}
                            className="h-full"
                            style={{ backgroundColor: themeColor }}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
