//the second d3.json(url).then() block is chained to the first one using the return statement. 
//This ensures that the second API call is made only after the first one is completed successfully. 
//By chaining the promises, the code will fetch data for both charts and plot them accordingly.
window.Apex = {
  dataLabels: {
    enabled: false
  }
};

d3.selectAll('#selLocation').on("change", updateVisuals);

function updateVisuals() {
  // Use D3 to select the dropdown menu
  let dropdownMenuLocation = d3.select("#selLocation");
  // Assign the value of the dropdown menu option to a variable
  let location = dropdownMenuLocation.property("value");

  // let broadwayData = "/api/broadway_year";
  // let fremontData = "/api/fremont_year";
  // let burkegilmanData = "/api/burkegilman_year";
  // let allDataUrl = "/api/fremont_hourly";

  let jsonUrl = [];
  let dataDates = [];
  let dataDirectionOne = [];
  let dataDirectionTwo = [];
  let dataTotal = [];
  let leftYData = [];
  let leftXData = [];
  let rightYData = [];
  let rightXData = [];

  if (location == 'Broadway') {
    // Broadway
    jsonUrl = "/api/broadway_year";
    d3.json(jsonUrl)
      .then(function(data) {
        data.forEach((elem) => {
          console.log({elem})
          dataDates.push(elem.year);
          dataDirectionOne.push(elem.north_bike);
          dataDirectionTwo.push(elem.south_bike);
          dataTotal.push(elem.total);
        });
      });
    let leftYData = dataDirectionOne;
    let leftXData = dataDates;
    let rightYData = dataDirectionTwo;
    let rightXData = dataDates;
  }

  else if (location == 'Fremont') {
    // Fremont
    jsonUrl = "/api/fremont_year";
    d3.json(jsonUrl)
      .then(function(data) {
        data.forEach((elem) => {
          console.log({elem});
          dataDates.push(elem.year);
          dataDirectionOne.push(elem.north_bike);
          dataDirectionTwo.push(elem.south_bike);
          dataTotal.push(elem.total);
        });
      });
      let leftYData = dataDirectionOne;
      let leftXData = dataDates;
      let rightYData = dataDirectionTwo;
      let rightXData = dataDates;
  }

  else if (location == 'Burke Gilman') {
    // Burke Gilman
    jsonUrl = "/api/burkegilman_year";
    d3.json(jsonUrl)
      .then(function(data) {
        data.forEach((elem) => {
          console.log({elem});
          dataDates.push(elem.year);
          dataDirectionOne.push(elem.north_bike);
          dataDirectionTwo.push(elem.south_bike);
          dataTotal.push(elem.total);
        });
      });
      let leftYData = dataDirectionOne;
      let leftXData = dataDates;
      let rightYData = dataDirectionTwo;
      let rightXData = dataDates ;
  }
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

  var chartBar = new ApexCharts(document.querySelector('#bar'), optionsBarLeft);
  chartBar.render();

  var chartBar = new ApexCharts(document.querySelector('#barb'), optionsBarRight);
  chartBar.render();
}

  // ===================================


  // d3.json(broadwayData)
  //   .then(function(dataBW) {
  //   let broadwayDate = []
  //   let broadwayNB = []
  //   let broadwaySB = []
  //   let broadwayTotal = []

  //   dataBW.forEach((elem) => {
  //     console.log({elem})
  //     broadwayDate.push(elem.year);
  //     broadwayNB.push(elem.north_bike);
  //     broadwaySB.push(elem.south_bike);
  //     broadwayTotal.push(elem.total)
  //   });
  //   console.log({broadwayNB});
  //   console.log({broadwaySB});
  //   console.log({broadwayDate});

  //   // If statements will go here to added time scale and locations
  //   let leftYData = broadwayNB
  //   let leftXData = broadwayDate
  //   let rightYData = broadwaySB
  //   let rightXData = broadwayDate
  //   let totalData = broadwayTotal

  // // bar graph on the left
  //   var optionsBarLeft = {
  //       chart: {
  //         type: 'bar',
  //         height: 250,
  //         width: '100%',
  //         stacked: true,
  //         foreColor: '#999',
  //       },
  //       plotOptions: {
  //         bar: {
  //           dataLabels: {
  //             enabled: false
  //           },
  //           columnWidth: '75%',
  //           endingShape: 'rounded'
  //         }
  //       },
  //       colors: ["#00C5A4"], //add additional colors here for multiple dataset ex:[color1,color2]
  //       series: [{
  //         name: "Bikes",
  //         data: leftYData,
  //       }, 
  //       ],
  //       labels: leftXData,
  //       xaxis: {
  //         axisBorder: {
  //           show: false
  //         },
  //         axisTicks: {
  //           show: true
  //         },
  //         crosshairs: {
  //           show: false
  //         },
  //         labels: {
  //           show: true,
  //           style: {
  //             fontSize: '14px'
  //           }
  //         },
  //       },
  //       grid: {
  //         xaxis: {
  //           lines: {
  //             show: false
  //           },
  //         },
  //         yaxis: {
  //           lines: {
  //             show: true
  //           },
  //         }
  //       },
  //       yaxis: {
  //         axisBorder: {
  //           show: false
  //         },
  //         labels: {
  //           show: true
  //         },
  //       },
  //       legend: {
  //         floating: true,
  //         position: 'top',
  //         horizontalAlign: 'right',
  //         offsetY: -36
  //       },
  //       title: {
  //         text: 'Northbound',
  //         align: 'left',
  //       },
  //       tooltip: {
  //         shared: true,
  //         intersect: false
  //       }
      
  //   }
  //   var chartBar = new ApexCharts(document.querySelector('#bar'), optionsBarLeft);
  //   chartBar.render();

  // // Bar graph on the right
  //   var optionsBarRight = {
  //       chart: {
  //         type: 'bar',
  //         height: 250,
  //         width: '100%',
  //         stacked: true,
  //         foreColor: '#999',
  //       },
  //       plotOptions: {
  //         bar: {
  //           dataLabels: {
  //             enabled: false
  //           },
  //           columnWidth: '75%',
  //           endingShape: 'rounded'
  //         }
  //       },
  //       colors: ["#f4516c"], //add additional colors here for multiple dataset ex:[color1,color2]
  //       series: [{
  //         name: "Bikes",
  //         data: rightYData,
  //       }, 
  //       // {
  //       //   name: "dataset2",
  //       //   data: [20, 16, 24, 28, 26, 22, 15, 5, 14, 16, 22, 29, 24, 19, 15, 10, 11, 15, 19, 23],
  //       // }
  //       ],
  //       labels: rightXData,
  //       xaxis: {
  //         axisBorder: {
  //           show: false
  //         },
  //         axisTicks: {
  //           show: true
  //         },
  //         crosshairs: {
  //           show: false
  //         },
  //         labels: {
  //           show: true,
  //           style: {
  //             fontSize: '14px'
  //           }
  //         },
  //       },
  //       grid: {
  //         xaxis: {
  //           lines: {
  //             show: false
  //           },
  //         },
  //         yaxis: {
  //           lines: {
  //             show: true
  //           },
  //         }
  //       },
  //       yaxis: {
  //         axisBorder: {
  //           show: false
  //         },
  //         labels: {
  //           show: true
  //         },
  //       },
  //       legend: {
  //         floating: true,
  //         position: 'top',
  //         horizontalAlign: 'right',
  //         offsetY: -36
  //       },
  //       title: {
  //         text: 'Southbound',
  //         align: 'left',
  //       },
  //       tooltip: {
  //         shared: false,
  //         intersect: false
  //       }
  //   }
  //   var chartBar = new ApexCharts(document.querySelector('#barb'), optionsBarRight);
  //   chartBar.render();

  //   return d3.json(allDataUrl)
  //   })
  //   .then(function(allData) {
  //     let allDataDate = []
  //     let fremontTotal = []
  //     let burkeGilmanTotal = []
  //     let broadwayTotal = []
    
  //     allData.forEach((elem) => {
  //       // console.log({elem})
  //       allDataDate.push(elem.year);
  //       fremontTotal.push(elem.east);
  //       burkeGilmanTotal.push(elem.west);
  //       broadwayTotal.push(elem.total)
  //     });

  //     // Ideally would have daily data for every location in one graph
  //     var trace1 = {
  //       type: "scatter",
  //       mode: "lines",
  //       name: 'Total Bike Traffic',
  //       x: fremontDate,
  //       y: fremontTotal,
  //       line: {color: '#7F7F7F'}
  //     }

  //     var data = [trace1];
    
  //     var layout = {
  //       title: 'Total Bike Traffic',
  //       xaxis: {
  //         autorange: true,
  //         range: ['2014', '2021'],
  //         rangeselector: {buttons: [
  //             {
  //               count: 1,
  //               label: '1d',
  //               step: 'day',
  //               stepmode: 'backward'
  //             },
  //             {
  //               count: 1,
  //               label: '1w',
  //               step: 'week',
  //               stepmode: 'backward'
  //             },
  //             {
  //               count: 1,
  //               label: '1m',
  //               step: 'month',
  //               stepmode: 'backward'
  //             },
  //             {
  //               count: 6,
  //               label: '6m',
  //               step: 'month',
  //               stepmode: 'backward'
  //             },
  //             {
  //               count: 1,
  //               label: '1y',
  //               step: 'year',
  //               stepmode: 'backward'
  //             },
  //             {step: 'all'}
  //         ]},
  //         rangeslider: {range: ['2014', '2021']},
  //         type: 'date'
  //       },
  //       // yaxis: {
  //       //   autorange: true,
  //       //   range: [0, 1000],
  //       //   type: 'linear'
  //       // }
  //     }
  //     // console.log({broadwayDate})
  //     Plotly.newPlot("barbg", data, layout);
  //   });