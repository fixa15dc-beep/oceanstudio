export function WaveMark({ className = "h-8 w-auto", stroke = "currentColor", opacity = 1 }) {
    return (
        <svg
            viewBox="0 0 120 48"
            fill="none"
            aria-hidden="true"
            className={className}
            style={{ opacity }}
        >
            <path
                d="M6 28 C 14 14, 22 14, 30 28 S 46 42, 54 28 S 70 14, 78 28 S 94 42, 102 28"
                stroke={stroke}
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            <path
                d="M22 20 C 27 11, 32 11, 37 20"
                stroke={stroke}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.55"
            />
        </svg>
    );
}

export function WaveLogo({ dark = false, className = "" }) {
    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            <WaveMark className="h-6 w-auto" stroke={dark ? "#0A192F" : "#FFFFFF"} />
            <span
                className={`font-display font-semibold tracking-[0.22em] text-sm uppercase ${
                    dark ? "text-[#0A192F]" : "text-white"
                }`}
            >
                Ocean Studio
            </span>
        </span>
    );
}

export default WaveLogo;
