
//the second d3.json(url).then() block is chained to the first one using the return statement. 
//This ensures that the second API call is made only after the first one is completed successfully. 
//By chaining the promises, the code will fetch data for both charts and plot them accordingly.

let url_2 = "/api/broadway";
let url = "/api/alldata";
let url_3 = "/api/burkegilman";

d3.json(url_2)
  .then((data_b) => {
    let year_list_b = [];
    let total_list_b = [];

    data_b.forEach((elem) => {
      console.log({ elem });
      year_list_b.push(elem.year);
      total_list_b.push(elem.total);
    });

    var bdata = [
      {
        x: year_list_b,
        y: total_list_b,
        type: 'bar'
      }
    ];

    Plotly.newPlot('barb', bdata);

    return d3.json(url);
  })
  .then((data) => {
    let year_list = [];
    let total_list = [];

    data.forEach((element) => {
      console.log({ element });
      year_list.push(element.year);
      total_list.push(element.all);
    });

    var bardata = [
      {
        x: year_list,
        y: total_list,
        type: 'bar'
      }
    ];

    Plotly.newPlot('bar', bardata);

    return d3.json(url_3);
  })
  .then((data_bg) => {
    let year_list_bg = [];
    let total_list_bg = [];

    data_bg.forEach((ele) => {
      console.log({ ele });
      year_list_bg.push(ele.year);
      total_list_bg.push(ele.total_ped_and_bike);
    });

    var bgdata = [
      {
        x: year_list_bg,
        y: total_list_bg,
        type: 'bar'
      }
    ];

    Plotly.newPlot('barbg', bgdata);
  })
  .catch((error) => {
    console.log('Error:', error);
  });
