import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_CONFIG } from '../../utils/constants';
import Button from '../common/Button';
import useGeolocation from '../../hooks/useGeolocation';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

LocationMarker.propTypes = {
  position: PropTypes.array,
  setPosition: PropTypes.func.isRequired
};

/**
 * LocationPicker component for selecting a location on the map
 */
const LocationPicker = ({ 
  value, 
  onChange, 
  height = '400px',
  showCurrentLocation = true 
}) => {
  const [position, setPosition] = useState(value || MAP_CONFIG.defaultCenter);
  const { location, error, loading, getLocation } = useGeolocation();
  const [address, setAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const mapId = useRef(`location-picker-${Math.random().toString(36).substr(2, 9)}`);
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

  useEffect(() => {
    if (value && (!position || value[0] !== position[0] || value[1] !== position[1])) {
      setPosition(value);
    }
  }, [value]);

  useEffect(() => {
    if (position) {
      // Debounce reverse geocoding to avoid too many requests
      const timer = setTimeout(() => {
        reverseGeocode(position[0], position[1]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [position]);

  useEffect(() => {
    if (position && address !== undefined) {
      onChange({
        lat: position[0],
        lng: position[1],
        address: address
      });
    }
  }, [position, address]);

  useEffect(() => {
    if (location) {
      const newPosition = [location.lat, location.lng];
      setPosition(newPosition);
    }
  }, [location]);

  // Reverse geocoding using Nominatim (OpenStreetMap)
  const reverseGeocode = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      // Add a small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CityReport App'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      // Fallback to coordinates if geocoding fails
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleUseMyLocation = () => {
    getLocation();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showCurrentLocation && (
          <Button
            variant="outline"
            onClick={handleUseMyLocation}
            loading={loading}
            icon={<span>📍</span>}
          >
            Use My Location
          </Button>
        )}
        
        {error && (
          <p className="text-sm text-red-600 self-center">{error}</p>
        )}
      </div>

      {/* Address display */}
      {address && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            Selected Location:
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {loadingAddress ? 'Loading address...' : address}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            📍 {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      )}

      {/* Map */}
      <div 
        ref={containerRef}
        id={mapId.current}
        style={{ height, width: '100%' }} 
        className="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
      >
        <MapContainer
          key={mapId.current}
          center={position}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution={MAP_CONFIG.tileLayerAttribution}
            url={MAP_CONFIG.tileLayerUrl}
            maxZoom={MAP_CONFIG.maxZoom}
          />
          
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        💡 Click on the map to set the exact location of the issue
      </p>
    </div>
  );
};

LocationPicker.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  height: PropTypes.string,
  showCurrentLocation: PropTypes.bool
};

export default LocationPicker;
