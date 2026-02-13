"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
                        onClick={onClose}
                    />

                    {/* Window */}
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
                        className="relative w-full max-w-4xl pointer-events-auto overflow-hidden"
                        style={{
                            background: project.color,
                            maxHeight: "85vh",
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>

                        {/* Content */}
                        <div className="p-8 pb-0">
                            {/* Icon */}
                            <div
                                className="w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg"
                                style={{ background: `${project.color}dd` }}
                            >
                                {project.videoSrc && (
                                    <video
                                        src={project.videoSrc}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Tags */}
                            {project.tags && (
                                <p
                                    className="text-white/60 text-sm mb-2"
                                    style={{
                                        fontFamily: `"SF Mono", "SFMono-Regular", monospace`,
                                    }}
                                >
                                    {project.tags}
                                </p>
                            )}

                            {/* Title + Description row */}
                            <div className="flex gap-8 items-start mb-6">
                                <div className="flex-shrink-0">
                                    <h2
                                        className="text-white font-bold leading-tight"
                                        style={{ fontSize: "2.5rem" }}
                                    >
                                        {project.label}
                                    </h2>

                                    {project.downloadUrl && (
                                        <a
                                            href={project.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors backdrop-blur-sm"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                                            </svg>
                                            Download
                                        </a>
                                    )}
                                </div>

                                {project.description && (
                                    <p
                                        className="text-white/80 text-sm leading-relaxed max-w-md mt-2"
                                        style={{
                                            fontFamily: `"SF Mono", "SFMono-Regular", monospace`,
                                        }}
                                    >
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Screenshots area */}
                        {project.videoSrc && (
                            <div className="px-8 pb-8">
                                <div className="flex gap-4 justify-center">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="flex-1 max-w-[200px] rounded-2xl overflow-hidden shadow-xl bg-black/20"
                                            style={{ aspectRatio: "9/19.5" }}
                                        >
                                            <video
                                                src={project.videoSrc}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="w-full h-full object-cover"
                                                style={{
                                                    // Offset each "screenshot" slightly for variety
                                                    objectPosition: `${50 + (i - 1) * 15}% center`,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
