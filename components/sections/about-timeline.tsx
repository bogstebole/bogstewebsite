"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PixelCharacter } from "@/components/canvas/PixelCharacter";
import { createInitialState, type CharacterState } from "@/lib/game-engine";

// ── TIMELINE DATA ──
const EVENTS = [
    {
        year: "1996", title: "Early Creativity", color: "#fbbf24", icon: "crayon",
        text: ["Ever since I was a little kid, I've been drawn to the creative world. I remember in kindergarten, I'd get these strange looks for the stuff I drew — tons of black circles and other odd things.", "But by the time I hit preschool, my drawings were actually winning awards! Go figure, right?"]
    },
    {
        year: "2007", title: "A Fork in the Road", color: "#fb923c", icon: "fork",
        text: ["Growing up, I was torn between two completely different paths: art school or becoming a veterinarian. I've always loved animals.", "I remember when I was 5, I accidentally stepped on a sparrow — I completely freaked out and was sobbing my eyes out. But art... well, that was a different story. It just had this pull on me that I couldn't ignore."]
    },
    {
        year: "2008", title: "Art School & Beyond", color: "#f472b6", icon: "palette",
        text: ["So, I ended up enrolling in the High School of Arts, specializing in painting. It was there I met a friend and professor who would later become a key figure in my story and someone who significantly shaped my current career."]
    },
    {
        year: "2011", title: "New Media Adventures", color: "#a78bfa", icon: "camera",
        text: ["Things moved fast after that. I actually started at the Academy of Arts a year early, and that's where I got hooked on conceptual and new media art. It was so different and exciting!"]
    },
    {
        year: "2015", title: "Master's Degree", color: "#60a5fa", icon: "gradcap",
        text: ["I just had to learn more, so I went on to get my Master's degree in New Media Arts in Novi Sad."]
    },
    {
        year: "2016", title: "Doughnuts & Dreams", color: "#fb923c", icon: "donut",
        text: ["After all that studying, I needed a break and wanted to see the world. I got a chance to be a model in India, which was an amazing experience.", "When I came back, I needed to pay the bills, so I started making doughnuts at a friend's shop. Yeah, a bit of a change from the art world, huh?", 'At the same time, I was renting an apartment that had a studio space. I thought, "Perfect! I\'ll finally focus on my painting career." Well, it didn\'t quite take off the way I hoped.']
    },
    {
        year: "2017", title: "Coding Detour & Design Spark", color: "#4ade80", icon: "lightbulb",
        text: ["The owner of the apartment ran an agency and offered me a job if I learned some front-end development. I gave it a shot, but coding wasn't really my thing.", "Luckily, I bumped into an old high school friend. He got me really interested in web design. I had no clue what that even involved or how design turned into websites.", "But I was determined! I quit my doughnut-making gig and dove headfirst into learning everything I could about design.", "Then, another lucky break! I went to my landlord's birthday party and met a guy who owned a software agency. After a month, they actually hired me!"]
    },
    {
        year: "2018", title: "Design Beginnings", color: "#22d3ee", icon: "rocket",
        text: ["And that's how my product design journey began. I spent three years at that agency. It was tough, and I felt like I wasn't growing as much as I wanted to.", "So, I started looking for freelance work on the side. I landed some really cool projects, like designing a streaming platform for musicians in Thailand and working on a banking app."]
    },
    {
        year: "2021", title: "Agency Change", color: "#a78bfa", icon: "agency",
        text: ["Eventually, I moved to a different agency called Cinnamon. That place was incredible! I learned so much in just one year — workshops, design processes, you name it.", "Plus, I got to work with some amazing clients. I even ended up working on AI platforms and improving design systems for fintech companies."]
    },
    {
        year: "2022", title: "Freelancing & Growth", color: "#4ade80", icon: "levelup",
        text: ["My next adventure came when I was hired as a freelancer by Tenscope agency. I started on just one project, but I guess I did alright because they made me the UX lead and brought me on full-time!", "Now, besides client projects, I'm also responsible for making our design processes better — standardizing documentation, figuring out how we communicate design decisions, and keeping our files organized."]
    },
    {
        year: "2023", title: "Tenscope & UX Leadership", color: "#60a5fa", icon: "crown",
        text: ["I'm still at Tenscope, and we're constantly trying to improve and find new ways of doing things. Agency life is definitely challenging, but it's also a lot of fun."]
    },
    {
        year: "2025", title: "Design Engineering", color: "#f472b6", icon: "bolt",
        text: ['This year, the gap between "designing a concept" and "shipping a product" finally disappeared. By heavily integrating AI into my workflow, I transitioned from being a designer who dreams up interfaces to a creator who builds them.', "From solving my own financial tracking for my agency to exploring the \"digital hoarding\" of Useless Notes, I've spent the year using AI as a bridge. It's allowed me to return to that raw, childhood curiosity — where an idea doesn't stay on a canvas, but becomes a thing that actually lives."]
    },
];

