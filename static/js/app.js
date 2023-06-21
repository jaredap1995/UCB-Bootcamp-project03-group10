//the second d3.json(url).then() block is chained to the first one using the return statement. 
//This ensures that the second API call is made only after the first one is completed successfully. 
//By chaining the promises, the code will fetch data for both charts and plot them accordingly.
// New edit for a test
window.Apex = {
  dataLabels: {
    enabled: false
  }
};

let url_2 = "/api/broadway";
let url = "/api/alldata";
let url_3 = "/api/burkegilman";

// d3.json(url_2)
//   .then((broadwayData)) => {
//     let broadwayDate = []
//     let broadwayNB = []
//     let broadwaySB = []

//     broadwayData.forEach((elem) => {
//       console.log({elem});
//       broadwayDate.push(elem.Date);
//       broadwayNB.push(elem.NB);
//       broadwaySB.push(elem.SB);
//     });
//     console.log((broadwayNB))};
//   .catch((error) => {
//     console.log('Error:', error);
// });

// d3.json(url_2)
//   .then((data_b) => {
//     let year_list_b = [];
//     let total_list_b = [];

//     data_b.forEach((elem) => {
//       console.log({ elem });
//       year_list_b.push(elem.year);
//       total_list_b.push(elem.total);
//     });

//     var bdata = [
//       {
//         x: year_list_b,
//         y: total_list_b,
//         type: 'bar'
//       }
//     ];

//     Plotly.newPlot('barb', bdata);

//     return d3.json(url);
//   })
//   .then((data) => {
//     let year_list = [];
//     let total_list = [];

//     data.forEach((element) => {
//       console.log({ element });
//       year_list.push(element.year);
//       total_list.push(element.all);
//     });

//     var bardata = [
//       {
//         x: year_list,
//         y: total_list,
//         type: 'bar'
//       }
//     ];

//     Plotly.newPlot('bar', bardata);

//     return d3.json(url_3);
//   })
//   .then((data_bg) => {
//     let year_list_bg = [];
//     let total_list_bg = [];

//     data_bg.forEach((ele) => {
//       console.log({ ele });
//       year_list_bg.push(ele.year);
//       total_list_bg.push(ele.total_ped_and_bike);
//     });

//     var bgdata = [
//       {
//         x: year_list_bg,
//         y: total_list_bg,
//         type: 'bar'
//       }
//     ];

//     Plotly.newPlot('barbg', bgdata);
//   })
//   .catch((error) => {
//     console.log('Error:', error);
//   });

  var map = L.map('mapid').setView([47.6062, -122.3321], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Mock data for illustrative purposes
var heatArray = [
  [47.6062, -122.3321, 0.5], // Seattle location with 0.5 traffic intensity
  [47.6097, -122.3331, 0.8], // Another location with 0.8 traffic intensity
];

L.heatLayer(heatArray).addTo(map);



// ===================================
let broadwayData = "/api/broadway";
let fremontData = "/api/alldata";
let burkegilmanData = "/api/burkegilman";

d3.json(broadwayData)
  .then(function(dataBW) {
  let broadwayDate = []
  let broadwayNB = []
  let broadwaySB = []

  dataBW.forEach((elem) => {
    broadwayDate.push(elem.year);
    broadwayNB.push(elem.north_bike);
    broadwaySB.push(elem.south_bike);
  });
  console.log({broadwayNB});
  console.log({broadwaySB});

  // If statements will go here to added time scale and locations
  let leftYData = broadwayNB
  let leftXData = broadwayDate
  let rightYData = broadwaySB
  let rightXData = broadwayDate

// bar graph on the left
  var optionsBarLeft = {
      chart: {
        type: 'bar',
        height: 250,
        width: '100%',
        stacked: true,
        foreColor: '#999',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false
          },
          columnWidth: '75%',
          endingShape: 'rounded'
        }
      },
      colors: ["#00C5A4"], //add additional colors here for multiple dataset ex:[color1,color2]
      series: [{
        name: "Bikes",
        data: leftYData,
      }, 
      // {
      //   name: "dataset2",
      //   data: [20, 16, 24, 28, 26, 22, 15, 5, 14, 16, 22, 29, 24, 19, 15, 10, 11, 15, 19, 23],
      // }
      ],
      labels: leftXData,
      xaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: true
        },
        crosshairs: {
          show: false
        },
        labels: {
          show: true,
          style: {
            fontSize: '14px'
          }
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false
          },
        },
        yaxis: {
          lines: {
            show: true
          },
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        labels: {
          show: true
        },
      },
      legend: {
        floating: true,
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -36
      },
      title: {
        text: 'Southbound',
        align: 'left',
      },
      tooltip: {
        shared: true,
        intersect: false
      }
    
  }
  var chartBar = new ApexCharts(document.querySelector('#bar'), optionsBarLeft);
  chartBar.render();

// Bar graph on the right
  var optionsBarRight = {
      chart: {
        type: 'bar',
        height: 250,
        width: '100%',
        stacked: true,
        foreColor: '#999',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false
          },
          columnWidth: '75%',
          endingShape: 'rounded'
        }
      },
      colors: ["#f4516c"], //add additional colors here for multiple dataset ex:[color1,color2]
      series: [{
        name: "Bikes",
        data: rightYData,
      }, 
      // {
      //   name: "dataset2",
      //   data: [20, 16, 24, 28, 26, 22, 15, 5, 14, 16, 22, 29, 24, 19, 15, 10, 11, 15, 19, 23],
      // }
      ],
      labels: rightXData,
      xaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: true
        },
        crosshairs: {
          show: false
        },
        labels: {
          show: true,
          style: {
            fontSize: '14px'
          }
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false
          },
        },
        yaxis: {
          lines: {
            show: true
          },
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        labels: {
          show: true
        },
      },
      legend: {
        floating: true,
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -36
      },
      title: {
        text: 'Southbound',
        align: 'left',
      },
      tooltip: {
        shared: false,
        intersect: false
      }
  }
  var chartBar = new ApexCharts(document.querySelector('#barb'), optionsBarRight);
  chartBar.render();
});