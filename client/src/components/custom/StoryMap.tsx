import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

interface StoryMapProps {
  location: { lat: string; lon: string; name: string };
}

const StoryMap = ({ location }: StoryMapProps) => {
  // Custom map marker icon
  const customIcon = new Icon({
    iconUrl: "/map-marker.png", // Update this path if needed
    iconSize: [30, 42],
    iconAnchor: [15, 12],
    popupAnchor: [0, -42],
    shadowUrl: "/shadow.png", // Optional shadow for a more professional look
    shadowSize: [60, 40],
  });

  return (
    <MapContainer
      center={[parseFloat(location.lat), parseFloat(location.lon)]} 
      zoom={10}
      className="w-full h-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.bitmutex.com">Bitmutex</a>'
      />
      <Marker 
      position={[parseFloat(location.lat), parseFloat(location.lon)]} 
      icon={customIcon}
      >
        <Popup>
          <strong>{location.name}</strong>
          <br />
          Lat: {parseFloat(location.lat).toFixed(6)}, Lon: {parseFloat(location.lon).toFixed(6)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default StoryMap;
