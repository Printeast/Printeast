"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

interface CanvasProps {
    setCanvas: (canvas: fabric.Canvas) => void;
    setActiveObject: (obj: fabric.Object | null) => void;
    productImage?: string | undefined;
}

export function Canvas({ setCanvas, setActiveObject, productImage }: CanvasProps) {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    const canvasRef = useRef<fabric.Canvas | null>(null);

    // 1. Initialize Canvas (Only once)
    useEffect(() => {
        if (!canvasEl.current || !containerRef.current) return;

        const canvas = new fabric.Canvas(canvasEl.current, {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            backgroundColor: "transparent",
            selection: true,
            preserveObjectStacking: true,
            renderOnAddRemove: false, // For performance
            skipTargetFind: false,
        });

        canvasRef.current = canvas;
        setCanvas(canvas);

        // Custom selection style - premium Kittl-like controls
        fabric.Object.prototype.set({
            transparentCorners: false,
            cornerColor: '#ffffff',
            cornerStrokeColor: '#3b82f6',
            cornerSize: 10,
            cornerStyle: 'circle',
            borderColor: '#3b82f6',
            borderDashArray: [4, 4],
            borderScaleFactor: 1.5,
            padding: 8,
        });

        // Interaction State
        let isDragging = false;
        let lastPosX = 0;
        let lastPosY = 0;

        // Panning Logic
        canvas.on('mouse:down', function (opt) {
            const evt = opt.e as any;
            // Pan if: Alt key is pressed OR Spacebar is held OR Clicking on empty space (no target)
            if (evt.altKey || (evt as any).__spacePressed || !opt.target || opt.target === canvas.backgroundImage) {
                isDragging = true;
                canvas.selection = false;
                lastPosX = evt.clientX || evt.touches?.[0]?.clientX;
                lastPosY = evt.clientY || evt.touches?.[0]?.clientY;
                canvas.defaultCursor = 'grabbing';
            }
        });

        canvas.on('mouse:move', function (opt) {
            if (isDragging) {
                const e = opt.e as any;
                const vpt = canvas.viewportTransform;
                if (!vpt) return;

                const clientX = e.clientX || e.touches?.[0]?.clientX;
                const clientY = e.clientY || e.touches?.[0]?.clientY;

                vpt[4] += clientX - lastPosX;
                vpt[5] += clientY - lastPosY;
                canvas.requestRenderAll();
                lastPosX = clientX;
                lastPosY = clientY;
            }
        });

        canvas.on('mouse:up', function () {
            if (isDragging) {
                canvas.setViewportTransform(canvas.viewportTransform!); // commit changes
                isDragging = false;
                canvas.selection = true;
                canvas.defaultCursor = 'default';
            }
        });

        // Zooming Logic
        canvas.on('mouse:wheel', function (opt) {
            const delta = opt.e.deltaY;
            let zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;

            // Limit zoom
            if (zoom > 5) zoom = 5;
            if (zoom < 0.1) zoom = 0.1;

            canvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        // Event Listeners for Object Selection
        const handleSelection = (e: any) => {
            const selected = e.selected?.[0] || null;
            setActiveObject(selected);
        };

        const handleCleared = () => {
            setActiveObject(null);
        };

        const handleModified = () => {
            canvas.requestRenderAll();
        };

        canvas.on("selection:created", handleSelection);
        canvas.on("selection:updated", handleSelection);
        canvas.on("selection:cleared", handleCleared);
        canvas.on("object:modified", handleModified);
        canvas.on("object:added", handleModified);

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeObj = canvas.getActiveObject();

            // Spacebar for panning
            if (e.code === 'Space') {
                (e as any).__spacePressed = true;
                canvas.defaultCursor = 'grab';
            }

            if (!activeObj) return;

            // Delete object
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if ((activeObj as any).isEditing) return;
                canvas.remove(activeObj);
                canvas.requestRenderAll();
            }

            // Nudge
            const nudgeAmount = e.shiftKey ? 10 : 1;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                switch (e.key) {
                    case 'ArrowUp': activeObj.set('top', (activeObj.top || 0) - nudgeAmount); break;
                    case 'ArrowDown': activeObj.set('top', (activeObj.top || 0) + nudgeAmount); break;
                    case 'ArrowLeft': activeObj.set('left', (activeObj.left || 0) - nudgeAmount); break;
                    case 'ArrowRight': activeObj.set('left', (activeObj.left || 0) + nudgeAmount); break;
                }
                canvas.requestRenderAll();
                canvas.fire('object:modified', { target: activeObj });
            }

            // Duplicate (Ctrl+D)
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                activeObj.clone().then((cloned: fabric.Object) => {
                    cloned.set({
                        left: (activeObj.left || 0) + 20,
                        top: (activeObj.top || 0) + 20,
                    });
                    canvas.add(cloned);
                    canvas.setActiveObject(cloned);
                    canvas.requestRenderAll();
                    canvas.fire('object:modified', { target: cloned });
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                (e as any).__spacePressed = false;
                canvas.defaultCursor = 'default';
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            canvas.dispose();
            canvasRef.current = null;
        };
    }, [setCanvas, setActiveObject]);

    const printAreaRef = useRef<fabric.Rect | null>(null);

    // 2. Handle Resize
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                canvas.setDimensions({ width: clientWidth, height: clientHeight });

                // Keep background image centered and scaled
                if (canvas.backgroundImage instanceof fabric.Image) {
                    const img = canvas.backgroundImage;
                    const scale = Math.min(clientWidth / (img.width || 1), clientHeight / (img.height || 1)) * 0.7;
                    img.set({
                        scaleX: scale,
                        scaleY: scale,
                        left: clientWidth / 2,
                        top: clientHeight / 2,
                    });

                    // Update Print Area
                    if (printAreaRef.current) {
                        const area = printAreaRef.current;
                        // For a standard t-shirt, print area is roughly 35% width, 50% height of the image
                        const areaW = img.getScaledWidth() * 0.35;
                        const areaH = img.getScaledHeight() * 0.5;
                        area.set({
                            width: areaW,
                            height: areaH,
                            left: clientWidth / 2,
                            top: clientHeight * 0.48, // Slightly center-high for chest placement
                        });
                        area.setCoords();
                    }
                }
                canvas.requestRenderAll();
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // 3. Update Background Image (When prop changes)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const productUrl = productImage || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80";

        setIsLoading(true);
        fabric.Image.fromURL(productUrl, { crossOrigin: 'anonymous' }).then((img) => {
            const width = canvas.width || (containerRef.current?.clientWidth || 800);
            const height = canvas.height || (containerRef.current?.clientHeight || 800);

            // Scale to fit the viewable area nicely
            const scale = Math.min(width / (img.width || 1), height / (img.height || 1)) * 0.7;
            img.scale(scale);
            img.set({
                left: width / 2,
                top: height / 2,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
                hoverCursor: 'default',
            });

            canvas.backgroundImage = img;

            // Initialize or Re-center Print Area
            if (printAreaRef.current) {
                canvas.remove(printAreaRef.current);
            }

            // Use a consistent 3:4 aspect ratio (12"x16") for the print area
            // Making it MUCH larger to cover almost the entire garment
            const imgScaledHeight = img.getScaledHeight();
            const areaH = imgScaledHeight * 0.95; // 95% of shirt height
            const areaW = areaH * 0.7; // 3:4 aspect ratio

            const printArea = new fabric.Rect({
                width: areaW,
                height: areaH,
                left: width / 2,
                top: height / 2,
                originX: 'center',
                originY: 'center',
                fill: 'rgba(0,0,0,0.01)',
                stroke: '#cbd5e1',
                strokeWidth: 1,
                strokeDashArray: [8, 4],
                selectable: false,
                evented: false,
                rx: 0,
                ry: 0,
            });

            // Identify this as the print area for the export logic
            (printArea as any).data = { type: 'printArea' };

            // Add a Label for the print area
            const label = new fabric.IText('Center Chest\n12" x 16"', {
                fontSize: 12,
                fontFamily: 'Inter',
                fontWeight: 'bold',
                fill: '#94a3b8',
                textAlign: 'center',
                left: width / 2,
                top: height * 0.48 - 40,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            });
            (label as any).data = { type: 'printLabel' };

            canvas.add(printArea);
            canvas.add(label);
            canvas.sendObjectToBack(label);
            canvas.sendObjectToBack(printArea);

            printAreaRef.current = printArea;

            canvas.requestRenderAll();
            setIsLoading(false);
        }).catch((err) => {
            console.error("Failed to load product image:", err);
            setIsLoading(false);
        });
    }, [productImage]);


    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden"
        >
            {isLoading && (
                <div className="absolute inset-0 bg-transparent flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-slate-500">Loading workspace...</span>
                    </div>
                </div>
            )}
            <canvas ref={canvasEl} />
        </div>
    );
}
