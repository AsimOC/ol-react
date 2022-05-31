import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { useEffect, useRef, useState } from "react";
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
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON, MVT } from "ol/format";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import portland from "./assets/portland.geojson";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import marker from "./assets/marker4.png";
const App = () => {
  const [source, setSource] = useState(
    new VectorSource({
      url: portland,
      format: new GeoJSON(),
    })
  );
  let map;
  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  const image = new Icon({
    anchor: [0.5, 38],
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    src: marker, //this marker is imported from assets (its a png file)
  });
  let styles = {
    Point: new Style({
      image: image,
    }),
    LineString: new Style({
      stroke: new Stroke({
        color: "#ff0000",
        width: 3,
      }),
    }),
    MultiLineString: new Style({
      stroke: new Stroke({
        color: "#ff0000",
        width: 3,
      }),
    }),
    MultiPoint: new Style({
      image: image,
    }),
    MultiPolygon: new Style({
      stroke: new Stroke({
        color: "#ff0000",
        width: 3,
      }),
    }),
    Polygon: new Style({
      stroke: new Stroke({
        color: "#ff0000",
        width: 3,
      }),
    }),
    GeometryCollection: new Style({
      stroke: new Stroke({
        color: "magenta",
        width: 2,
      }),
      fill: new Fill({
        color: "magenta",
      }),
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: "rgba(255, 255, 0, 0.1)",
        }),
        stroke: new Stroke({
          color: "magenta",
        }),
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: "red",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(255, 255, 0, 0.1)",
      }),
    }),
  };
  const tileLayer = new TileLayer({
    source: new XYZ({
      url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    }),
  });
  const mapView = new View({
    center: [0, 0],
    zoom: 2,
  });

  const vectorLayer1 = new VectorLayer({
    source, //source declared above as usestate is being used as source here
    style: (feature) => {
      return styles[feature.getGeometry().getType()];
    },
    properties: {
      id: "main-layer",
      name: "Portaland",
    },
  });
  const vectorLayer2 = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      attributions:
        '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ',
      // +'© <a href="https://www.openstreetmap.org/copyright">' +
      // 'OpenStreetMap contributors</a>'
      format: new MVT(),
      // url:
      //   'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
      //   '{z}/{x}/{y}.vector.pbf?access_token=' +
      //     key,
    }),
    // style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text),TODO: You can styles it as you want using mapbox
  });

  //note that following layer wont be working becuase the provided url is not active anymore.
  const vectorLayer3 = new VectorTileLayer({
    source: new VectorTileSource({
      // Please do not use this service this is for demo only. TODO: add your own service URL here
      // url: 'http://3.106.156.204:8080/geoserver/gwc/service/tms/1.0.0/farmfoundation:nz_parcels@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
      format: new MVT(),
    }),
    visible: true,
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
      layers: [tileLayer, vectorLayer1, vectorLayer2, vectorLayer3],
      view: mapView,
      controls: functions,
    });
    //clean up function to set the target to undefined to avoid the map the appearing for twice on screen
    return () => map.setTarget(undefined);
  }, []);
  return <div className="map" ref={mapElement}></div>;
};
export default App;
