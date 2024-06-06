

//////////temperature bins



function inint(){

    // select dropdown 
    let dropDown = d3.select("#selectTemp")

    //get years for dropdown menu
    d3.json("../data.json").then((data) => {
        console.log(data);

        
        let temps = data.map((elem) => elem.temp_real_f);
        

        //add temps as an option to dropdown

        for (i = 0; i<temps.length; i++){
            dropDown.append("option").text(temps[i]).property("value",temps[i])
        }

        displayBarChart(temps[0])

    });

}


function optionChanged(yearNum){
    displayBarChart(yearNum)
}

function displayBarChart(yearNum){
    d3.json("../data.json").then((data) => {
        console.log('data:', data)
        
        let selectedTemp = data.filter((elem) => elem.temp_real_f === (yearNum))[0];
        console.log('selected year::::::',selectedTemp)
        
        let bike_north_burke = [];
        let bike_south_burke = [];
        let east_bike_fremont = [];
        let north_bike_broadway = [];
        let south_bike_broadway = [];
        let west_bike_fremont = []
    
        data.forEach((element) => {
          console.log({ element });
          bike_north_burke.push(element.bike_north_burke);
          bike_south_burke.push(element.bike_south_burke)
          east_bike_fremont.push(element.east_bike_fremonte)
          north_bike_broadway.push(element.north_bike_broadway)
          south_bike_broadway.push(element.south_bike_broadway)
          west_bike_fremont.push(element.west_bike_fremonty)

         
        });
    
        var bardata = [
          {
            x: ["bike_north_burke", "bike_south_burke", "east_bike_fremont","north_bike_broadway","south_bike_broadway","west_bike_fremont"], //locations names
            y: bike_north_burke, bike_south_burke,east_bike_fremont,north_bike_broadway,south_bike_broadway,west_bike_fremont,
            type: 'bar'
          }
        ];
    
        Plotly.newPlot('bar', bardata);
    });


    };


inint()


