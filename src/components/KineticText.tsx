"use client";

import { motion, Variants } from "framer-motion";

interface KineticTextProps {
    text: string;
    className?: string;
    delay?: number;
    type?: "char" | "word";
}

export function KineticText({
    text,
    className = "",
    delay = 0,
    type = "char",
}: KineticTextProps) {
    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i + delay },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    if (type === "word") {
        const words = text.split(" ");
        return (
            <motion.div
                style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", gap: "0.25em" }}
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className={className}
            >
                {words.map((word, index) => (
                    <motion.span variants={child} key={index} style={{ display: "inline-block" }}>
                        {word}
                    </motion.span>
                ))}
            </motion.div>
        );
    }

    const letters = Array.from(text);
    return (
        <motion.div
            style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
}
