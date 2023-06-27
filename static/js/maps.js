var map = L.map('mapid').setView([47.6062, -122.3321], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

// Prepare data for each location
const locations = [
  { name: "Broadway", lat: 47.625305, lon: -122.322183 }, 
  { name: "Burke_Gilman", lat: 47.695721, lon: -122.278343 }, 
  { name: "Fremont", lat: 47.6511, lon: -122.3475 }, 
];

var markers = L.layerGroup().addTo(map);

// Light mode tile layer
let light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

// Dark mode tile layer
let dark = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {});

let currentLayer = light;

// Fetch data
d3.json('/api/heatmap_data').then((data) => {

  let monthDropdown = document.getElementById('monthDropdown');
  let timeDropdown = document.getElementById('timeDropdown');
  let months = [...new Set(data.map(point => point.month))];

  for (let month of months) {
    let option = document.createElement('option');
    option.value = month;
    option.text = month;
    monthDropdown.appendChild(option);
  };

  // Initially disable the timeDropdown until a month is selected
  timeDropdown.disabled = true;

  monthDropdown.addEventListener('change', () => {
    // Enable the timeDropdown when a month is selected
    timeDropdown.disabled = false;
    if (monthDropdown.value !== '') {
      updateMarkers();
    }
});

timeDropdown.addEventListener('change', (event) => {
  let selectedTime = event.target.value;
  
  // If the selected time is nighttime, set the page to dark mode, otherwise set to light mode
  if (selectedTime === 'nighttime') {
      document.body.className = 'dark-mode';
      map.removeLayer(currentLayer);
      currentLayer = dark;
  } else {
      document.body.className = 'light-mode';
      map.removeLayer(currentLayer);
      currentLayer = light;
  }
  
  currentLayer.addTo(map);

  // Check if both dropdowns have a value selected, if so, update the markers
  if (monthDropdown.value !== '') {
      updateMarkers();
  }
});

function updateMarkers() {
  let selectedMonth = monthDropdown.value;
  let selectedTime = timeDropdown.value === 'total' ? 'count' : timeDropdown.value;

  markers.clearLayers();

  locations.forEach(location => {
    let totalTraffic = 0;
    let filteredData = data.filter(point => point.month == selectedMonth && point.location == location.name);
    
    if(filteredData.length > 0) {
      totalTraffic = filteredData[0][selectedTime];
    }
    
    location.totalTraffic = totalTraffic;

    // Calculate min and max traffic
    let minTraffic = Math.min(...locations.map(location => location.totalTraffic));
    let maxTraffic = Math.max(...locations.map(location => location.totalTraffic));

    // Normalize traffic to a 0-1 range
    let normalizedTraffic = (location.totalTraffic - minTraffic) / (maxTraffic - minTraffic);

    let color;
    if (selectedTime === 'nighttime') {
      color = `rgb(0, 0, 255)`; // blue
    } else {
      color = `rgb(${255 * normalizedTraffic + 300}, 0, 0)`;
    }

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
}

}).catch((error) => {
  console.log('Error:', error);
});
