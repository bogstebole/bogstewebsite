"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Win95Button } from "./win95-button";
import GlassButton from "./Glassmorphic Button Breakdown";
import styles from "./project-detail-window.module.css";

const USELESS_NOTES_ASSETS = [
    { type: "video" as const, src: "/assets/Useless Notes/Onboarding.mp4" },
    { type: "video" as const, src: "/assets/Useless Notes/Da bomb.MP4" },
    { type: "video" as const, src: "/assets/Useless Notes/Sharing.mp4" },
    { type: "video" as const, src: "/assets/Useless Notes/card burn.MP4" },
    { type: "image" as const, src: "/assets/Useless Notes/1Uslsnts.png" },
    { type: "image" as const, src: "/assets/Useless Notes/2Uslsnts.png" },
    { type: "image" as const, src: "/assets/Useless Notes/3Uslsnts.png" },
    { type: "image" as const, src: "/assets/Useless Notes/4Uslsnts.png" },
    { type: "image" as const, src: "/assets/Useless Notes/5Uslsnts.png" },
];

/** Per-project metadata for the detail window */
export interface ProjectData {
    key: string;
    color: string;
    label: string;
    videoSrc?: string;
    tags?: string;
    description?: string;
    downloadUrl?: string;
}

interface ProjectDetailWindowProps {
    project: ProjectData | null;
    isOpen: boolean;
    onClose: () => void;
    /** Framer Motion layoutId for seamless icon→window transition */
    layoutId?: string;
    /** Origin rect for initial animation position */
    originRect?: { x: number; y: number };
}

export function ProjectDetailWindow({
    project,
    isOpen,
    onClose,
    layoutId,
    originRect,
}: ProjectDetailWindowProps) {
    if (!project) return null;

    const isUselessNote = project.key === "uselessNote";

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className={`${styles.overlay} ${isUselessNote ? styles.overlayUseless : styles.overlayStandard}`}
                >
                    {/* Backdrop — no blur, just a dark scrim */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.backdrop}
                        onClick={onClose}
                    />

                    {/* Window Content Logic Split */}
                    {isUselessNote ? (
                        <UselessNoteWindow
                            project={project}
                            onClose={onClose}
                            layoutId={layoutId}
                            originRect={originRect}
                            isOpen={isOpen}
                        />
                    ) : (
                        <StandardProjectWindow
                            project={project}
                            onClose={onClose}
                            layoutId={layoutId}
                            originRect={originRect}
                            isOpen={isOpen}
                        />
                    )}
                </div>
            )}
        </AnimatePresence>
    );
}

// ---- Sub-components to isolate hooks and logic ----

function UselessNoteWindow({ project, onClose, layoutId }: ProjectDetailWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({ container: scrollRef });

    // Map scroll progress (0px -> 300px) to a normalized 0→1 progress
    const scrollProgress = useTransform(scrollY, [0, 300], [0, 1]);

    // Width: 800px -> window width (numeric interpolation, not px↔vw)
    const width = useTransform(scrollProgress, (p) => {
        if (typeof window === "undefined") return "800px";
        const start = 800;
        const end = window.innerWidth;
        return `${start + (end - start) * p}px`;
    });

    // Height: 80vh -> 90vh
    const height = useTransform(scrollProgress, (p) => {
        if (typeof window === "undefined") return "80vh";
        const start = window.innerHeight * 0.8;
        const end = window.innerHeight * 0.9;
        return `${start + (end - start) * p}px`;
    });

    // Header blur — only activates once user scrolls (scroll > 0)
    const headerBgOpacity = useTransform(scrollY, [0, 100], [0, 0.85]);
    const headerBlur = useTransform(scrollY, [0, 100], [0, 12]);
    const headerBg = useTransform(headerBgOpacity, (v) =>
        v <= 0.01 ? "transparent" : `rgba(0, 139, 255, ${v})`
    );
    const headerBackdropFilter = useTransform(headerBlur, (v) =>
        v <= 0.1 ? "none" : `blur(${v}px)`
    );

    return (
        <motion.div
            layoutId={layoutId}
            initial={{
                opacity: 0,
                y: 200,
            }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 1,
                },
            }}
            style={{ width, height, maxWidth: "100vw" }}
            exit={{
                opacity: 0,
                y: 200,
                transition: { duration: 0.3, ease: "easeIn" },
            }}
            className={styles.uselessWindow}
        >


            {/* Sticky header — transparent at rest, blurs on scroll */}
            <motion.div
                className={styles.uselessHeader}
                style={{
                    background: headerBg,
                    backdropFilter: headerBackdropFilter,
                    WebkitBackdropFilter: headerBackdropFilter,
                }}
            >
                {/* Icon */}
                <div
                    className={styles.appIcon}
                    style={{ background: `${project?.color}dd` }}
                >
                    {project?.videoSrc && (
                        <video
                            src={project.videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    )}
                </div>

                <Win95Button
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    square
                >
                    ✕
                </Win95Button>
            </motion.div>

            {/* Scrollable content */}
            <div ref={scrollRef} className={styles.scrollContainer}>
                <div className={styles.contentInner}>
                    <ProjectContent project={project} isUselessNote={true} />
                </div>
            </div>
        </motion.div>
    );
}

