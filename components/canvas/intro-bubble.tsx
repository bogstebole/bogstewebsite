"use client";

import { motion } from "framer-motion";
import styles from "./intro-bubble.module.css";

interface IntroBubbleProps {
    onClose: () => void;
}

export function IntroBubble({ onClose }: IntroBubbleProps) {
    return (
        <motion.div
            className={styles.bubble}
            initial={{ scale: 0.7, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            style={{ transformOrigin: "bottom center" }}
            onClick={(e) => e.stopPropagation()}
        >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                ✕
            </button>
            <p className={styles.headline}>Look Muuum... a visitor!</p>
            <p className={styles.body}>
                Hey, I&apos;m Bogdan, a Design Engineer with 10 years of experience.
                I build web and mobile apps (mobile is my true love), and I live the
                agentic coding life. Let&apos;s be AI besties.
            </p>
            <div className={styles.tail} />
        </motion.div>
    );
}
