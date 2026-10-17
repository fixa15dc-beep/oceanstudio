import { useEffect, useRef } from "react";

/**
 * Custom blue cursor:
 * - a soft glowing blue drop that follows the pointer with easing.
 * Disabled on touch / coarse-pointer devices (keeps native behaviour).
 */
export default function WaterCursor() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const fine = window.matchMedia("(pointer: fine)").matches;
        if (!fine) return;

        document.documentElement.classList.add("water-cursor-on");

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let w = 0;
        let h = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        const pointer = { x: w / 2, y: h / 2 };
        const drop = { x: w / 2, y: h / 2 };
        let visible = false;
        let pressed = false;

        const onMove = (e) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            if (!visible) {
                visible = true;
                drop.x = pointer.x;
                drop.y = pointer.y;
            }
        };
        const onLeave = () => {
            visible = false;
        };
        const onDown = () => {
            pressed = true;
        };
        const onUp = () => {
            pressed = false;
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseout", onLeave);
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);

        let raf;
        const render = () => {
            ctx.clearRect(0, 0, w, h);

            // easing leading drop
            drop.x += (pointer.x - drop.x) * 0.18;
            drop.y += (pointer.y - drop.y) * 0.18;

            if (visible) {
                const baseR = pressed ? 10 : 7;
                // glow
                const g = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, baseR * 3.2);
                g.addColorStop(0, "rgba(90, 185, 255, 0.55)");
                g.addColorStop(0.4, "rgba(56, 140, 255, 0.22)");
                g.addColorStop(1, "rgba(56, 140, 255, 0)");
                ctx.beginPath();
                ctx.fillStyle = g;
                ctx.arc(drop.x, drop.y, baseR * 3.2, 0, Math.PI * 2);
                ctx.fill();
                // core drop
                ctx.beginPath();
                ctx.fillStyle = "rgba(180, 225, 255, 0.95)";
                ctx.arc(drop.x, drop.y, baseR * 0.55, 0, Math.PI * 2);
                ctx.fill();
                // outer soft ring
                ctx.beginPath();
                ctx.strokeStyle = "rgba(120, 200, 255, 0.7)";
                ctx.lineWidth = 1.4;
                ctx.arc(drop.x, drop.y, baseR, 0, Math.PI * 2);
                ctx.stroke();
            }

            raf = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseout", onLeave);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
            document.documentElement.classList.remove("water-cursor-on");
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            data-testid="water-cursor"
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 9999,
            }}
        />
    );
}
