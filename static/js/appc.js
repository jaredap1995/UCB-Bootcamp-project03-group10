
//Using Json file

function inint(){

    // select dropdown 
    let dropDown = d3.select("#selectPB")

    //get years for dropdown menu
    d3.json("../data.json").then((data) => {
        console.log(data);

        //let years = data.year;
        let years = data.map((elem) => elem.year);

        //add dates as an option to dropdown

        for (i = 0; i<years.length; i++){
            dropDown.append("option").text(years[i]).property("value",years[i])
        }

        displayPieChart(years[0])

    });

}


function optionChanged(yearNum){
    displayPieChart(yearNum)
}

function displayPieChart(yearNum){
    d3.json("../data.json").then((data) => {
        console.log('data:', data)
        //year in db is a number yearNum is a string in JS
        let selectedYear = data.filter((elem) => elem.year === Number(yearNum))[0];
        console.log('selected year::::::',selectedYear)
        
        let bike_north = selectedYear.bike_north;
        let bike_south = selectedYear.bike_south;
        let pedestrian_north = selectedYear.pedestrian_north;
        let pedestrian_south = selectedYear.pedestrian_south;

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
    });


    };


inint()
