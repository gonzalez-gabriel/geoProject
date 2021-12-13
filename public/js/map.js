mapboxgl.accessToken =
  "pk.eyJ1Ijoic2llbXByZW1hcmFkb25hIiwiYSI6ImNrd3NqOTcxYTBoMGoyd28xcDZ5M2ZiM2oifQ.8BT9IUGgZy3KsYJxzSLczw";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [-65.20454764466389, -26.83035998525646], // starting position [lng, lat]
  zoom: 11, // starting zoom
});

//Fetch store from API
async function getStores() {
    const res = await fetch('/api/v1/stores');
    const data = await res.json();

    const stores = data.data.map(store => {
        return {
            type: "Feature",
            geometry: {
            type: "Point",
            coordinates: [store.location.coordinates[0], store.location.coordinates[1]],
            },
            properties: {
                storeId: store.storeId,
                icon: 'shop'
            }
        }
    });

    loadMap(stores);
}

// Loead map with stores
function loadMap(stores) {
  map.on("load", () => {
    // Load an image from an external URL.
    map.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: stores
        },
      });

      // Add a layer to use the image to represent the data.
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "point", // reference the data source
        layout: {
          "icon-image": '{icon}-15', // reference the image
          "icon-size": 1.5,
          "text-field": '{storeId}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.9],
          'text-anchor': 'top'
        },
      });
  });
}

getStores();