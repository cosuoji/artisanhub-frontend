import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { capitalizeWords } from '../utils/capitalize';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

export default function ArtisanMap({ artisans, mapCenter, nearbyMode}) {
  return (
    <MapContainer
      center={mapCenter}
       key={JSON.stringify(artisans)} // Re-render when artisans change
      zoom={nearbyMode ? 13 : 11}
      className="h-[600px] w-full rounded shadow"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <MarkerClusterGroup>
        {artisans?.map((artisan) => {
          const coords = artisan.artisanProfile?.coordinates?.coordinates;
          if (!coords || coords.length !== 2) return null;

          const [lng, lat] = coords;
          return (
            <Marker key={artisan._id} position={[lat, lng]}>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{artisan.name}</p>
                  <p>{artisan.artisanProfile?.skills?.join(', ')}</p>
                  <p>{capitalizeWords(artisan?.artisanProfile?.location?.name || "")}</p>
                  <a 
                    href={`/artisans/${artisan._id}`} 
                    className="text-blue-600 underline block mt-1"
                  >
                    View Profile
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

      </MarkerClusterGroup>
    </MapContainer>
  );
}