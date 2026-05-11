"use client";

/**
 * Motion Components
 * 
 * Reusable animation components using Framer Motion.
 * Provides staggered entrance animations for page elements.
 */

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// Animation variants for fade-in + slide-up effect
const fadeSlideUp: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
    },
};

// Container variants for staggered children
const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

interface MotionContainerProps {
    children: ReactNode;
    className?: string;
    /** Delay before animation starts (in seconds) */
    delay?: number;
}

interface MotionItemProps {
    children: ReactNode;
    className?: string;
    /** Custom delay for this item (in seconds) */
    delay?: number;
    /** Animation duration (in seconds) */
    duration?: number;
}

/**
 * Container that staggers children animations
 */
export function MotionContainer({
    children,
    className,
    delay = 0,
}: MotionContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Individual item with fade-in + slide-up animation
 */
export function MotionItem({
    children,
    className,
    delay = 0,
    duration = 0.5,
}: MotionItemProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeSlideUp}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Page wrapper with entrance animation
 */
export function MotionPage({
    children,
    className,
}: MotionContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Staggered list item - use inside MotionContainer
 */
export function MotionListItem({
    children,
    className,
    duration = 0.5,
}: Omit<MotionItemProps, 'delay'>) {
    return (
        <motion.div
            variants={fadeSlideUp}
            transition={{
                duration,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Export variants for custom use
export { fadeSlideUp, staggerContainer };
