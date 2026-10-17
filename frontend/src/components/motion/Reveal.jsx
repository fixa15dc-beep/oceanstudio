import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/** Masked line-by-line reveal. `lines` is an array of strings. */
export function LineReveal({ lines, className = "", delay = 0, as: Tag = "h1", inView = false }) {
    const anim = inView
        ? { whileInView: { y: 0 }, viewport: { once: true, amount: 0.6 } }
        : { animate: { y: 0 } };
    return (
        <Tag className={className}>
            {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                    <motion.span
                        className="block"
                        initial={{ y: "110%" }}
                        {...anim}
                        transition={{ duration: 1, ease, delay: delay + i * 0.12 }}
                    >
                        {line}
                    </motion.span>
                </span>
            ))}
        </Tag>
    );
}

/** Fade + rise on scroll. */
export function FadeUp({ children, className = "", delay = 0, y = 24, once = true, amount = 0.25 }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount }}
            transition={{ duration: 0.9, ease, delay }}
        >
            {children}
        </motion.div>
    );
}

/** Hairline that draws itself in. */
export function Rule({ className = "", delay = 0 }) {
    return (
        <motion.div
            className={`h-px w-full origin-left bg-white/15 ${className}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.2, ease, delay }}
        />
    );
}
