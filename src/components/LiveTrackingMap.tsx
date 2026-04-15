"use client";

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Store, MapPin, Navigation, Bike, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue in Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons using emoji
const createCustomIcon = (emoji: string, color: string) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background: ${color};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">${emoji}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

const restaurantIcon = createCustomIcon('🍽️', '#f97316');
const deliveryIcon = createCustomIcon('🏠', '#3b82f6');
const driverIcon = createCustomIcon('🛵', '#10b981');

interface Location {
    lat: number;
    lng: number;
}

interface TrackingData {
    orderId: string;
    restaurantName: string;
    restaurantLocation: Location;
    deliveryLocation: Location;
    driverLocation?: Location;
    status: string;
    deliveryStatus?: string;
    estimatedTime?: string;
    driverName?: string;
    driverPhone?: string;
}

interface LiveTrackingMapProps {
    trackingData: TrackingData;
    onClose?: () => void;
}

// Map bounds component
function MapBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, positions]);
    
    return null;
}

export default function LiveTrackingMap({ trackingData, onClose }: LiveTrackingMapProps) {
    const [driverPosition, setDriverPosition] = useState<Location>(
        trackingData.driverLocation || trackingData.restaurantLocation
    );
    const [progress, setProgress] = useState(0);
    const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    // Generate route points (simulated path between restaurant and delivery)
    useEffect(() => {
        const start = trackingData.restaurantLocation;
        const end = trackingData.deliveryLocation;
        
        // Create intermediate points for a curved route
        const points: [number, number][] = [];
        const steps = 20;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Add some randomness to make it look like a real road
            const offset = Math.sin(t * Math.PI) * 0.001;
            points.push([
                start.lat + (end.lat - start.lat) * t + offset,
                start.lng + (end.lng - start.lng) * t + offset * 0.5
            ]);
        }
        
        setRoutePoints(points);
    }, [trackingData]);

    // Animate driver along the route
    useEffect(() => {
        if (routePoints.length === 0 || trackingData.status === 'Delivered') return;

        let currentIndex = 0;
        
        animationRef.current = setInterval(() => {
            if (currentIndex >= routePoints.length - 1) {
                if (animationRef.current) clearInterval(animationRef.current);
                return;
            }

            currentIndex++;
            const point = routePoints[currentIndex];
            
            setDriverPosition({
                lat: point[0],
                lng: point[1]
            });
            
            setProgress((currentIndex / (routePoints.length - 1)) * 100);
        }, 2000);

        return () => {
            if (animationRef.current) clearInterval(animationRef.current);
        };
    }, [routePoints, trackingData.status]);

    const getStatusMessage = () => {
        switch (trackingData.deliveryStatus) {
            case 'Accepted by Driver':
                return 'Driver is heading to the restaurant';
            case 'Arrived at Restaurant':
                return 'Driver has arrived at the restaurant';
            case 'Order Picked Up':
                return 'Order picked up! On the way to you';
            case 'Arrived at Location':
                return 'Driver has arrived at your location';
            case 'Delivered':
                return 'Order delivered successfully!';
            default:
                return trackingData.status;
        }
    };

    const mapCenter: [number, number] = [
        (trackingData.restaurantLocation.lat + trackingData.deliveryLocation.lat) / 2,
        (trackingData.restaurantLocation.lng + trackingData.deliveryLocation.lng) / 2
    ];

    const positions: [number, number][] = [
        [trackingData.restaurantLocation.lat, trackingData.restaurantLocation.lng],
        [trackingData.deliveryLocation.lat, trackingData.deliveryLocation.lng]
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Navigation size={20} />
                            Live Order Tracking
                        </h3>
                        <p className="text-emerald-100 text-sm mt-1">Order #{trackingData.orderId.slice(-6).toUpperCase()}</p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="text-white/80 hover:text-white">
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                        <Bike size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-900">{getStatusMessage()}</p>
                        <div className="flex items-center gap-4 mt-1">
                            {trackingData.estimatedTime && (
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <Clock size={14} />
                                    ETA: {trackingData.estimatedTime}
                                </span>
                            )}
                            {trackingData.driverName && (
                                <span className="text-sm text-gray-600">
                                    Driver: {trackingData.driverName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-emerald-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(progress)}% completed</p>
                </div>
            </div>

            {/* Map */}
            <div className="relative" style={{ height: '400px' }}>
                <MapContainer
                    center={mapCenter}
                    zoom={14}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Restaurant Marker */}
                    <Marker 
                        position={[trackingData.restaurantLocation.lat, trackingData.restaurantLocation.lng]}
                        icon={restaurantIcon}
                    >
                        <Popup>
                            <div className="p-2">
                                <p className="font-bold text-orange-600">🍽️ Restaurant</p>
                                <p className="text-gray-800">{trackingData.restaurantName}</p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Delivery Location Marker */}
                    <Marker 
                        position={[trackingData.deliveryLocation.lat, trackingData.deliveryLocation.lng]}
                        icon={deliveryIcon}
                    >
                        <Popup>
                            <div className="p-2">
                                <p className="font-bold text-blue-600">🏠 Delivery Location</p>
                                <p className="text-gray-800">Your Address</p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Driver Marker */}
                    {trackingData.status !== 'Delivered' && (
                        <Marker 
                            position={[driverPosition.lat, driverPosition.lng]}
                            icon={driverIcon}
                        >
                            <Popup>
                                <div className="p-2">
                                    <p className="font-bold text-emerald-600">🛵 Driver Location</p>
                                    <p className="text-gray-800">{trackingData.driverName || 'Delivery Partner'}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Route Line */}
                    {routePoints.length > 0 && (
                        <Polyline 
                            positions={routePoints}
                            color="#10b981"
                            weight={5}
                            opacity={0.8}
                            dashArray="10, 10"
                        />
                    )}

                    <MapBounds positions={positions} />
                </MapContainer>
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <Store size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">From</p>
                            <p className="font-medium text-gray-900 text-sm">{trackingData.restaurantName}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <MapPin size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">To</p>
                            <p className="font-medium text-gray-900 text-sm">Your Location</p>
                        </div>
                    </div>
                </div>
                
                {trackingData.driverPhone && (
                    <a 
                        href={`tel:${trackingData.driverPhone}`}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                        <Phone size={18} />
                        Call Driver
                    </a>
                )}
            </div>
        </div>
    );
}
