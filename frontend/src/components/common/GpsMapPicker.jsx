/**
 * GpsMapPicker
 * A click-to-place interactive map for selecting GPS coordinates.
 * Uses react-leaflet + OpenStreetMap tiles — no API key required.
 *
 * Props:
 *  lat, lng         — current coordinates (numbers)
 *  onChange(lat, lng) — called on every pin placement or search
 *  height           — map container height in px (default 320)
 *  readOnly         — disable dragging / clicking (default false)
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── Leaflet default icon path fix (Vite asset pipeline) ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Custom pin icon */
const pinIcon = L.divIcon({
  html: `
    <div style="
      position:relative;
      width:28px;
      height:28px;
    ">
      <div style="
        width:28px;height:28px;
        border-radius:50% 50% 50% 0;
        background:linear-gradient(135deg,#0369a1,#0ea5e9);
        border:3px solid #fff;
        box-shadow:0 2px 8px rgba(3,105,161,0.5);
        transform:rotate(-45deg);
        position:absolute;top:0;left:0;
      "></div>
      <div style="
        width:10px;height:10px;
        background:#fff;border-radius:50%;
        position:absolute;top:9px;left:9px;
      "></div>
    </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

/* Inner component — handles click events inside the MapContainer */
function ClickHandler({ onMapClick, readOnly }) {
  useMapEvents({
    click(e) {
      if (!readOnly) {
        onMapClick(
          parseFloat(e.latlng.lat.toFixed(6)),
          parseFloat(e.latlng.lng.toFixed(6))
        );
      }
    },
  });
  return null;
}

/* Re-centers map when lat/lng props change */
function MapRecenterer({ lat, lng }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

export default function GpsMapPicker({
  lat = 9.005,
  lng = 38.763,
  onChange,
  height = 320,
  readOnly = false,
}) {
  const [pos, setPos] = useState({ lat: Number(lat), lng: Number(lng) });
  const [searchVal, setSearchVal] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [useMyLocation, setUseMyLocation] = useState(false);

  /* Sync external lat/lng changes into local state */
  useEffect(() => {
    if (lat && lng) {
      setPos({ lat: Number(lat), lng: Number(lng) });
    }
  }, [lat, lng]);

  const handleMapClick = useCallback(
    (newLat, newLng) => {
      setPos({ lat: newLat, lng: newLng });
      onChange?.(newLat, newLng);
    },
    [onChange]
  );

  /* Geocode a place name → coordinates via Nominatim (OpenStreetMap, no key) */
  async function handleSearch(e) {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setSearching(true);
    setSearchErr("");
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchVal)}&limit=1&countrycodes=et`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      if (data.length === 0) {
        setSearchErr("Location not found. Try a more specific name.");
        return;
      }
      const newLat = parseFloat(parseFloat(data[0].lat).toFixed(6));
      const newLng = parseFloat(parseFloat(data[0].lon).toFixed(6));
      setPos({ lat: newLat, lng: newLng });
      onChange?.(newLat, newLng);
    } catch {
      setSearchErr("Geocoder unavailable. Place the pin manually on the map.");
    } finally {
      setSearching(false);
    }
  }

  /* Browser geolocation */
  function handleMyLocation() {
    if (!navigator.geolocation) return;
    setUseMyLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLat = parseFloat(position.coords.latitude.toFixed(6));
        const newLng = parseFloat(position.coords.longitude.toFixed(6));
        setPos({ lat: newLat, lng: newLng });
        onChange?.(newLat, newLng);
        setUseMyLocation(false);
      },
      () => setUseMyLocation(false)
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--card)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Top Controls Row */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          background: "var(--bg2)",
        }}
      >
        {/* Search input */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: 6, flex: 1, minWidth: 180 }}
        >
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search location (e.g. Bole Lemi, Hawassa)..."
            disabled={readOnly}
            style={{
              flex: 1,
              padding: "6px 10px",
              border: "1px solid var(--border)",
              borderRadius: 7,
              fontSize: 12.5,
              background: "var(--card)",
              color: "var(--text)",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={readOnly || searching}
            style={{
              padding: "6px 12px",
              borderRadius: 7,
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: readOnly ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {searching ? "..." : "🔍 Search"}
          </button>
        </form>

        {/* My Location button */}
        {!readOnly && (
          <button
            type="button"
            onClick={handleMyLocation}
            disabled={useMyLocation}
            title="Use device GPS"
            style={{
              padding: "6px 12px",
              borderRadius: 7,
              background: useMyLocation ? "#e2e8f0" : "#ecfdf5",
              color: useMyLocation ? "#64748b" : "#059669",
              border: "1px solid",
              borderColor: useMyLocation ? "#cbd5e1" : "#6ee7b7",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {useMyLocation ? "Locating..." : "📍 Use My Location"}
          </button>
        )}
      </div>

      {searchErr && (
        <div
          style={{
            padding: "6px 14px",
            fontSize: 12,
            color: "#b91c1c",
            background: "#fef2f2",
            borderBottom: "1px solid #fca5a5",
          }}
        >
          ⚠️ {searchErr}
        </div>
      )}

      {/* Leaflet Map */}
      <div style={{ height, position: "relative" }}>
        <MapContainer
          center={[pos.lat, pos.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onMapClick={handleMapClick} readOnly={readOnly} />
          <MapRecenterer lat={pos.lat} lng={pos.lng} />
          <Marker position={[pos.lat, pos.lng]} icon={pinIcon} draggable={!readOnly}
            eventHandlers={{
              dragend(e) {
                const { lat: newLat, lng: newLng } = e.target.getLatLng();
                const rLat = parseFloat(newLat.toFixed(6));
                const rLng = parseFloat(newLng.toFixed(6));
                setPos({ lat: rLat, lng: rLng });
                onChange?.(rLat, rLng);
              },
            }}
          >
            <Popup>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                <strong>Factory / Establishment Location</strong><br />
                Lat: <code>{pos.lat}</code><br />
                Lng: <code>{pos.lng}</code>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Instruction overlay (bottom of map) */}
        {!readOnly && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.62)",
              color: "#fff",
              fontSize: 11.5,
              padding: "5px 12px",
              borderRadius: 20,
              pointerEvents: "none",
              zIndex: 1000,
              whiteSpace: "nowrap",
            }}
          >
            🖱️ Click on map to place pin · Drag pin to adjust
          </div>
        )}
      </div>

      {/* Coordinate Readout Footer */}
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          background: "var(--bg2)",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>
            <strong style={{ color: "var(--text)", fontFamily: "monospace" }}>{pos.lat}</strong>
            <span style={{ marginLeft: 4 }}>Latitude (N)</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>
            <strong style={{ color: "var(--text)", fontFamily: "monospace" }}>{pos.lng}</strong>
            <span style={{ marginLeft: 4 }}>Longitude (E)</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#0369a1", background: "#dbeafe", padding: "2px 8px", borderRadius: 12 }}>
          📡 WGS 84 · SRID 4326
        </div>
      </div>
    </div>
  );
}
