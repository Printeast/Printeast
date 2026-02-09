"use client";

import { useState, useCallback, useEffect } from "react";
import * as fabric from "fabric"; // v6 import style, adjust if v5

export function useCanvas() {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

    // Helper to add text
    const addText = useCallback((text: string, options: any = {}) => {
        if (!canvas) return;
        const textObj = new fabric.IText(text, {
            left: 100,
            top: 100,
            fontFamily: "Inter",
            fill: "#000000",
            fontSize: 40,
            ...options
        });
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.requestRenderAll();
    }, [canvas]);

    // Helper to add image
    const addImage = useCallback((url: string) => {
        if (!canvas) return;
        fabric.Image.fromURL(url).then((img) => {
            // Scale down if too big
            if (img.width && img.width > 300) {
                img.scaleToWidth(300);
            }
            img.set({
                left: 150,
                top: 150
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
        });
    }, [canvas]);


    // Helper to customize Fabric defaults for a premium feel
    const customizeFabricDefaults = useCallback(() => {
        fabric.Object.prototype.set({
            transparentCorners: false,
            cornerColor: '#ffffff',
            cornerStrokeColor: '#2563eb', // Blue-600
            borderColor: '#2563eb',
            cornerSize: 10,
            padding: 5,
            cornerStyle: 'circle',
            borderDashArray: [4, 4]
        });
    }, []);

    // Snapping Logic
    const handleObjectMoving = useCallback((e: any) => {
        if (!canvas) return;
        const obj = e.target;
        const canvasWidth = canvas.width || 0;
        const canvasHeight = canvas.height || 0;

        // Snap to Center Horizontal
        if (Math.abs(obj.left - canvasWidth / 2) < 10) {
            obj.set({ left: canvasWidth / 2 });
            // Ideally visual guide would appear here
        }
        // Snap to Center Vertical
        if (Math.abs(obj.top - canvasHeight / 2) < 10) {
            obj.set({ top: canvasHeight / 2 });
        }
    }, [canvas]);

    useEffect(() => {
        if (!canvas) return;

        customizeFabricDefaults();

        // Attach Snapping
        canvas.on('object:moving', handleObjectMoving);

        return () => {
            canvas.off('object:moving', handleObjectMoving);
        }
    }, [canvas, customizeFabricDefaults, handleObjectMoving]);

    const deleteObject = useCallback(() => {
        if (!canvas || !activeObject) return;
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        setActiveObject(null); // Clear selection state
    }, [canvas, activeObject]);

    const moveObject = useCallback((direction: "up" | "down" | "top" | "bottom") => {
        if (!canvas || !activeObject) return;

        // Fabric 6+ uses canvas methods for z-index
        switch (direction) {
            case "up":
                canvas.bringObjectForward(activeObject);
                break;
            case "down":
                canvas.sendObjectBackwards(activeObject);
                break;
            case "top":
                canvas.bringObjectToFront(activeObject);
                break;
            case "bottom":
                canvas.sendObjectToBack(activeObject);
                break;
        }
        canvas.requestRenderAll();
    }, [canvas, activeObject]);

    return {
        canvas,
        setCanvas,
        activeObject,
        setActiveObject,
        addText,
        addImage,
        deleteObject,
        moveObject
    };
}
