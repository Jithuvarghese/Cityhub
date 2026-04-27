import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG, getCategoryById, STATUS_CONFIG } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons for different categories
const createCustomIcon = (category) => {
  const categoryData = getCategoryById(category);
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${categoryData.color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 18px;">
          ${categoryData.icon}
        </span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Component to handle map view changes
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
};

MapViewController.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number
};

/**
 * MapView component to display issues on a map
 */
const MapView = ({ 
  issues = [], 
  center = MAP_CONFIG.defaultCenter, 
  zoom = MAP_CONFIG.defaultZoom,
  height = '600px',
  onMarkerClick 
}) => {
  const navigate = useNavigate();
  const [mapCenter] = useState(center);
  const mapId = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear the map container on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleMarkerClick = (issue) => {
    if (onMarkerClick) {
      onMarkerClick(issue);
    }
  };

  return (
    <div 
      ref={containerRef}
      id={mapId.current}
      style={{ height, width: '100%' }} 
      className="rounded-lg overflow-hidden shadow-lg"
    >
      <MapContainer
        key={mapId.current}
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={MAP_CONFIG.tileLayerAttribution}
          url={MAP_CONFIG.tileLayerUrl}
          maxZoom={MAP_CONFIG.maxZoom}
          minZoom={MAP_CONFIG.minZoom}
        />
        
        <MapViewController center={center} zoom={zoom} />
        
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.location.lat, issue.location.lng]}
            icon={createCustomIcon(issue.category)}
            eventHandlers={{
              click: () => handleMarkerClick(issue),
            }}
          >
            <Popup>
              <div className="min-w-[250px]">
                {/* Issue image */}
                {issue.photos && issue.photos.length > 0 && (
                  <img 
                    src={issue.photos[0]} 
                    alt={issue.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                
                {/* Issue details */}
                <h3 className="font-semibold text-gray-900 mb-1">
                  {issue.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${STATUS_CONFIG[issue.status].color}`}>
                    {STATUS_CONFIG[issue.status].label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getCategoryById(issue.category).name}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {issue.description}
                </p>
                
                <button
                  onClick={() => navigate(`/issues/${issue.id}`)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.object),
  center: PropTypes.array,
  zoom: PropTypes.number,
  height: PropTypes.string,
  onMarkerClick: PropTypes.func
};

export default MapView;
