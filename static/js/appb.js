
function inint(){

    // select dropdown 
    let dropDown = d3.select("#selectPB")

    //get years for dropdown menu


    d3.json("/api/burkegilman").then((data) => {
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
    d3.json("/api/burkegilman").then((data) => {

        let selectedYear = data.filter((elem) => elem.year === yearNum)[0];
        //let selectedYear = returnYear(years).filter((year)=> year === yearNum)[0];
        console.log('selected year',selectedYear)

        //let year_list = [selectedYear.year];
        let pedestrian_south = [selectedYear.pedestrian_south_burke];
        let pedestrian_north = [selectedYear.pedestrian_north_burke];
        let bike_north = [selectedYear.bike_north_burke];
        let bike_south = [selectedYear.bike_south_burke];




        var data = [{
            values: [bike_north[0], bike_south[0], pedestrian_north[0], pedestrian_south[0]],
            labels: ["Bike North", "Bike South", "Pedestrian North", "Pedestrian South"],
            type: 'pie'
        }];
    
        var layout = {
            height: 400,
            width: 500
        };
    
        Plotly.newPlot('pie', data, layout);
    });


    };


inint()



