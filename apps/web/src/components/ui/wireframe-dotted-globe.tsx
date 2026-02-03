"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

// Define types for GeoJSON
interface GeoGeometry {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
}

interface GeoFeature {
    type: "Feature";
    geometry: GeoGeometry;
    properties?: {
        featurecla?: string;
        [key: string]: unknown;
    };
}

interface GeoFeatureCollection {
    type: "FeatureCollection";
    features: GeoFeature[];
}

interface RotatingEarthProps {
    width?: number
    height?: number
    className?: string
    onHotspotUpdate?: (pos: { x: number; y: number; visible: boolean } | null) => void // Deprecated
    onHotspotsUpdate?: (hotspots: { id: string; x: number; y: number; visible: boolean; name: string }[]) => void
    isInView?: boolean
}

export default function RotatingEarth({
    width = 800,
    height = 600,
    className = "",
    onHotspotUpdate,
    onHotspotsUpdate,
    isInView = true
}: RotatingEarthProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isInViewRef = useRef(isInView)

    useEffect(() => {
        isInViewRef.current = isInView
    }, [isInView])

    // Removed unused isLoading
    const [error, setError] = useState<string | null>(null)

    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        if (!context) return

        // Set up responsive dimensions - force a square aspect ratio to prevent "squeezing"
        const size = Math.min(
            Math.min(width, window.innerWidth - 40),
            Math.min(height, window.innerHeight - 100)
        )
        const radius = size / 2.5

        const dpr = window.devicePixelRatio || 1
        canvas.width = size * dpr
        canvas.height = size * dpr
        context.scale(dpr, dpr)

        // Create projection and path generator for Canvas
        const projection = d3
            .geoOrthographic()
            .scale(radius)
            .translate([size / 2, size / 2])
            .clipAngle(90)

        const path = d3.geoPath().projection(projection).context(context)

        const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
            const [x, y] = point
            let inside = false

            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const pi = polygon[i]
                const pj = polygon[j]

                if (!pi || !pj) continue;

                const [xi, yi] = pi as [number, number]
                const [xj, yj] = pj as [number, number]

                if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
                    inside = !inside
                }
            }

            return inside
        }

        const pointInFeature = (point: [number, number], feature: GeoFeature): boolean => {
            const geometry = feature.geometry

            if (geometry.type === "Polygon") {
                const coordinates = geometry.coordinates as number[][][]
                // Check if point is in outer ring
                if (!coordinates[0] || !pointInPolygon(point, coordinates[0])) {
                    return false
                }
                // Check if point is in any hole (inner rings)
                for (let i = 1; i < coordinates.length; i++) {
                    const hole = coordinates[i]
                    if (hole && pointInPolygon(point, hole)) {
                        return false // Point is in a hole
                    }
                }
                return true
            } else if (geometry.type === "MultiPolygon") {
                const coordinates = geometry.coordinates as number[][][][]
                // Check each polygon in the MultiPolygon
                for (const polygon of coordinates) {
                    // Check if point is in outer ring
                    if (polygon[0] && pointInPolygon(point, polygon[0])) {
                        // Check if point is in any hole
                        let inHole = false
                        for (let i = 1; i < polygon.length; i++) {
                            const hole = polygon[i]
                            if (hole && pointInPolygon(point, hole)) {
                                inHole = true
                                break
                            }
                        }
                        if (!inHole) {
                            return true
                        }
                    }
                }
                return false
            }

            return false
        }

        const generateDotsInPolygon = (feature: GeoFeature, dotSpacing = 16) => {
            const dots: [number, number][] = []
            const bounds = d3.geoBounds(feature as any)
            const [[minLng, minLat], [maxLng, maxLat]] = bounds

            const stepSize = dotSpacing * 0.08
            let pointsGenerated = 0

            for (let lng = minLng; lng <= maxLng; lng += stepSize) {
                for (let lat = minLat; lat <= maxLat; lat += stepSize) {
                    const point: [number, number] = [lng, lat]
                    if (pointInFeature(point, feature)) {
                        dots.push(point)
                        pointsGenerated++
                    }
                }
            }

            return dots
        }

        interface DotData {
            lng: number
            lat: number
            visible: boolean
        }

        const allDots: DotData[] = []
        let landFeatures: GeoFeatureCollection

        // Impact animation
        interface Impact {
            coordinate: [number, number]
            age: number // 0 to 1
            maxAge: number
        }

        const impacts: Impact[] = []

        // Delivery routes for shooting star animation
        interface DeliveryRoute {
            from: [number, number]
            to: [number, number]
            progress: number
            speed: number
            size: number
            trailLength: number
        }

        const HUBS: [number, number][] = [
            [77.1025, 28.7041],  // New Delhi, IN (0)
            [72.8777, 19.0760],  // Mumbai, IN (1)
            [77.5946, 12.9716],  // Bangalore, IN (2)
            [80.2707, 13.0827],  // Chennai, IN (3)
            [-98, 39],           // USA Central (4)
            [-74, 40],           // USA East - NY (5)
            [-122, 37],          // USA West - SF (6)
            [0, 51],             // UK - London (7)
            [13, 52],            // Germany - Berlin (8)
            [2, 48],             // France - Paris (9)
            [116, 39],           // China - Beijing (10)
            [139, 35],           // Japan - Tokyo (11)
            [103, 1],            // Singapore (12)
            [151, -33],          // Australia - Sydney (13)
            [55, 25],            // UAE - Dubai (14)
            [-46, -23],          // Brazil - São Paulo (15)
            [-79, 43]            // Canada - Toronto (16)
        ]

        // Function to get a random hub (truly global now)
        const getRandomHub = (): [number, number] => {
            // 40% chance to pick an Indian hub as origin for more local activity
            if (Math.random() < 0.4) {
                return HUBS[Math.floor(Math.random() * 4)] as [number, number]
            }
            return HUBS[Math.floor(Math.random() * HUBS.length)] as [number, number]
        }

        // Initial routes
        // Initial routes - updated in render loop now, but initialized with random hubs
        const deliveryRoutes: DeliveryRoute[] = Array.from({ length: 18 }).map(() => ({
            from: getRandomHub(),
            // Initial to doesn't matter much as it resets quickly, but safe default
            to: HUBS[Math.floor(Math.random() * HUBS.length)] as [number, number],
            progress: Math.random(),
            speed: 0.005 + Math.random() * 0.02,
            size: 1.5 + Math.random() * 2,
            trailLength: 0.1 + Math.random() * 0.2
        }))

        const render = () => {
            // Clear canvas
            context.clearRect(0, 0, size, size)

            const currentScale = projection.scale()
            const scaleFactor = currentScale / radius

            // Update Hotspot Coordinates for the card in parent (Fixed to India Hub for tracking)
            // Update Hotspot Coordinates for multiple cards
            if (onHotspotsUpdate) {
                const trackedHubs = [
                    { index: 0, id: 'india', name: 'New Delhi, IN' },
                    { index: 5, id: 'usa', name: 'New York, US' }
                ]

                const hotspots = trackedHubs.map(hubInfo => {
                    const hubCoords = HUBS[hubInfo.index] as [number, number]
                    const projected = projection(hubCoords)
                    const isVisible = projected ? d3.geoDistance(projection.rotate().slice(0, 2).map(d => -d) as [number, number], hubCoords) < Math.PI / 2 : false

                    if (projected) {
                        return {
                            id: hubInfo.id,
                            name: hubInfo.name,
                            x: projected[0],
                            y: projected[1],
                            visible: isVisible
                        }
                    }
                    return null
                }).filter((h): h is { id: string; x: number; y: number; visible: boolean; name: string } => h !== null)

                onHotspotsUpdate(hotspots)
            }

            // Legacy single hotspot support (optional, can remove if parent updated)
            if (onHotspotUpdate) {
                const indiaHub = HUBS[0] as [number, number]
                // ... same logic as before ...
                const projectedPoint = projection(indiaHub)
                const isPointVisible = projectedPoint ? d3.geoDistance(projection.rotate().slice(0, 2).map(d => -d) as [number, number], indiaHub) < Math.PI / 2 : false

                if (projectedPoint) {
                    onHotspotUpdate({
                        x: projectedPoint[0],
                        y: projectedPoint[1],
                        visible: isPointVisible
                    })
                } else {
                    onHotspotUpdate(null)
                }
            }

            // Atmospheric Glow removed per user request for cleaner look
            // Draw ocean (globe background) - Sleek Dark gradient
            context.beginPath()
            context.arc(size / 2, size / 2, currentScale, 0, 2 * Math.PI)
            const oceanGradient = context.createRadialGradient(
                size / 2 - currentScale * 0.3, size / 2 - currentScale * 0.3, currentScale * 0.2,
                size / 2, size / 2, currentScale
            )
            oceanGradient.addColorStop(0, "#1e293b") // Slate 800
            oceanGradient.addColorStop(1, "#020617") // Slate 950
            context.fillStyle = oceanGradient
            context.fill()

            // Subtle rim light
            context.strokeStyle = "rgba(100, 116, 139, 0.4)"
            context.lineWidth = 1 * scaleFactor
            context.stroke()

            if (landFeatures) {


                // Draw land outlines - More visible wireframe
                context.beginPath()
                landFeatures.features.forEach((feature) => {
                    path(feature as any)
                })
                context.strokeStyle = "rgba(226, 232, 240, 0.3)"
                context.lineWidth = 0.8 * scaleFactor
                context.stroke()

                // Draw halftone dots - Tech style
                allDots.forEach((dot) => {
                    const projected = projection([dot.lng, dot.lat])
                    if (
                        projected &&
                        d3.geoDistance(projection.rotate().slice(0, 2).map(d => -d) as [number, number], [dot.lng, dot.lat]) < Math.PI / 2
                    ) {
                        context.beginPath()
                        // context.arc(projected[0], projected[1], 1 * scaleFactor, 0, 2 * Math.PI)
                        // Use small rectangles for "tech" look or just dots
                        context.arc(projected[0], projected[1], 0.8 * scaleFactor, 0, 2 * Math.PI)

                        context.fillStyle = "rgba(96, 165, 250, 0.6)" // Blue-ish dots
                        context.fill()
                    }
                })

                // Draw Radar Pings for all visible HUBS
                HUBS.forEach((hub, index) => {
                    const projectedHub = projection(hub)
                    const isVisible = d3.geoDistance(projection.rotate().slice(0, 2).map(d => -d) as [number, number], hub) < Math.PI / 2

                    if (projectedHub && isVisible) {
                        const time = Date.now() / 1000
                        const pingProgress = (time + (index * 0.15)) % 1
                        const pingRadius = (4 + pingProgress * 25) * scaleFactor

                        context.beginPath()
                        context.arc(projectedHub[0], projectedHub[1], pingRadius, 0, 2 * Math.PI)
                        context.strokeStyle = `rgba(59, 130, 246, ${0.4 * (1 - pingProgress)})` // Blue
                        context.lineWidth = 1.2 * scaleFactor
                        context.stroke()

                        // Small neon core for hubs (Blue -> Cyan/White for contrast)
                        context.beginPath()
                        context.arc(projectedHub[0], projectedHub[1], 2 * scaleFactor, 0, 2 * Math.PI)
                        context.fillStyle = "#38bdf8" // Sky 400
                        context.fill()
                        context.strokeStyle = "white"
                        context.lineWidth = 0.5 * scaleFactor
                        context.stroke()

                        // Hub glow
                        context.shadowBlur = 10 * scaleFactor
                        context.shadowColor = "#3b82f6"
                        context.stroke()
                        context.shadowBlur = 0
                    }
                })

                // Draw impacts - Yellow/Gold
                for (let i = impacts.length - 1; i >= 0; i--) {
                    const impact = impacts[i]
                    if (!impact) continue;

                    impact.age += 0.02
                    if (impact.age >= 1) {
                        impacts.splice(i, 1)
                        continue
                    }

                    const projectedImpact = projection(impact.coordinate)
                    const isVisible = d3.geoDistance(projection.rotate().slice(0, 2).map(d => -d) as [number, number], impact.coordinate) < Math.PI / 2

                    if (projectedImpact && isVisible) {
                        const size = impact.maxAge * Math.sin(impact.age * Math.PI) * scaleFactor
                        const opacity = 1 - impact.age

                        context.beginPath()
                        context.arc(projectedImpact[0], projectedImpact[1], size * 5, 0, 2 * Math.PI)
                        context.strokeStyle = `rgba(253, 224, 71, ${opacity})` // Yellow 300
                        context.lineWidth = 2 * scaleFactor
                        context.stroke()

                        context.beginPath()
                        context.arc(projectedImpact[0], projectedImpact[1], size * 2, 0, 2 * Math.PI)
                        context.fillStyle = `rgba(234, 179, 8, ${opacity * 0.5})` // Yellow 500
                        context.fill()
                    }
                }

                // Draw shooting star delivery routes
                deliveryRoutes.forEach((route) => {
                    const interpolator = d3.geoInterpolate(route.from, route.to)
                    const currentPoint = interpolator(route.progress)
                    const projectedStart = projection(route.from)
                    const projectedEnd = projection(route.to)
                    const projectedCurrent = projection(currentPoint)

                    if (projectedStart && projectedEnd && projectedCurrent) {
                        // Draw faint full route line (only if mostly visible? Nah, looks cool anyway)
                        context.beginPath()
                        const steps = 30
                        let moveToSet = false
                        for (let i = 0; i <= steps; i++) {
                            const t = i / steps
                            const point = interpolator(t)
                            // Check visibility of point
                            if (d3.geoDistance(projection.rotate().slice(0, 2).map(d => -d) as [number, number], point) < Math.PI / 2) {
                                const proj = projection(point)
                                if (proj) {
                                    if (!moveToSet) {
                                        context.moveTo(proj[0], proj[1])
                                        moveToSet = true
                                    } else {
                                        context.lineTo(proj[0], proj[1])
                                    }
                                }
                            } else {
                                moveToSet = false
                            }
                        }

                        context.strokeStyle = "rgba(250, 204, 21, 0.15)" // Yellow trace
                        context.lineWidth = 0.5 * scaleFactor
                        context.stroke()

                        // Draw glowing shooting star (bright trail) - use route's trailLength
                        const startProgress = Math.max(0, route.progress - route.trailLength)

                        // Trail
                        const trailSteps = 20
                        context.beginPath()

                        // We need to calculate points for gradient manually if we want perfect gradient
                        // But simple path with gradient stroke works well enough if segments are small
                        const projTrailStart = projection(interpolator(startProgress))

                        if (projTrailStart && projectedCurrent &&
                            d3.geoDistance(projection.rotate().slice(0, 2).map(d => -d) as [number, number], currentPoint) < Math.PI / 2 + 0.2) // Allow slightly over horizon
                        {
                            context.beginPath()
                            // Move to start of trail
                            if (projTrailStart) context.moveTo(projTrailStart[0], projTrailStart[1])

                            for (let i = 0; i <= trailSteps; i++) {
                                const t = startProgress + (route.progress - startProgress) * (i / trailSteps)
                                const point = interpolator(t)
                                const proj = projection(point)
                                if (proj) {
                                    context.lineTo(proj[0], proj[1])
                                }
                            }

                            // Create gradient for glow effect (Yellow/Gold)
                            const gradient = context.createLinearGradient(
                                projTrailStart ? projTrailStart[0] : projectedCurrent[0],
                                projTrailStart ? projTrailStart[1] : projectedCurrent[1],
                                projectedCurrent[0], projectedCurrent[1]
                            )
                            gradient.addColorStop(0, "rgba(253, 224, 71, 0)")
                            gradient.addColorStop(0.2, "rgba(253, 224, 71, 0.1)")
                            gradient.addColorStop(0.6, "rgba(250, 204, 21, 0.6)")
                            gradient.addColorStop(1, "rgba(234, 179, 8, 1)")

                            context.strokeStyle = gradient
                            context.lineWidth = (route.size * 0.8) * scaleFactor
                            context.lineCap = "round"
                            context.shadowBlur = (route.size * 6) * scaleFactor
                            context.shadowColor = "rgba(250, 204, 21, 0.9)" // Yellow glow
                            context.stroke()
                            context.shadowBlur = 0

                            // Draw bright head particle
                            context.beginPath()
                            // Speed based elongation
                            const dx = projectedCurrent[0] - (projTrailStart ? projTrailStart[0] : projectedCurrent[0])
                            const dy = projectedCurrent[1] - (projTrailStart ? projTrailStart[1] : projectedCurrent[1])
                            const angle = Math.atan2(dy, dx)

                            context.ellipse(projectedCurrent[0], projectedCurrent[1], route.size * scaleFactor, (route.size * 0.6) * scaleFactor, angle, 0, 2 * Math.PI)

                            const headGradient = context.createRadialGradient(
                                projectedCurrent[0], projectedCurrent[1], 0,
                                projectedCurrent[0], projectedCurrent[1], route.size * scaleFactor
                            )
                            headGradient.addColorStop(0, "#ffffff")
                            headGradient.addColorStop(0.2, "#fef08a") // Yellow 200
                            headGradient.addColorStop(0.6, "#facc15") // Yellow 400
                            headGradient.addColorStop(1, "rgba(234, 179, 8, 0)")
                            context.fillStyle = headGradient
                            context.shadowBlur = (route.size * 12) * scaleFactor
                            context.shadowColor = "rgba(250, 204, 21, 1)"
                            context.fill()
                            context.shadowBlur = 0
                        }
                    }

                    // Update progress
                    route.progress += route.speed
                    if (route.progress >= 1) {
                        // Spawn impact
                        impacts.push({
                            coordinate: route.to,
                            age: 0,
                            maxAge: 3 + Math.random() * 2
                        })

                        // Reset to a new random origin (from hubs) and VALID land destination
                        route.progress = 0
                        route.from = getRandomHub()

                        let attempts = 0
                        let foundLand = false
                        let bestTo: [number, number] = route.from

                        // Try to find a valid land destination
                        while (attempts < 15 && !foundLand) {
                            const isLongHaul = Math.random() > 0.4
                            const lngDelta = isLongHaul ? (Math.random() * 300) - 150 : (Math.random() * 80) - 40
                            const latDelta = isLongHaul ? (Math.random() * 140) - 70 : (Math.random() * 50) - 25

                            let newLng = route.from[0] + lngDelta
                            let newLat = route.from[1] + latDelta

                            // Clamp and wrap
                            if (newLng > 180) newLng -= 360
                            if (newLng < -180) newLng += 360

                            // Hard constraint: No Antarctica or extreme Arctic (keep between -55 and 80)
                            newLat = Math.max(-55, Math.min(80, newLat))

                            const candidate: [number, number] = [newLng, newLat]

                            // Check if on land
                            if (landFeatures && landFeatures.features) {
                                // Simple check: iterate features and use pointInFeature
                                const onLand = landFeatures.features.some((f) => pointInFeature(candidate, f))
                                if (onLand) {
                                    bestTo = candidate
                                    foundLand = true
                                }
                            } else {
                                // Fallback if land features not loaded yet
                                bestTo = candidate
                                foundLand = true
                            }
                            attempts++
                        }

                        // If we failed to find land after attempts, pick a random Hub
                        if (!foundLand) {
                            // If originating from India, 70% chance to target another Indian hub
                            const fromIndex = HUBS.indexOf(route.from)
                            if (fromIndex >= 0 && fromIndex < 4 && Math.random() < 0.7) {
                                const indiaIndices = [0, 1, 2, 3].filter(i => i !== fromIndex)
                                const randomIndex = indiaIndices[Math.floor(Math.random() * indiaIndices.length)]
                                if (randomIndex !== undefined) {
                                    bestTo = HUBS[randomIndex] as [number, number]
                                } else {
                                    bestTo = getRandomHub()
                                }
                            } else {
                                bestTo = getRandomHub()
                            }
                        }

                        route.to = bestTo

                        // Recalculate distance for speed
                        const dist = d3.geoDistance(route.from, route.to)
                        route.speed = 0.005 + Math.random() * 0.01 + (1 / (dist * 100 + 1)) * 0.005
                        route.size = 1.2 + Math.random() * 2
                        route.trailLength = 0.1 + Math.random() * 0.15
                    }
                })
            }
        }

        const loadWorldData = async () => {
            try {
                const response = await fetch(
                    "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
                )
                if (!response.ok) throw new Error("Failed to load land data")

                landFeatures = await response.json()

                // Generate dots for all land features
                let totalDots = 0
                landFeatures.features.forEach((feature) => {
                    const dots = generateDotsInPolygon(feature, 30) // Increased spacing for performance
                    dots.forEach(([lng, lat]) => {
                        allDots.push({ lng, lat, visible: true })
                        totalDots++
                    })
                })

                render()
            } catch (err) {
                setError("Failed to load land map data")
            }
        }

        // Set up rotation and interaction
        const rotation: [number, number] = [0, 0]
        let autoRotate = true
        const rotationSpeed = 0.5

        const rotate = () => {
            if (autoRotate && isInViewRef.current) {
                rotation[0] += rotationSpeed
                projection.rotate(rotation)
                render()
            }
        }

        // Auto-rotation timer
        const rotationTimer = d3.timer(rotate)

        const handleMouseDown = (event: MouseEvent) => {
            autoRotate = false
            const startX = event.clientX
            const startY = event.clientY
            const startRotation: [number, number] = [rotation[0], rotation[1]]

            const handleMouseMove = (moveEvent: MouseEvent) => {
                const sensitivity = 0.5
                const dx = moveEvent.clientX - startX
                const dy = moveEvent.clientY - startY

                rotation[0] = startRotation[0] + dx * sensitivity
                rotation[1] = startRotation[1] - dy * sensitivity
                rotation[1] = Math.max(-90, Math.min(90, rotation[1]))

                projection.rotate(rotation)
                render()
            }

            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)

                setTimeout(() => {
                    autoRotate = true
                }, 10)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }

        canvas.addEventListener("mousedown", handleMouseDown)
        // Scroll zoom disabled per user request


        // Load the world data
        loadWorldData()

        // Cleanup
        return () => {
            rotationTimer.stop()
            canvas.removeEventListener("mousedown", handleMouseDown)
            // Scroll zoom disabled per user request
        }
    }, [width, height, windowSize])

    if (error) {
        return (
            <div className={`dark flex items-center justify-center bg-card rounded-2xl p-8 ${className}`}>
                <div className="text-center">
                    <p className="dark text-destructive font-semibold mb-2">Error loading Earth visualization</p>
                    <p className="dark text-muted-foreground text-sm">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-auto aspect-square rounded-2xl bg-background dark rounded-full"
                style={{ maxWidth: "100%", aspectRatio: "1/1" }}
            />
            {/* Minimal Label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/20 px-2 py-1 rounded-full pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                Interactive Globe
            </div>
        </div>
    )
}
