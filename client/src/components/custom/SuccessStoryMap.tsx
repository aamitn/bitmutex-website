"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster"; // This is correct
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import { ZoomControl } from "react-leaflet";
import { Tooltip } from "react-leaflet";


// Custom marker icon
const customIcon = L.icon({
  iconUrl: "/map-marker.png",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
  shadowUrl: "/shadow.png",
  shadowSize: [40, 40],
});

// Function to create a custom cluster icon
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = "small";
  let color = "#007bff"; // Default: Blue

  if (count > 50) {
    size = "large";
    color = "#dc3545"; // Red for large clusters
  } else if (count > 20) {
    size = "medium";
    color = "#fd7e14"; // Orange for medium clusters
  }

  return L.divIcon({
    html: `
      <div class="cluster-${size}" style="
        background: ${color};
        width: ${size === "large" ? 50 : size === "medium" ? 40 : 30}px;
        height: ${size === "large" ? 50 : size === "medium" ? 40 : 30}px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: white;
        font-weight: bold;
        font-size: ${size === "large" ? "16px" : size === "medium" ? "14px" : "12px"};
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      ">
        ${count}
      </div>
    `,
    className: "custom-cluster-icon",
    iconSize: [size === "large" ? 50 : size === "medium" ? 40 : 30, size === "large" ? 50 : size === "medium" ? 40 : 30],
  });
};

const defaultPosition: [number, number] = [20, 77]; // India-centered

export default function SuccessStoryMap({ markers }: { markers: { lat: number; lon: number; name: string }[] }) {
  return (
    <div className="w-full h-96 mb-8">
      <MapContainer center={defaultPosition} zoom={4} className="w-full h-full rounded-md shadow-lg" scrollWheelZoom={true} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup 
          iconCreateFunction={createClusterCustomIcon} 
          spiderfyOnMaxZoom={true} // Disable spiderfying on max zoom (you can enable it if needed)
          maxClusterRadius={40} // Set the max cluster radius in pixels (distance for clustering before de-clustering)
          showCoverageOnHover={true} // Hide coverage on hover
          removeOutsideVisibleBounds={true} // Automatically remove markers outside of visible bounds
          animate={true} // Enabling animation on declusterization
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lon]}
              icon={customIcon}
              eventHandlers={{
                click: (e) => {
                  e.target.openPopup(); // Open popup on marker click
                  e.target.setIcon(L.icon({
                    iconUrl: "/map-marker.svg",
                    iconSize: [40, 52], // Larger size when clicked
                    iconAnchor: [20, 52],
                  }));
                },
                mouseout: (e) => {
                  e.target.setIcon(customIcon); // Revert to original icon on mouseout
                }
              }}
            >
                <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <span>{marker.name}</span>
              </Tooltip>
              <Popup>
                <strong>{marker.name}</strong> <br />
                Lat: {marker.lat}, Lon: {marker.lon}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <ZoomControl position="bottomleft" />
      </MapContainer>
    </div>
  );
}
