
let url_2 = "/api/broadway"
d3.json(url_2).then((data) => {

  let year_list_b =[]
  let total_list_b =[]

  data.forEach((element) => {
    console.log({ element});
    year_list_b.push(element.year)
    total_list_b.push(element.total)
    
  });

  var bdata = [
    {
      x: year_list_b,
      y: total_list_b,
      type: 'bar'
    }
  ];
  
  Plotly.newPlot('barb', bdata);
  
})



////////////////////////////////////////////////////////////

let url = "/api/alldata"

d3.json(url).then((data) => {

  let year_list =[]
  let total_list =[]

  data.forEach((element) => {
    console.log({ element});
    year_list.push(element.year)
    total_list.push(element.all)
    
  });

  var bardata = [
    {
      x: year_list,
      y: total_list,
      type: 'bar'
    }
  ];
  
  Plotly.newPlot('bar', bardata);
  
})