function StandardProjectWindow({ project, onClose, layoutId, originRect }: ProjectDetailWindowProps) {
    return (
        <motion.div
            layoutId={layoutId}
            initial={{
                scale: 0.1,
                opacity: 0,
                x: originRect?.x ?? 0,
                y: originRect?.y ?? 0,
                borderRadius: 12,
            }}
            animate={{
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
                width: "100%",
                height: "auto",
                borderRadius: 24,
                transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 1,
                },
            }}
            exit={{
                scale: 0.1,
                opacity: 0,
                transition: { duration: 0.3, ease: "easeIn" },
            }}
            className={styles.standardWindow}
            style={{ background: project?.color }}
        >
            {/* Header: icon + close */}
            <div className={styles.standardHeader}>
                <div
                    className={styles.appIcon}
                    style={{ background: `${project?.color}dd` }}
                >
                    {project?.videoSrc && (
                        <video
                            src={project.videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    )}
                </div>

                <Win95Button onClick={onClose} square>
                    ✕
                </Win95Button>
            </div>

            {/* Content */}
            <div className={styles.standardContent}>
                <ProjectContent project={project} isUselessNote={false} />
            </div>

            {/* Standard Screenshots */}
            {project?.videoSrc && (
                <div className={styles.standardScreenshots}>
                    <div className={styles.screenshotsRow}>
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={styles.screenshotCard}>
                                <video
                                    src={project.videoSrc}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{
                                        objectPosition: `${50 + (i - 1) * 15}% center`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

function ProjectContent({ project, isUselessNote }: { project: ProjectData | null, isUselessNote: boolean }) {
    if (!project) return null;

    return (
        <>
            <div className={styles.contentSection}>
                {/* Tags */}
                {project.tags && (
                    <p className={styles.tags}>{project.tags}</p>
                )}

                {/* Title + Description row */}
                <div className={styles.titleRow}>
                    <div className={styles.titleColumn}>
                        <h2 className={styles.title}>
                            {project.label}
                        </h2>

                        {project.downloadUrl && (
                            <div className={styles.downloadWrap}>
                                <a
                                    href={project.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <GlassButton
                                        iconLeft={
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                width="16"
                                                height="16"
                                            >
                                                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                                            </svg>
                                        }
                                    >
                                        Download
                                    </GlassButton>
                                </a>
                            </div>
                        )}
                    </div>

                    {project.description && (
                        <p className={styles.description}>
                            {project.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Masonry grid for Useless Notes */}
            {isUselessNote && project.videoSrc && (
                <div className={styles.masonryGrid}>
                    {USELESS_NOTES_ASSETS.map((asset, i) => (
                        <div key={i} className={styles.masonryItem}>
                            {asset.type === "image" ? (
                                <Image
                                    src={encodeURI(asset.src)}
                                    alt={`Useless Notes screenshot ${i + 1}`}
                                    width={300}
                                    height={650}
                                    sizes="(max-width: 896px) 33vw, 250px"
                                />
                            ) : (
                                <video
                                    src={encodeURI(asset.src)}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            )}
                        </div>
                    ))}
                    <div className={styles.masonrySpacer} />
                </div>
            )}
        </>
    );
}
