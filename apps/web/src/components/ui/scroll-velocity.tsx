"use client";

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from 'framer-motion';

interface VelocityMapping {
    input: [number, number];
    output: [number, number];
}

interface VelocityTextProps {
    children: React.ReactNode;
    baseVelocity: number;
    scrollContainerRef?: React.RefObject<HTMLElement> | undefined;
    className?: string | undefined;
    damping?: number | undefined;
    stiffness?: number | undefined;
    numCopies?: number | undefined;
    velocityMapping?: VelocityMapping | undefined;
    parallaxClassName?: string | undefined;
    scrollerClassName?: string | undefined;
    parallaxStyle?: React.CSSProperties | undefined;
    scrollerStyle?: React.CSSProperties | undefined;
}

interface ScrollVelocityProps {
    scrollContainerRef?: React.RefObject<HTMLElement>;
    texts?: string[];
    velocity?: number;
    className?: string;
    damping?: number;
    stiffness?: number;
    numCopies?: number;
    velocityMapping?: VelocityMapping;
    parallaxClassName?: string;
    scrollerClassName?: string;
    parallaxStyle?: React.CSSProperties;
    scrollerStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
    const [width, setWidth] = useState(0);

    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        function updateWidth() {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        }
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [ref]);

    return width;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
    scrollContainerRef,
    texts, // Removed default empty array
    velocity = 100,
    className = '',
    damping = 50,
    stiffness = 400,
    numCopies = 6,
    velocityMapping = { input: [0, 1000], output: [0, 5] },
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
    children // Destructure children
}) => {
    function VelocityText({
        children,
        baseVelocity = velocity,
        scrollContainerRef,
        className = '',
        damping,
        stiffness,
        numCopies,
        velocityMapping,
        parallaxClassName,
        scrollerClassName,
        parallaxStyle,
        scrollerStyle
    }: VelocityTextProps) {
        const baseX = useMotionValue(0);
        const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
        const { scrollY } = useScroll(scrollOptions);
        const scrollVelocity = useVelocity(scrollY);
        const smoothVelocity = useSpring(scrollVelocity, {
            damping: damping ?? 50,
            stiffness: stiffness ?? 400
        });
        const velocityFactor = useTransform(
            smoothVelocity,
            velocityMapping?.input || [0, 1000],
            velocityMapping?.output || [0, 5],
            { clamp: false }
        );

        const copyRef = useRef<HTMLDivElement>(null); // Changed to HTMLDivElement
        const copyWidth = useElementWidth(copyRef);

        function wrap(min: number, max: number, v: number): number {
            const range = max - min;
            const mod = (((v - min) % range) + range) % range;
            return mod + min;
        }

        const x = useTransform(baseX, v => {
            if (copyWidth === 0) return '0px';
            return `${wrap(-copyWidth, 0, v)}px`;
        });

        const directionFactor = useRef<number>(1);

        useAnimationFrame((_, delta) => {
            let moveBy = directionFactor.current * baseVelocity * ((delta || 16) / 1000);

            if (velocityFactor.get() < 0) {
                directionFactor.current = -1;
            } else if (velocityFactor.get() > 0) {
                directionFactor.current = 1;
            }

            moveBy += directionFactor.current * moveBy * velocityFactor.get();
            baseX.set(baseX.get() + moveBy);
        });

        const spans = [];
        for (let i = 0; i < (numCopies ?? 6); i++) {
            spans.push(
                <div className={`flex-shrink-0 ${className}`} key={i} ref={i === 0 ? copyRef : null}> {/* Changed to div */}
                    {children}
                </div>
            );
        }

        return (
            <div className={`${parallaxClassName ?? ''} relative overflow-hidden`} style={parallaxStyle}>
                <motion.div
                    className={`${scrollerClassName ?? ''} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`}
                    style={{ ...scrollerStyle, x } as any}
                >
                    {spans}
                </motion.div>
            </div>
        );
    }

    if (children) {
        return (
            <section>
                <VelocityText
                    className={className}
                    baseVelocity={velocity}
                    scrollContainerRef={scrollContainerRef as any}
                    damping={damping}
                    stiffness={stiffness}
                    numCopies={numCopies}
                    velocityMapping={velocityMapping}
                    parallaxClassName={parallaxClassName}
                    scrollerClassName={scrollerClassName}
                    parallaxStyle={parallaxStyle}
                    scrollerStyle={scrollerStyle}
                >
                    {children}
                </VelocityText>
            </section>
        );
    }

    return (
        <section>
            {(texts || []).map((text: string, index: number) => ( // Ensure texts is an array
                <VelocityText
                    key={index}
                    className={className}
                    baseVelocity={index % 2 !== 0 ? -velocity : velocity}
                    scrollContainerRef={scrollContainerRef as any}
                    damping={damping}
                    stiffness={stiffness}
                    numCopies={numCopies}
                    velocityMapping={velocityMapping}
                    parallaxClassName={parallaxClassName}
                    scrollerClassName={scrollerClassName}
                    parallaxStyle={parallaxStyle}
                    scrollerStyle={scrollerStyle}
                >
                    {text}&nbsp;
                </VelocityText>
            ))}
        </section>
    );
};

export default ScrollVelocity;
