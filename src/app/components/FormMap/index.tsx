import { Button, Form, FormInstance, Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import _axios from 'utils/axios';
import openNotificationWithIcon from 'app/functions/openNotificationWithIcon';
export interface FormMapProps {
  initialLocation?: { longitude: number; latitude: number };
  color?: string;
  name: string | string[];
  form: FormInstance;
}

export function FormMap({
  initialLocation,
  color = 'orange',
  name,
  form,
}: FormMapProps) {
  const mapContainer = useRef<any>();

  const [locations, setLocation] = useState({ longitude: 0, latitude: 0 });

  const [map, setMap] = useState<any | null>(null);
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZHVjbnQxMjMiLCJhIjoiY2xvNnZhNDB5MDhtYjJsbzE0N3p5bzFraiJ9.64Ck5kf3RWx4Gb0rJjZ2aA';
  const initMap = () => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      zoom: 6,
      center: [initialLocation?.longitude ?? 0, initialLocation?.latitude ?? 0],
    });

    mapInstance.addControl(new mapboxgl.NavigationControl());
    mapInstance.on('click', e => {
      form.setFieldValue(name, e.lngLat);

      setLocation({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
    });
    setMap(mapInstance);
  };

  useEffect(() => {
    initMap();
    if (initialLocation) {
      setLocation(initialLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeMapMarkers = () => {
    const oldMarker = document.querySelector('.mapboxgl-marker');
    if (oldMarker && oldMarker.parentElement) {
      oldMarker.parentElement.removeChild(oldMarker);
    }
  };

  const addMapMarker = lngLat => {
    new mapboxgl.Marker({ color }).setLngLat(lngLat).addTo(map);
  };
  useEffect(() => {
    if (map) {
      removeMapMarkers();
      addMapMarker({ lat: locations.latitude, lng: locations.longitude });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, map]);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setLocation({ longitude, latitude });
      form.setFieldValue(name, { longitude, latitude });
      map.flyTo({ center: [longitude, latitude], zoom: 6 });
    });
  };
  return (
    <Form.Item name={name}>
      <div className="px-3 flex flex-col gap-2 py-2 rounded-[10px] bg-[#f4f6f8]">
        <div className="flex gap-2">
          <Input.Search
            placeholder="Search"
            className="flex-1 h-[40px] [&_.css-dev-only-do-not-override-d2lrxs]:h-[40px] "
            onSearch={async value => {
              try {
                const { data } = await _axios.get(
                  `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${mapboxgl.accessToken}`,
                );
                if (data.features.length === 0) {
                  openNotificationWithIcon('warning', 'No location found', '');
                } else {
                  const [lng, lat] = data.features[0].center;

                  setLocation({ longitude: lng, latitude: lat });
                  form.setFieldValue(name, { longitude: lng, latitude: lat });
                  map.jumpTo({ center: [lng, lat], zoom: 6 });
                }
              } catch (error) {
                console.log(error);
              }
            }}
          />
          <Button onClick={requestLocation} className="w-[40px] h-[40px]">
            <i className="fa-solid fa-location-dot"></i>
          </Button>
        </div>
        <div ref={mapContainer} className="h-[300px] w-full rounded-[10px]" />
      </div>
    </Form.Item>
  );
}
