import { useState, useEffect, useRef } from 'react';

export default function AnimatedStat({ value, suffix, label, prefix }) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated) {
                setHasAnimated(true);
                startAnimation();
            }
        }, { threshold: 0.3 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasAnimated, value]);

    const startAnimation = () => {
        let startTime = null;
        const duration = 2000; // 2 seconds

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easeProgress * value));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(value);
            }
        };

        window.requestAnimationFrame(step);
    };

    return (
        <div className="stat-card" ref={ref}>
            <div className="stat-card__value">
                {prefix}{count}{suffix}
            </div>
            <div className="stat-card__label">{label}</div>
        </div>
    );
}
