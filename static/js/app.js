
//the second d3.json(url).then() block is chained to the first one using the return statement. 
//This ensures that the second API call is made only after the first one is completed successfully. 
//By chaining the promises, the code will fetch data for both charts and plot them accordingly.



//Marina pie_chart from app.js
function tempChart(tempNum) {
  d3.json("/api/weather_bins_data").then((data) => {
    console.log(data);})}
    let selectTemp = data.filter((elem) => elem.temp == tempNum)[0];
    let bike_north_burke = selectTemp.bike_north_burke;
    let bike_south_burke = selectTemp.bike_south_burke;
    let pedestrian_northTemp = selectTemp.east_bike_fremont;
    let pedestrian_southTemp = selectTemp.west_bike_fremont;
    let bike_north_broadwayTemp = selectTemp.north_bike_broadway;
    let bike_south_broadwayTemp = selectTemp.south_bike_broadway;
    var barData = [{
      x: ['Burke North', 'Burke South', 'Fremont East', 'Fremont West', 'Broadway North', 'Broadway South'],
      y: [bike_north_burke, bike_south_burke, pedestrian_northTemp, pedestrian_southTemp, bike_north_broadwayTemp, bike_south_broadwayTemp],
      type: "bar",
      orientation: "v",
      }];
    var layout = {
      title: "Bicycle count by Weather",
      height: 400,
      width: 500};
    Plotly.newPlot('bar', data, layout);

init();