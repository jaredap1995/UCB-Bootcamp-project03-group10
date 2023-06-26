
//the second d3.json(url).then() block is chained to the first one using the return statement. 
//This ensures that the second API call is made only after the first one is completed successfully. 
//By chaining the promises, the code will fetch data for both charts and plot them accordingly.






let url_2 = "/api/broadway";
let url = "/api/alldata";
let url_3 = "/api/burkegilman";
let url_4 = "/api/weather_bins_data"

d3.json(url_4).then(function(jsData){
  //Binned weather data bar

  let chartSample=jsData;
  let valueArray=chartSample.samples.filter(
      (sampleObject)=>sampleObject.temp_real_f==sample_id);
  console.log(valueArray);
  let sampleValue=valueArray[0];
  let north_bike_broadway=sampleValue.north_bike_broadway;

  let barData=[{
      x: temp_real_f
      y: north_bike_broadway
      type: "bar",
      orientation: "h",
      marker:{
          size:sample_values
      }    

  }]);
  Plotly.newPlot("bar",barData);
  console.log(north_bike_broadway);
      };

// Dropdown selection function
function optionChanged(dataOption){
  console.log(dataOption)

url_4(dataOption)
};
