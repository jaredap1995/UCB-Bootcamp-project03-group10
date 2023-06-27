//the second d3.json(url).then() block is chained to the first one using the return statement. 
//This ensures that the second API call is made only after the first one is completed successfully. 
//By chaining the promises, the code will fetch data for both charts and plot them accordingly.
// New edit for a test
window.Apex = {
  dataLabels: {
    enabled: false
  }
};

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
let broadwayData = "/api/broadway_year";
let fremontData = "/api/fremont_year";
let burkegilmanData = "/api/burkegilman_year";
let fremontHourly = "/api/fremont_hourly"

d3.json(broadwayData)
  .then(function(dataBW) {
  let broadwayDate = []
  let broadwayNB = []
  let broadwaySB = []
  let broadwayTotal = []

  dataBW.forEach((elem) => {
    console.log({elem})
    broadwayDate.push(elem.year);
    broadwayNB.push(elem.north_bike);
    broadwaySB.push(elem.south_bike);
    broadwayTotal.push(elem.total)
  });
  console.log({broadwayNB});
  console.log({broadwaySB});
  console.log({broadwayDate});

  // If statements will go here to added time scale and locations
  let leftYData = broadwayNB
  let leftXData = broadwayDate
  let rightYData = broadwaySB
  let rightXData = broadwayDate
  let totalData = broadwayTotal

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
        text: 'Northbound',
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

  return d3.json(fremontHourly)
  });
  // .then(function(fremontDataHourly) {
  //   let fremontDate = []
  //   let fremontEB = []
  //   let fremontWB = []
  //   let fremontTotal = []
  
  //   fremontDataHourly.forEach((elem) => {
  //     // console.log({elem})
  //     fremontDate.push(elem.year);
  //     fremontEB.push(elem.east);
  //     fremontWB.push(elem.west);
  //     fremontTotal.push(elem.total)
  //   });
  //   // Ideally would have daily data for every location in one graph
  //   var trace1 = {
  //     type: "scatter",
  //     mode: "lines",
  //     name: 'Total Bike Traffic',
  //     x: fremontDate,
  //     y: fremontTotal,
  //   //   x: unpack(rows, 'Date'),
  //   //   y: unpack(rows, 'AAPL.High'),
  //     line: {color: '#7F7F7F'}
  //   }

  //   var data = [trace1];
  
  //   var layout = {
  //     title: 'Total Bike Traffic',
  //     xaxis: {
  //       autorange: false,
  //       range: ['2012', '2023'],
  //       rangeselector: {buttons: [
  //           {
  //             count: 1,
  //             label: '1d',
  //             step: 'day',
  //             stepmode: 'backward'
  //           },
  //           {
  //             count: 1,
  //             label: '1w',
  //             step: 'week',
  //             stepmode: 'backward'
  //           },
  //           {
  //             count: 1,
  //             label: '1m',
  //             step: 'month',
  //             stepmode: 'backward'
  //           },
  //           {
  //             count: 6,
  //             label: '6m',
  //             step: 'month',
  //             stepmode: 'backward'
  //           },
  //           {
  //             count: 1,
  //             label: '1y',
  //             step: 'year',
  //             stepmode: 'backward'
  //           },
  //           {step: 'all'}
  //       ]},
  //       rangeslider: {range: ['2012', '2023']},
  //       type: 'date'
  //     },
  //     yaxis: {
  //       autorange: true,
  //       range: [0, 1000],
  //       type: 'linear'
  //     }
  //   };
  //   console.log({fremontDate})
  //   console.log({fremontTotal})
  //   // console.log({broadwayDate})
  //   Plotly.newPlot("barbg", data, layout);
  // });