// ── PIXEL ICON SVGs ──
function MarkerIcon({ icon, color, size = 48 }: { icon: string; color: string; size?: number }) {
    const c = color;
    const icons: Record<string, React.ReactNode> = {
        crayon: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="5" y="2" width="4" height="2" fill={c} /><rect x="4" y="4" width="6" height="2" fill={c} />
                <rect x="4" y="6" width="6" height="10" fill={c} /><rect x="5" y="16" width="4" height="2" fill={c} />
                <rect x="6" y="18" width="2" height="2" fill={c} /><rect x="6" y="20" width="2" height="2" fill="#fef3c7" />
                <rect x="14" y="8" width="6" height="4" fill="#fff" opacity=".3" />
                <rect x="14" y="8" width="2" height="2" fill={c} opacity=".5" /><rect x="18" y="10" width="2" height="2" fill={c} opacity=".5" />
                <rect x="16" y="14" width="4" height="2" fill={c} opacity=".3" />
            </svg>
        ),
        fork: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="10" y="14" width="4" height="8" fill={c} /><rect x="10" y="12" width="4" height="2" fill={c} />
                <rect x="8" y="10" width="2" height="2" fill={c} /><rect x="14" y="10" width="2" height="2" fill={c} />
                <rect x="6" y="8" width="2" height="2" fill={c} /><rect x="16" y="8" width="2" height="2" fill={c} />
                <rect x="4" y="4" width="2" height="4" fill={c} /><rect x="18" y="4" width="2" height="4" fill={c} />
                <rect x="2" y="2" width="4" height="2" fill={c} /><rect x="18" y="2" width="4" height="2" fill={c} />
                <rect x="3" y="1" width="2" height="2" fill="#fff" opacity=".4" /><rect x="19" y="1" width="2" height="2" fill="#fff" opacity=".4" />
            </svg>
        ),
        palette: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="6" y="4" width="12" height="2" fill={c} /><rect x="4" y="6" width="16" height="2" fill={c} />
                <rect x="2" y="8" width="20" height="8" fill={c} /><rect x="4" y="16" width="16" height="2" fill={c} />
                <rect x="6" y="18" width="12" height="2" fill={c} /><rect x="6" y="8" width="2" height="2" fill="#f87171" />
                <rect x="10" y="10" width="2" height="2" fill="#60a5fa" /><rect x="14" y="8" width="2" height="2" fill="#fbbf24" />
                <rect x="16" y="12" width="2" height="2" fill="#4ade80" /><rect x="8" y="14" width="2" height="2" fill="#a78bfa" />
                <rect x="12" y="6" width="4" height="4" fill="#0f0f23" />
            </svg>
        ),
        camera: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="8" y="2" width="4" height="2" fill={c} /><rect x="4" y="4" width="16" height="2" fill={c} />
                <rect x="2" y="6" width="20" height="12" fill={c} /><rect x="4" y="8" width="16" height="8" fill="#0f0f23" />
                <rect x="8" y="10" width="8" height="4" fill={c} opacity=".3" /><rect x="10" y="11" width="4" height="2" fill={c} />
                <rect x="18" y="5" width="2" height="2" fill="#f87171" /><rect x="6" y="18" width="12" height="2" fill={c} />
                <rect x="10" y="20" width="4" height="2" fill={c} />
            </svg>
        ),
        gradcap: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="10" y="2" width="4" height="2" fill={c} /><rect x="6" y="4" width="12" height="2" fill={c} />
                <rect x="2" y="6" width="20" height="2" fill={c} /><rect x="0" y="8" width="24" height="4" fill={c} />
                <rect x="6" y="12" width="2" height="4" fill={c} /><rect x="16" y="12" width="2" height="4" fill={c} />
                <rect x="6" y="16" width="12" height="2" fill={c} /><rect x="20" y="10" width="2" height="8" fill={c} />
                <rect x="19" y="18" width="4" height="2" fill={c} /><rect x="10" y="0" width="4" height="2" fill={c} opacity=".5" />
            </svg>
        ),
        donut: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="8" y="2" width="8" height="2" fill={c} /><rect x="6" y="4" width="2" height="2" fill={c} />
                <rect x="16" y="4" width="2" height="2" fill={c} /><rect x="4" y="6" width="2" height="4" fill={c} />
                <rect x="18" y="6" width="2" height="4" fill={c} /><rect x="2" y="8" width="2" height="8" fill={c} />
                <rect x="20" y="8" width="2" height="8" fill={c} /><rect x="4" y="14" width="2" height="4" fill={c} />
                <rect x="18" y="14" width="2" height="4" fill={c} /><rect x="6" y="18" width="2" height="2" fill={c} />
                <rect x="16" y="18" width="2" height="2" fill={c} /><rect x="8" y="20" width="8" height="2" fill={c} />
                <rect x="8" y="8" width="8" height="2" fill="#0f0f23" /><rect x="10" y="10" width="4" height="4" fill="#0f0f23" />
                <rect x="8" y="12" width="8" height="2" fill="#0f0f23" />
                <rect x="6" y="4" width="4" height="2" fill="#f472b6" opacity=".6" />
                <rect x="14" y="4" width="4" height="2" fill="#fbbf24" opacity=".6" />
                <rect x="4" y="8" width="2" height="2" fill="#a78bfa" opacity=".6" />
            </svg>
        ),
        lightbulb: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="8" y="2" width="8" height="2" fill={c} /><rect x="6" y="4" width="2" height="2" fill={c} />
                <rect x="16" y="4" width="2" height="2" fill={c} /><rect x="4" y="6" width="2" height="6" fill={c} />
                <rect x="18" y="6" width="2" height="6" fill={c} /><rect x="6" y="12" width="2" height="2" fill={c} />
                <rect x="16" y="12" width="2" height="2" fill={c} /><rect x="8" y="14" width="8" height="2" fill={c} />
                <rect x="8" y="4" width="8" height="10" fill={c} opacity=".25" />
                <rect x="10" y="7" width="4" height="4" fill="#fff" opacity=".5" />
                <rect x="8" y="16" width="8" height="2" fill="#94a3b8" /><rect x="8" y="18" width="8" height="2" fill="#94a3b8" />
                <rect x="10" y="20" width="4" height="2" fill="#94a3b8" />
                <rect x="2" y="8" width="2" height="2" fill={c} opacity=".4" />
                <rect x="20" y="8" width="2" height="2" fill={c} opacity=".4" />
                <rect x="10" y="0" width="4" height="2" fill={c} opacity=".4" />
            </svg>
        ),
        rocket: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="10" y="0" width="4" height="2" fill={c} /><rect x="8" y="2" width="8" height="2" fill={c} />
                <rect x="8" y="4" width="8" height="4" fill={c} /><rect x="6" y="8" width="12" height="6" fill={c} />
                <rect x="10" y="5" width="4" height="3" fill="#fff" opacity=".3" />
                <rect x="4" y="12" width="2" height="4" fill={c} /><rect x="18" y="12" width="2" height="4" fill={c} />
                <rect x="6" y="14" width="12" height="2" fill={c} />
                <rect x="8" y="16" width="2" height="2" fill="#f87171" /><rect x="10" y="16" width="4" height="2" fill="#fbbf24" />
                <rect x="14" y="16" width="2" height="2" fill="#f87171" />
                <rect x="9" y="18" width="2" height="2" fill="#fbbf24" opacity=".7" />
                <rect x="13" y="18" width="2" height="2" fill="#fbbf24" opacity=".7" />
                <rect x="10" y="20" width="4" height="2" fill="#fb923c" opacity=".4" />
            </svg>
        ),
        agency: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="4" y="2" width="16" height="2" fill={c} /><rect x="4" y="4" width="16" height="16" fill={c} />
                <rect x="6" y="6" width="4" height="3" fill="#0f0f23" /><rect x="14" y="6" width="4" height="3" fill="#0f0f23" />
                <rect x="6" y="11" width="4" height="3" fill="#0f0f23" /><rect x="14" y="11" width="4" height="3" fill="#0f0f23" />
                <rect x="7" y="7" width="2" height="1" fill="#fbbf24" opacity=".5" />
                <rect x="15" y="7" width="2" height="1" fill="#fbbf24" opacity=".5" />
                <rect x="7" y="12" width="2" height="1" fill="#fbbf24" opacity=".5" />
                <rect x="15" y="12" width="2" height="1" fill="#fbbf24" opacity=".5" />
                <rect x="10" y="15" width="4" height="5" fill="#fbbf24" opacity=".4" />
                <rect x="11" y="16" width="2" height="4" fill="#0f0f23" />
                <rect x="2" y="20" width="20" height="2" fill={c} /><rect x="10" y="0" width="4" height="2" fill={c} opacity=".5" />
            </svg>
        ),
        levelup: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="2" y="20" width="20" height="2" fill={c} opacity=".4" />
                <rect x="2" y="4" width="2" height="16" fill={c} opacity=".4" />
                <rect x="4" y="18" width="4" height="2" fill={c} /><rect x="8" y="14" width="4" height="6" fill={c} />
                <rect x="12" y="10" width="4" height="10" fill={c} /><rect x="16" y="6" width="4" height="14" fill={c} />
                <rect x="18" y="2" width="4" height="2" fill={c} /><rect x="16" y="4" width="2" height="2" fill={c} />
                <rect x="20" y="4" width="2" height="2" fill={c} />
                <rect x="14" y="4" width="2" height="2" fill="#fff" opacity=".3" />
                <rect x="18" y="0" width="2" height="2" fill="#fff" opacity=".3" />
            </svg>
        ),
        crown: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="2" y="8" width="4" height="2" fill={c} /><rect x="10" y="4" width="4" height="2" fill={c} />
                <rect x="18" y="8" width="4" height="2" fill={c} />
                <rect x="4" y="10" width="2" height="2" fill={c} /><rect x="18" y="10" width="2" height="2" fill={c} />
                <rect x="6" y="10" width="2" height="2" fill={c} /><rect x="16" y="10" width="2" height="2" fill={c} />
                <rect x="8" y="8" width="2" height="4" fill={c} /><rect x="14" y="8" width="2" height="4" fill={c} />
                <rect x="10" y="6" width="4" height="6" fill={c} /><rect x="2" y="12" width="20" height="4" fill={c} />
                <rect x="4" y="16" width="16" height="2" fill={c} />
                <rect x="3" y="6" width="2" height="2" fill={c} /><rect x="19" y="6" width="2" height="2" fill={c} />
                <rect x="11" y="2" width="2" height="2" fill={c} />
                <rect x="6" y="13" width="2" height="2" fill="#0f0f23" opacity=".3" />
                <rect x="10" y="13" width="2" height="2" fill="#0f0f23" opacity=".3" />
                <rect x="14" y="13" width="2" height="2" fill="#0f0f23" opacity=".3" />
            </svg>
        ),
        bolt: (
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
                <rect x="12" y="0" width="6" height="2" fill={c} /><rect x="10" y="2" width="6" height="2" fill={c} />
                <rect x="8" y="4" width="6" height="2" fill={c} /><rect x="6" y="6" width="12" height="2" fill={c} />
                <rect x="10" y="8" width="6" height="2" fill={c} /><rect x="8" y="10" width="6" height="2" fill={c} />
                <rect x="6" y="12" width="6" height="2" fill={c} /><rect x="4" y="14" width="6" height="2" fill={c} />
                <rect x="6" y="16" width="6" height="2" fill={c} />
                <rect x="16" y="14" width="2" height="2" fill={c} opacity=".3" />
                <rect x="18" y="16" width="2" height="2" fill={c} opacity=".3" />
                <rect x="14" y="18" width="2" height="2" fill={c} opacity=".3" />
            </svg>
        ),
    };
    return icons[icon] || icons.crayon;
}

