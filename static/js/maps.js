//Marina pie_chart app.js


function displayPieChart(yearNum) {
  d3.json("/api/burkegilman").then((data) => {
    console.log('data:', data)

    // year in db is a number yearNum is a string in JS
    let selectedYear = data.filter((elem) => elem.year === Number(yearNum))[0];
    console.log('selected year::::::', selectedYear)

    let bike_north = selectedYear.bike_north_burke;
    let bike_south = selectedYear.bike_south_burke;
    let pedestrian_north = selectedYear.pedestrian_north_burke;
    let pedestrian_south = selectedYear.pedestrian_south_burke;

    var data = [{
      values: [bike_north, bike_south, pedestrian_north, pedestrian_south],
      labels: ["Bike North", "Bike South", "Pedestrian North", "Pedestrian South"],
      type: 'pie'
    }];

    var layout = {
      title: "Burke Gilman Bicycle and Pedestrian",
      height: 400,
      width: 500
    };

    Plotly.newPlot('pie', data, layout);
  }).then(() => {

  var map = L.map('mapid').setView([47.6062, -122.3321], 11);

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

    if (monthDropdown.value !== '') {
        updateMarkers();
    }
  });

  function updateMarkers() {
    let selectedMonth = monthDropdown.value;
    let selectedTime = timeDropdown.value === 'total' ? 'count' : timeDropdown.value;

    markers.clearLayers();

    // Calculate min and max traffic
    let minTraffic = Infinity
    let maxTraffic = -Infinity;

    locations.forEach(location => {
      let filteredData = data.filter(point => point.month == selectedMonth && point.location == location.name);
      
      let totalTraffic = 0;
      if(filteredData.length > 0) {
        totalTraffic = filteredData[0][selectedTime];
      }
      
      location.totalTraffic = totalTraffic;

      minTraffic = Math.min(minTraffic, totalTraffic);
      maxTraffic = Math.max(maxTraffic, totalTraffic);
});

    locations.forEach(location => {
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
  });
  }
