import Map from "ol/Map";
import View from "ol/View";
 
import XYZ from "ol/source/XYZ";
import { useEffect, useRef, useState } from "react";
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
 import VectorSource from "ol/source/Vector";
import { GeoJSON, MVT } from "ol/format";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"; 
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import portland from "./assets/portland.geojson";
import { Circle, Circle as CircleStyle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import marker from "./assets/marker4.png";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { transform } from "ol/proj";
import { Modify, Draw, Snap } from 'ol/interaction';
import url from "./assets/data.geojson"
import ClusterSource from 'ol/source/Cluster';
import HeatMapLayer from 'ol/layer/Heatmap';

const App = () => {
  const [source, setSource] = useState(
    new VectorSource({
      url: portland,
      format: new GeoJSON(),
    })
  );
  
let source2 = new ClusterSource({
  distance: 20,
  source: new VectorSource({
    url: url,
    format: new GeoJSON(),
  }),
});
  let map,draw,modify;
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

  const styleCache = {};
  var fill = [
    {
      size: 0,
      color: '#3399CC',
    },
    {
      size: 15,
      color: '#FABA3E',
    },
    {
      size: 50,
      color: '#EF4A37',
    },
  ];
  const clusters = new VectorLayer({
    source: source2,
    style: function (feature) {
      const size = feature.get("features").length;
      let style = styleCache[size];
      var tempFill;
      fill.forEach((element) => {
        if (size > element.size) {
          tempFill = element.color;
        }
      });
      if (!style) {
        style = clusterStyles(tempFill, size);
        styleCache[size] = style;
      }
      return style;
    },
    properties: {
      id: 'cluster-layer',
      name: 'Portaland',
    }
  });
  const clusterStyles =(tempFill, size) =>{
    return [
      new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: tempFill,
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff',
          }),
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 12,
          stroke: new Stroke({
            color: tempFill,
            lineDash: [9, 5],
            lineCap: 'round',
            width: 2,
          }),
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 14,
          stroke: new Stroke({
            color: tempFill,
            lineDash: [8, 9],
            lineCap: 'round',
            width: 2,
          }),
        }),
      }),
    ];
  }
  const heatMapLayer = new HeatMapLayer({
    source: new VectorSource({
      url: url,
      format: new GeoJSON(),
    }),
    gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
    weight: (feature) => {
      var name = feature.getProperties().eventarr.time.length;
      var magnitude = parseFloat(name);
      return magnitude;
    },
    properties:{
      id : 'heat-layer'
    }
  }); 
  useEffect(() => {
    map = new Map({
      target: mapElement.current,
      layers: [tileLayer, vectorLayer1, vectorLayer2, heatMapLayer, clusters],
      view: mapView,
      controls: functions,
    });
    addFeature();

    // TODO: Below is the list of all the event listners available on map instance
    // singleclick: A true single click with no dragging and no double click. This event is delayed 250ms to ensure that it’s not a double click
    // postrender: Triggered after map is rendered
    // pointermove: Triggered when pointer is moved
    // pointerdrag: Triggered when pointer is dragged
    // movestart: Triggered when map starts moving
    // moveend: Triggered after map is moved
    // dblclick: A true double click with no dragging
    // click: A single click with no dragging. Double click will fire two events

    //Creating a Map Click Event Listener
    map.on("singleclick", function (e) {
      console.log("single clicked"); //open console and make a single click to view the resutl
    });

    draw = new Draw({
      source,
      type: 'LineString',
      // TODO: BElow is the available draw types provided by Openlayers
      // Point
      // LineString
      // Polygon
      // Circle
    });

    // Add Draw line interaction on map
    map.addInteraction(draw);
    modify = new Modify({ source });

    // capture event on modify start
    modify.on('modifystart', (event) => {});

    // capture event on modify end
    modify.on('modifyend', (event) => {});

    //clean up function to set the target to undefined to avoid the map the appearing for twice on screen
    return () => map.setTarget(undefined);
  } );

  //utility functions such as add-remove-transform etc. will be defined onwards
  // add a feature to a specific layer i.e. 'main-layer'
  const addFeature = () => {
    let markerFeature = new Feature({ geometry: new Point([0, 0]) });
    let layer;
    map.getLayers().forEach((lr) => {
      if (lr.getProperties()["id"] === "main-layer") {
        layer = lr;
      }
    });
    layer && layer.getSource().addFeature(markerFeature);
  };
  // Remove a feature from a specific layer i.e. 'main-layer'
  const removeFeature = (feature) => {
    let layer;
    map.getLayers().forEach((lr) => {
      if (lr.getProperties()["id"] === "main-layer") {
        layer = lr;
      }
    });
    layer && layer.getSource().addFeature(feature);
  };
  //following function is used to transofrm projection
  const tranformProjection = (feature, coordinates) => {
    // Transforms a coordinate from source projection to destination projection. This returns a new coordinate (and does not modify the original).
    let trans = transform(coordinates, "EPSG:3857", "EPSG:4326");
    // Geometry can be also be transformed from one projection to some other projection.
    feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
  };
  const showHideLayer = (event) => {
    map.getLayers().forEach((lr) => {
      if (lr.getProperties()["id"] === "main-layer") {
        lr.setVisible(event.target.checked);
      }
    });
  };

  const manageInteractions = (event) => {
    if ((event.target).value === 'draw') {
      map.addInteraction(draw);
      map.removeInteraction(modify);
      debugger;
     } else {
      map.removeInteraction(draw);
      map.addInteraction(modify);
    }
  };

  return (
    <div className="map" ref={mapElement}>
      <div className="layer-switcher">
        <input
          type="checkbox"
          name="main-layer"
          id="lr"
          defaultChecked
          onChange={showHideLayer}
        />
        <label htmlFor="lr">Show/Hide Main Layer</label><br/>
        <input
        type="radio"
        name="interactions"
        value="draw"
        id="r-lr"
        defaultChecked
        onChange={manageInteractions}
      />
      <label htmlFor="r-lr">Draw</label>
      <input
        type="radio"
        name="interactions"
        value="modify"
        id="r1-lr"
        onChange={manageInteractions}
      />
      <label htmlFor="r1-lr">Modify</label>
      </div>
      <div> 
    </div>
    </div>
  );
};
export default App;