// ── PROCEDURAL SCENE GENERATION ──
function generateSceneData() {
    const stars = Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 60,
        delay: Math.random() * 3,
        duration: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.8,
        size: Math.random() > 0.7 ? 3 : 2,
    }));
    const clouds = Array.from({ length: 8 }, (_, i) => {
        const w = 40 + Math.random() * 60;
        return {
            id: i, left: i * 13 + Math.random() * 5, top: 5 + Math.random() * 20, w,
            blocks: [{ x: 0, y: 8, w, h: 8 }, { x: w * 0.15, y: 0, w: w * 0.3, h: 8 }, { x: w * 0.5, y: 2, w: w * 0.35, h: 6 }]
        };
    });
    const trees = Array.from({ length: 30 }, (_, i) => {
        const h = 30 + Math.random() * 35;
        return {
            id: i, left: i * 3.3 + Math.random() * 1.5, h, trunkH: h * 0.35, crownW: 14 + Math.random() * 16, crownH: h * 0.55,
            hue: 130 + Math.random() * 30, sat: 50 + Math.random() * 20, light: 20 + Math.random() * 12
        };
    });
    const buildings = Array.from({ length: 20 }, (_, i) => {
        const w = 20 + Math.random() * 40, h = 40 + Math.random() * 100;
        const windows = [];
        for (let wy = 8; wy < h - 8; wy += 12)
            for (let wx = 4; wx < w - 4; wx += 10)
                if (Math.random() > 0.4) windows.push({ x: wx, y: wy, o: 0.3 + Math.random() * 0.5 });
        return { id: i, left: i * 5 + Math.random() * 2, w, h, windows };
    });
    return { stars, clouds, trees, buildings };
}

