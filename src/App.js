import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { useEffect, useRef } from "react";
import { OSM } from "ol/source";
import "./App.css";
import "ol/ol.css";
import {
  defaults,
  ScaleLine,
  Rotate,
  FullScreen,
  ZoomSlider,
  ZoomToExtent,
  MousePosition,
  OverviewMap,
} from "ol/control";

const App = () => {
  let map;
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  const tileLayer = new TileLayer({
    source: new XYZ({
      url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    }),
  });
  const mapView = new View({
    center: [0, 0],
    zoom: 2,
  });

  const functions = defaults().extend([
    new ScaleLine(),
    new Rotate(),
    new FullScreen(),
    new ZoomSlider(),
    new ZoomToExtent(),
    new MousePosition(),
    new OverviewMap(),
  ]);
  useEffect(() => {
    map = new Map({
      target: mapElement.current,
      layers: [tileLayer],
      view: mapView,
      controls: functions,
    });
    //clean up function to set the target to undefined to avoid the map the appearing for twice on screen
    return () => map.setTarget(undefined);
  }, []);
  return <div className="map" ref={mapElement}></div>;
};
export default App;
