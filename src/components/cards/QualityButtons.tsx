"use client";

import { motion } from "framer-motion";
import { QUALITY_LABELS } from "@/lib/sm2";

interface QualityButtonsProps {
  onSelect: (quality: number) => void;
  disabled?: boolean;
}

export default function QualityButtons({ onSelect, disabled }: QualityButtonsProps) {
  return (
    <motion.div
      className="flex gap-3 flex-wrap justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.05 }}
    >
      {QUALITY_LABELS.map(({ value, label, color, description }) => (
        <motion.button
          key={value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={disabled}
          onClick={() => onSelect(value)}
          className={`${color} text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-0.5 min-w-[80px]`}
        >
          <span>{label}</span>
          <span className="text-[10px] opacity-70 font-normal">{description.split(" ")[0]}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
