export function WaveIcon({ className = "h-8 w-8", stroke = "currentColor" }) {
    return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
            <path
                d="M42 24c0 9.9-8.1 18-18 18S6 33.9 6 24 14.1 6 24 6c6.6 0 12.4 3.6 15.6 8.9"
                stroke={stroke}
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            <path
                d="M15 29.5c2-5.4 7-7.9 11.6-6.3 3.4 1.1 4.9 4.3 3.2 6.8"
                stroke={stroke}
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
}

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
            <WaveIcon className="h-7 w-7" stroke={dark ? "#050B18" : "#FFFFFF"} />
            <span
                className={`font-display text-lg font-bold tracking-tight ${
                    dark ? "text-[#050B18]" : "text-white"
                }`}
            >
                Ocean Studio
            </span>
        </span>
    );
}

export function OceanWordmark({ className = "" }) {
    return (
        <span className={`inline-flex items-center gap-1 ${className}`} aria-label="Ocean Studio">
            <WaveIcon className="h-9 w-9 sm:h-11 sm:w-11" stroke="#FFFFFF" />
            <span className="font-display text-4xl font-bold leading-none tracking-tight text-white sm:text-5xl">
                cean
            </span>
        </span>
    );
}

export default WaveLogo;