export function AboutTimeline() {
    const [started, setStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [scene, setScene] = useState<{
        stars: { id: number; left: number; top: number; delay: number; duration: number; opacity: number; size: number }[];
        clouds: { id: number; left: number; top: number; w: number; blocks: { x: number; y: number; w: number; h: number }[] }[];
        trees: { id: number; left: number; h: number; trunkH: number; crownW: number; crownH: number; hue: number; sat: number; light: number }[];
        buildings: { id: number; left: number; w: number; h: number; windows: { x: number; y: number; o: number }[] }[];
    } | null>(null);

    useEffect(() => {
        setScene(generateSceneData());
    }, []);

    // Character state for interaction
    const [charState, setCharState] = useState<CharacterState>(() => ({
        ...createInitialState(100), // width doesn't matter much here initially
        direction: "right",
    }));

    const scrollPosRef = useRef(0);
    const targetScrollRef = useRef(0);
    const charLeftRef = useRef(0);
    const charTargetRef = useRef(0);
    const scrollAnimRef = useRef<number>(0);
    const charAnimRef = useRef<number>(0);
    const lastWheelRef = useRef(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const eventsLayerRef = useRef<HTMLDivElement>(null);
    const charWrapperRef = useRef<HTMLDivElement>(null);
    const charRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const treesRef = useRef<HTMLDivElement>(null);
    const buildingsRef = useRef<HTMLDivElement>(null);
    const cloudsRef = useRef<HTMLDivElement>(null);
    const groundFarRef = useRef<HTMLDivElement>(null);
    const groundNearRef = useRef<HTMLDivElement>(null);

    const totalWidth = 3;

    const getMarkerPos = useCallback((i: number) => ((i + 1) / (EVENTS.length + 1)) * 100, []);

    const getScrollForIndex = useCallback((i: number) => {
        const frac = (i + 1) / (EVENTS.length + 1);
        const vc = 1 / totalWidth / 2;
        return Math.max(0, Math.min(frac - vc, 1 - 1 / totalWidth));
    }, []);

    const applyScroll = useCallback((pos: number) => {
        const p = pos * 100 * totalWidth;
        if (eventsLayerRef.current) eventsLayerRef.current.style.transform = `translateX(-${p}%)`;
        if (charWrapperRef.current) charWrapperRef.current.style.transform = `translateX(-${p}%)`;
        if (trackRef.current) trackRef.current.style.transform = `translateX(-${p}%)`;
        if (treesRef.current) treesRef.current.style.transform = `translateX(-${p * 0.7}%)`;
        if (buildingsRef.current) buildingsRef.current.style.transform = `translateX(-${p * 0.4}%)`;
        if (cloudsRef.current) cloudsRef.current.style.transform = `translateX(-${p * 0.2}%)`;
        if (groundFarRef.current) groundFarRef.current.style.transform = `translateX(-${p * 0.5}%)`;
        if (groundNearRef.current) groundNearRef.current.style.transform = `translateX(-${p * 0.8}%)`;
    }, []);

    const animateScroll = useCallback(() => {
        if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
        const step = () => {
            const diff = targetScrollRef.current - scrollPosRef.current;
            if (Math.abs(diff) < 0.0003) {
                scrollPosRef.current = targetScrollRef.current;
                applyScroll(scrollPosRef.current);
                return;
            }
            scrollPosRef.current += diff * 0.1;
            applyScroll(scrollPosRef.current);
            scrollAnimRef.current = requestAnimationFrame(step);
        };
        scrollAnimRef.current = requestAnimationFrame(step);
    }, [applyScroll]);

    const animateChar = useCallback(() => {
        if (charAnimRef.current) cancelAnimationFrame(charAnimRef.current);

        // Start walking
        setCharState(prev => ({ ...prev, isWalking: true }));

        const step = () => {
            const diff = charTargetRef.current - charLeftRef.current;

            // Update direction
            if (Math.abs(diff) > 0.01) {
                setCharState(prev => ({
                    ...prev,
                    direction: diff > 0 ? "right" : "left",
                    walkFrame: prev.walkFrame + 0.2
                }));
            }

            if (Math.abs(diff) < 0.05) {
                charLeftRef.current = charTargetRef.current;
                if (charRef.current) charRef.current.style.left = charLeftRef.current + "%";
                setCharState(prev => ({ ...prev, isWalking: false, walkFrame: 0 }));
                return;
            }
            charLeftRef.current += diff * 0.12;
            if (charRef.current) charRef.current.style.left = charLeftRef.current + "%";
            charAnimRef.current = requestAnimationFrame(step);
        };
        charAnimRef.current = requestAnimationFrame(step);
    }, []);

    const navigateTo = useCallback((i: number) => {
        const idx = Math.max(0, Math.min(EVENTS.length - 1, i));
        setCurrentIndex(idx);
        setBubbleVisible(false);
        targetScrollRef.current = getScrollForIndex(idx);
        charTargetRef.current = getMarkerPos(idx);
        animateScroll();
        animateChar();
        setTimeout(() => setBubbleVisible(true), 250);
    }, [getScrollForIndex, getMarkerPos, animateScroll, animateChar]);

    const navigate = useCallback((dir: number) => {
        setCurrentIndex((prev) => {
            const next = Math.max(0, Math.min(EVENTS.length - 1, prev + dir));
            navigateTo(next);
            return next;
        });
    }, [navigateTo]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!started) return;
            if (e.key === "ArrowLeft") navigate(-1);
            if (e.key === "ArrowRight") navigate(1);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [started, navigate]);

    // Wheel navigation
    useEffect(() => {
        const handler = (e: WheelEvent) => {
            if (!started) return;
            if ((e.target as HTMLElement).closest?.(".pt-chat-bubble")) return;
            // Prevent default only if we are consuming the scroll for navigation
            // But inside a window, maybe user wants to scroll? 
            // Actually this is a horizontal game logic so we should capture it.

            const now = Date.now();
            if (now - lastWheelRef.current < 400) return;

            if (Math.abs(e.deltaY) > 5 || Math.abs(e.deltaX) > 5) {
                lastWheelRef.current = now;
                navigate(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
            }
        };

        // Attach to container, not window, since it's a component
        const el = containerRef.current;
        if (el) el.addEventListener("wheel", handler, { passive: false });

        return () => {
            if (el) el.removeEventListener("wheel", handler);
        };
    }, [started, navigate]);

    // Start sequence
    const handleStart = useCallback(() => {
        setStarted(true);
        charLeftRef.current = getMarkerPos(0);
        charTargetRef.current = getMarkerPos(0);
        if (charRef.current) charRef.current.style.left = charLeftRef.current + "%";

        // Initial drop-in animation? 
        // For now just quick start
        setTimeout(() => navigateTo(0), 100);
    }, [getMarkerPos, navigateTo]);

    // Update blinking and breathing
    useEffect(() => {
        const interval = setInterval(() => {
            setCharState(prev => ({
                ...prev,
                breathTimer: prev.breathTimer + 1,
                blockTimer: prev.blinkTimer + 1, // typo fix later if needed
            }));
        }, 16);
        return () => clearInterval(interval);
    }, []);

    const ev = EVENTS[currentIndex];

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#1a1a2e] text-slate-200 font-sans select-none" style={{ imageRendering: "pixelated" }}>
            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />

            {/* INTRO SCREEN */}
            <div className={`absolute inset-0 z-[100] bg-[#1a1a2e] flex flex-col items-center justify-center transition-all duration-600 ${started ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"}`}>
                <div className="absolute inset-0 pointer-events-none">
                    {scene?.stars.slice(0, 80).map((s) => (
                        <div key={s.id} className="absolute bg-white animate-pulse"
                            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, opacity: s.opacity, width: s.size, height: s.size }} />
                    ))}
                </div>
                <div className="font-[family-name:var(--font-press-start-2p)] text-[clamp(18px,4vw,36px)] text-[#4ade80] mb-3 animate-[pulse_3s_infinite]" style={{ fontFamily: '"Press Start 2P", monospace', textShadow: "0 0 20px rgba(74,222,128,0.4)" }}>
                    MY JOURNEY
                </div>
                <div className="font-[family-name:var(--font-press-start-2p)] text-[clamp(8px,1.5vw,13px)] text-slate-400 mb-12 text-center leading-loose" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                    A pixel-sized biography
                </div>
                <button
                    className="font-[family-name:var(--font-press-start-2p)] text-[clamp(10px,1.8vw,16px)] text-[#1a1a2e] bg-[#4ade80] border-none py-4 px-10 cursor-pointer hover:bg-[#fbbf24] hover:scale-105 active:scale-95 transition-all relative overflow-hidden group"
                    style={{ fontFamily: '"Press Start 2P", monospace', clipPath: "polygon(0 4px,4px 4px,4px 0,calc(100% - 4px) 0,calc(100% - 4px) 4px,100% 4px,100% calc(100% - 4px),calc(100% - 4px) calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,4px calc(100% - 4px),0 calc(100% - 4px))" }}
                    onClick={handleStart}
                >
                    ▶ START
                </button>
                <div className="mt-10 font-[family-name:var(--font-press-start-2p)] text-[clamp(7px,1vw,10px)] text-slate-500 text-center leading-relaxed opacity-60" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                    ← → ARROW KEYS TO EXPLORE<br />SCROLL TO MOVE
                </div>
            </div>

            {/* GAME SCENE */}
            <div className={`absolute inset-0 overflow-hidden transition-opacity duration-800 ${started ? "opacity-100" : "opacity-0"}`}>
                {/* Sky Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f23] via-[#1a1a3e] to-[#1a2744]" />

                {/* Stars */}
                <div className="absolute inset-0 pointer-events-none">
                    {scene?.stars.map((s) => (
                        <div key={s.id} className="absolute bg-white animate-pulse"
                            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, opacity: s.opacity, width: s.size, height: s.size }} />
                    ))}
                </div>

                {/* Moon */}
                <div className="absolute top-[8%] right-[12%] w-[60px] h-[60px] bg-[#fef3c7] rounded-full shadow-[0_0_40px_rgba(254,243,199,0.3),0_0_80px_rgba(254,243,199,0.1)]" />

                {/* Clouds */}
                <div className="absolute top-0 left-0 w-[200%] h-[40%] pointer-events-none" ref={cloudsRef}>
                    {scene?.clouds.map((cl) => (
                        <div key={cl.id} className="absolute opacity-10" style={{ left: `${cl.left}%`, top: `${cl.top}%` }}>
                            {cl.blocks.map((b, bi) => (
                                <div key={bi} className="absolute bg-white" style={{ left: b.x, top: b.y, width: b.w, height: b.h }} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Buildings */}
                <div className="absolute bottom-[30%] left-0 w-[300%] h-[180px] pointer-events-none opacity-10" ref={buildingsRef}>
                    {scene?.buildings.map((b) => (
                        <div key={b.id} className="absolute bottom-0 bg-slate-700" style={{ left: `${b.left}%`, width: b.w, height: b.h }}>
                            {b.windows.map((w, wi) => (
                                <div key={wi} className="absolute bg-amber-400 w-1 h-1" style={{ left: w.x, top: w.y, opacity: w.o }} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Trees */}
                <div className="absolute bottom-[30%] left-0 w-[300%] h-[100px] pointer-events-none" ref={treesRef}>
                    {scene?.trees.map((t) => (
                        <div key={t.id} className="absolute bottom-0" style={{ left: `${t.left}%`, height: t.h }}>
                            <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2" style={{ width: t.crownW, height: t.crownH, background: `hsl(${t.hue},${t.sat}%,${t.light}%)` }} />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-[#8B5E3C]" style={{ height: t.trunkH }} />
                        </div>
                    ))}
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none bg-[#1a2744]">
                    <div className="absolute bottom-0 left-0 w-[200%] h-full" ref={groundFarRef}
                        style={{ background: "repeating-linear-gradient(90deg,#2d5a27 0px,#2d5a27 16px,#1e3d1a 16px,#1e3d1a 32px)" }} />
                    <div className="absolute bottom-0 left-0 w-[200%] h-[45%]" ref={groundNearRef}
                        style={{ background: "repeating-linear-gradient(90deg,#1e3d1a 0px,#1e3d1a 24px,#173015 24px,#173015 48px)" }} />
                </div>

                {/* Track */}
                <div className="absolute bottom-[29.5%] left-0 right-0 h-1 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[300%] h-1" ref={trackRef}
                        style={{ background: "repeating-linear-gradient(90deg,rgba(74,222,128,0.25) 0px,rgba(74,222,128,0.25) 8px,transparent 8px,transparent 16px)" }} />
                </div>

                {/* Markers */}
                <div className="absolute bottom-[calc(30%+4px)] left-0 w-[300%] pointer-events-none" ref={eventsLayerRef}>
                    {EVENTS.map((e, i) => (
                        <div key={i}
                            className={`absolute bottom-0 flex flex-col items-center pointer-events-auto cursor-pointer -translate-x-1/2 transition-transform duration-300 hover:scale-105 group ${i === currentIndex ? "scale-110" : ""}`}
                            style={{ left: `${getMarkerPos(i)}%` }}
                            onClick={() => navigateTo(i)}>
                            <div className={`font-[family-name:var(--font-press-start-2p)] text-[13px] mb-2.5 whitespace-nowrap transition-all tracking-wider ${i === currentIndex ? "brightness-125 scale-110" : "opacity-30"}`}
                                style={{ color: e.color, fontFamily: '"Press Start 2P", monospace', textShadow: `0 0 12px ${e.color}60, 0 2px 4px rgba(0,0,0,0.9)` }}>
                                {e.year}
                            </div>
                            <div className={`mb-2 transition-all drop-shadow-[0_0_4px_rgba(0,0,0,0.6)] ${i === currentIndex ? "scale-115 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" : "opacity-25"}`}>
                                <MarkerIcon icon={e.icon} color={e.color} />
                            </div>
                            <div className={`w-1 h-7 bg-[#4ade80]/25 transition-all ${i === currentIndex ? "bg-[#4ade80]/60 shadow-[0_0_8px_rgba(74,222,128,0.25)]" : "opacity-20"}`} />
                            <div className={`w-3.5 h-1 bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.35)] transition-all ${i === currentIndex ? "w-4.5 bg-[#fbbf24] shadow-[0_0_16px_rgba(251,191,36,0.5)]" : "opacity-20"}`} />
                        </div>
                    ))}
                </div>

                {/* Character */}
                <div className="absolute bottom-[calc(30%+4px)] left-0 w-[300%] pointer-events-none z-10" ref={charWrapperRef}>
                    <div className="absolute bottom-0" ref={charRef} style={{ left: "0%" }}>
                        {/* Using the shared PixelCharacter component, but we trick it with state props */}
                        <div className="relative -ml-6 -mb-4">
                            <PixelCharacter state={charState} groundY={100} />
                        </div>
                    </div>
                </div>

                {/* Chat Bubble */}
                <div className="absolute bottom-[calc(30%+192px)] left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[min(520px,90vw)]">
                    <div className="relative w-full">
                        <div className={`bg-[#0a0a1c]/95 border-2 border-[#4ade80]/35 w-full max-h-[calc(85vh-30%-240px)] overflow-y-auto p-6 pb-4 pointer-events-auto transition-all duration-300 origin-bottom pt-chat-bubble ${bubbleVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}`}
                            style={{
                                clipPath: "polygon(0 6px,6px 6px,6px 0,calc(100% - 6px) 0,calc(100% - 6px) 6px,100% 6px,100% calc(100% - 6px),calc(100% - 6px) calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,6px calc(100% - 6px),0 calc(100% - 6px))"
                            }}>
                            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                                <div className="font-[family-name:var(--font-press-start-2p)] text-[clamp(13px,2.2vw,17px)]" style={{ fontFamily: '"Press Start 2P", monospace', color: ev.color }}>{ev.year}</div>
                                <div className="font-[family-name:var(--font-press-start-2p)] text-[clamp(8px,1.2vw,11px)] text-slate-200" style={{ fontFamily: '"Press Start 2P", monospace' }}>{ev.title}</div>
                            </div>
                            <div className="text-[14.5px] leading-relaxed text-slate-400 space-y-2">
                                {ev.text.map((p, pi) => <p key={pi}>{p}</p>)}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#4ade80]/10">
                                <div className="font-[family-name:var(--font-press-start-2p)] text-[7px] text-slate-400 opacity-50" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                                    {currentIndex + 1} / {EVENTS.length}
                                </div>
                                <div className="flex gap-2">
                                    <button className="font-[family-name:var(--font-press-start-2p)] text-[8px] px-3 py-1.5 bg-transparent border border-[#4ade80]/20 text-[#4ade80] cursor-pointer hover:bg-[#4ade80] hover:text-[#1a1a2e] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                        style={{ fontFamily: '"Press Start 2P", monospace' }}
                                        disabled={currentIndex === 0}
                                        onClick={() => navigate(-1)}>
                                        ◀ PREV
                                    </button>
                                    <button className="font-[family-name:var(--font-press-start-2p)] text-[8px] px-3 py-1.5 bg-transparent border border-[#4ade80]/20 text-[#4ade80] cursor-pointer hover:bg-[#4ade80] hover:text-[#1a1a2e] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                        style={{ fontFamily: '"Press Start 2P", monospace' }}
                                        disabled={currentIndex === EVENTS.length - 1}
                                        onClick={() => navigate(1)}>
                                        NEXT ▶
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Bubble Tail */}
                        <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none z-20 ${bubbleVisible ? "opacity-100" : "opacity-0"}`}>
                            <div className="w-3 h-1 bg-[#0a0a1c]/95 border-l-2 border-r-2 border-[#4ade80]/35 mx-auto" />
                            <div className="w-1.5 h-1 bg-[#0a0a1c]/95 border-l-2 border-r-2 border-b-2 border-[#4ade80]/35 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* HUD Controls */}
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 transition-opacity duration-600 ${started ? "opacity-100" : "opacity-0"}`}>
                    <button className="w-12 h-12 flex items-center justify-center bg-[#0f0f23]/85 border-2 border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80] hover:text-[#1a1a2e] active:scale-95 transition-all cursor-pointer font-[family-name:var(--font-press-start-2p)] text-base"
                        style={{ fontFamily: '"Press Start 2P", monospace', clipPath: "polygon(0 4px,4px 4px,4px 0,calc(100% - 4px) 0,calc(100% - 4px) 4px,100% 4px,100% calc(100% - 4px),calc(100% - 4px) calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,4px calc(100% - 4px),0 calc(100% - 4px))" }}
                        onClick={() => navigate(-1)}>◀</button>
                    <div className="font-[family-name:var(--font-press-start-2p)] text-[7px] text-slate-400 opacity-40 text-center leading-loose hidden sm:block" style={{ fontFamily: '"Press Start 2P", monospace' }}>
                        ← → NAVIGATE<br />SCROLL TO EXPLORE
                    </div>
                    <button className="w-12 h-12 flex items-center justify-center bg-[#0f0f23]/85 border-2 border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80] hover:text-[#1a1a2e] active:scale-95 transition-all cursor-pointer font-[family-name:var(--font-press-start-2p)] text-base"
                        style={{ fontFamily: '"Press Start 2P", monospace', clipPath: "polygon(0 4px,4px 4px,4px 0,calc(100% - 4px) 0,calc(100% - 4px) 4px,100% 4px,100% calc(100% - 4px),calc(100% - 4px) calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,4px calc(100% - 4px),0 calc(100% - 4px))" }}
                        onClick={() => navigate(1)}>▶</button>
                </div>

            </div>
        </div>
    );
}
