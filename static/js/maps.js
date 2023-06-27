var map = L.map('mapid').setView([47.6062, -122.3321], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

// Prepare data for each location
const locations = [
  { name: "Broadway", lat: 47.625305, lon: -122.322183 }, 
  { name: "Burke_Gilman", lat: 47.695721, lon: -122.278343 }, 
  { name: "Fremont", lat: 47.6511, lon: -122.3475 }, 
];

var markers = L.layerGroup().addTo(map);

// Light and dark mode
let light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
let dark = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {});

let currentLayer = light;

// Mode switcher
let modeDropdown = document.getElementById('modeDropdown');

modeDropdown.addEventListener('change', (event) => {
    let selectedMode = event.target.value;
    
    document.body.className = selectedMode + '-mode';

    // remove the current layer from the map
    map.removeLayer(currentLayer);

    // switch the map layer
    if (selectedMode === 'light') {
        currentLayer = light;
    } else {
        currentLayer = dark;
    }

    // add the new layer to the map
    currentLayer.addTo(map);
});


// Fetch data
d3.json('/api/heatmap_data').then((data) => {

  let monthDropdown= document.getElementById('monthDropdown');
  let months= [...new Set(data.map(point => point.month))];

  for (month of months) {
    let option= document.createElement('option');
    option.value=month;
    option.text=month;
    monthDropdown.appendChild(option);
  };

  monthDropdown.addEventListener('change', (event) => {
    
    let selectedMonth = event.target.value;

    markers.clearLayers();

    locations.forEach(location => {
      let totalTraffic = 0;
      let filteredData = data.filter(point => point.month == selectedMonth && point.location == location.name);
      
      if(filteredData.length > 0) {
        totalTraffic = filteredData[0].count;
      }
      
      location.totalTraffic = totalTraffic;

      // Calculate min and max traffic
      let minTraffic = Math.min(...locations.map(location => location.totalTraffic));
      let maxTraffic = Math.max(...locations.map(location => location.totalTraffic));

      // Normalize traffic to a 0-1 range
      let normalizedTraffic = (location.totalTraffic - minTraffic) / (maxTraffic - minTraffic);

      let color = `rgb(${255 * normalizedTraffic}, 0, 0)`;

      // Create and add marker
      let circleMarker = L.circleMarker([location.lat, location.lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: normalizedTraffic > 0.1 ? 35 * normalizedTraffic : 10 // If else statement so the bubbles dont end up too small
      });

      //Tooltip for population
      circleMarker.bindTooltip(`${location.name}: ${location.totalTraffic}`, { opacity: 0.8 });

      circleMarker.addTo(markers);
    });
  });

}).catch((error) => {
  console.log('Error:', error);
});
