import React, { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

mapboxgl.workerClass = MapboxWorker; // Wire up loaded worker to be used instead of the default

function Map({ lat, lon }) {
  const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  mapboxgl.accessToken = accessToken;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [lon, lat], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });
    new mapboxgl.Marker().setLngLat([lon, lat]).addTo(map);
  }, [lat, lon]);

  return <div id='map' style={{ height: '400px' }} className='mb-3'></div>;
}

export default Map;
