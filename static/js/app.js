// using API /api/burkegilman

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



inint()


