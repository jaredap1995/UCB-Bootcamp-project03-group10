
var map = L.map('mapid').setView([47.6062, -122.3321], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

// Fetch data
d3.json('/api/heatmap_data').then((data) => {
    // Prepare data for each location
    const locations = [
      { name: "Broadway", lat: 47.625305, lon: -122.322183 }, 
      { name: "Burke_Gilman", lat: 47.695721, lon: -122.278343 }, 
      { name: "Fremont", lat: 47.6511, lon: -122.3475 }, 
    ];
  
    // Combine all the traffic values into one array
    let allTraffic = [];
    locations.forEach(location => {
      allTraffic.push(...data.slice(0,500).map(point => point[location.name]));
    });
  
    // Find the max and min foot traffic
    let maxTraffic = Math.max(...allTraffic);
    let minTraffic = Math.min(...allTraffic);
  
    // Create heatArray
    let heatArray = [];
    locations.forEach(location => {
      data.forEach(point => {
        // Normalize traffic to a 0-1 range
        let normalizedTraffic = (point[location.name] - minTraffic) / (maxTraffic - minTraffic);
        heatArray.push([location.lat, location.lon, normalizedTraffic]);
      });
    });
  
    L.heatLayer(heatArray).addTo(map);
  }).catch((error) => {
    console.log('Error:', error);
  });
  