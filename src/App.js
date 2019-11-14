import React, { useState, useEffect } from "react";
import ReactMapGL, { NavigationControl, GeolocateControl, Marker, Popup } from "react-map-gl";
import * as parkDate from "./data/skateboard-parks.json";
import _ from 'lodash';
import "./App.css";

export default function App() {
  const MAP_TOKEN = "pk.eyJ1Ijoic3VuZ21pbnBhcmsiLCJhIjoiY2sydnZnY2c2MDlkdTNpcWlmeTB6Yjg5ZyJ9.INZT1hkjzW_gTQ3FTi6c-g";

  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 10
  });

  const geolocateStyle = {
    position: 'absolute',
    top: 0,
    right: 0
  };

  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  useEffect(() => {
    const mapResizeEvent = _.throttle(() => {
      setViewport(Object.assign({}, {
        ...viewport,
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`
      }));
    }, 2000);
    window.addEventListener('resize', mapResizeEvent);
    
    return () => {
      window.removeEventListener('resize', mapResizeEvent);
    }
  }, [viewport]);

  return (
    <div class="mainMap">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={MAP_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        // mapStyle="mapbox://styles/mapbox/dark-v10"

        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        <div class="nav" style={{position: 'absolute', top: 31, right: 0}}>
          <NavigationControl 
          showCompass={false}
          />
        </div>

       
          <GeolocateControl
            style={geolocateStyle}
            positionOptions={{enableHighAccuracy: true}}
            trackUserLocation={true}
          />

        {parkDate.features.map(park => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }}
            >
              <img src="/skateboarding.svg" alt="Skate Park Icon" />
            </button>
          </Marker>
        ))}

        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            tipSize={5}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div class="wrapper">
              <h2 class="title">{selectedPark.properties.NAME}</h2>
              <p class="discript">{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );
}