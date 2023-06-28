window.Apex = {
  dataLabels: {
    enabled: false
  }
};

var chartBarLeft = []
var optionsBarLeft = []
var optionsBarRight = []
var chartBarRight = []

var totalLayout = []
var totalChartData = []
var trace1 = []

function init(){
  optionsBarLeft = {
    chart: {
      type: 'bar',
      height: 250,
      width: '100%',
      stacked: true,
      foreColor: '#000000',
    },
    dataLabels: {
        enabled: false
    },
    series: [],
    title: {
        text: 'Bike Traffic',
    },
    noData: {
      text: 'Choose a Location...'
    }
  }
  chartBarLeft = new ApexCharts(document.querySelector("#bar"), optionsBarLeft);
  chartBarLeft.render();

  optionsBarRight = {
    chart: {
      type: 'bar',
      height: 250,
      width: '100%',
      stacked: true,
      foreColor: '#000000',
    },
    dataLabels: {
        enabled: false
    },
    series: [],
    title: {
        text: 'Bike Traffic',
    },
    noData: {
      text: 'Choose a Location...'
    }
  }
  chartBarRight = new ApexCharts(document.querySelector("#barb"), optionsBarRight);
  chartBarRight.render();

  totalLayout = {
    title: 'Total Bike Traffic',
    xaxis: {
      autorange: true,
      range: ['2014', '2021'],
      rangeselector: {buttons: [
          {
            count: 1,
            label: '1d',
            step: 'day',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: '1w',
            step: 'week',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 6,
            label: '6m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: '1y',
            step: 'year',
            stepmode: 'backward'
          },
          {step: 'all'}
      ]},
      rangeslider: {range: ['2014', '2021']},
      type: 'date'
    },
    yaxis: {
      autorange: true,
      range: [0, 1000],
      type: 'linear'
    }
  }
  totalChartData = [{}]
  Plotly.newPlot("barbg", totalChartData, totalLayout);
};

d3.selectAll('#selLocation').on("change", updateVisuals);
d3.selectAll('#selTimeScale').on("change", updateVisuals);

function updateVisuals() {
  // Use D3 to select the dropdown menu
  let dropdownMenuLocation = d3.select("#selLocation");
  let dropdownMenuTimeScale = d3.select("#selTimeScale");
  // Assign the value of the dropdown menu option to a variable
  let location = dropdownMenuLocation.property("value");
  let timescale = dropdownMenuTimeScale.property("value");

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
    if (timescale == 'Year') {
      jsonUrl = "/api/broadway_year";
    }
    else if (timescale == 'Month') {
      jsonUrl = "/api/broadway_month";
    }

    d3.json(jsonUrl)
      .then(function(data) {
        data.forEach((elem) => {
          dataDates.push(elem.year);
          dataDirectionOne.push(elem.north_bike);
          dataDirectionTwo.push(elem.south_bike);
          dataTotal.push(elem.total);
        });
        leftYData = dataDirectionOne;
        leftXData = dataDates;
        rightYData = dataDirectionTwo;
        rightXData = dataDates;

        chartBarLeft.updateSeries([{
          data: leftYData
        }]);
        chartBarLeft.updateOptions({
          chart: {
                type: 'bar',
                height: 250,
                width: '100%',
                stacked: true,
                foreColor: '#999',
          },
          animations:{
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
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
        });

        chartBarRight.updateSeries([{
          data: rightYData
        }]);
        chartBarRight.updateOptions({
          chart: {
              type: 'bar',
              height: 250,
              width: '100%',
              stacked: true,
              foreColor: '#999',
            },
            animations:{
              enabled: true,
              easing: 'easeinout',
              speed: 800,
              animateGradually: {
                  enabled: true,
                  delay: 150
              },
              dynamicAnimation: {
                  enabled: true,
                  speed: 350
              }
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
              text: 'South Bound',
              align: 'left',
            },
            tooltip: {
              shared: false,
              intersect: false
            }
        });

        trace1 = {
          type: "scatter",
          mode: "lines",
          name: 'Total Bike Traffic',
          x: leftXData,
          y: dataTotal,
          line: {color: '#30b842'}
        }
      
        totalChartData = [trace1];
        Plotly.newPlot("barbg", totalChartData, totalLayout);

      });
  }

  else if (location == 'Fremont') {
    // Fremont
    if (timescale == 'Year') {
      jsonUrl = "/api/fremont_year";
    }
    else if (timescale == 'Month') {
      jsonUrl = "/api/fremont_month";
    }

    d3.json(jsonUrl)
      .then(function(data) {
        data.forEach((elem) => {
          dataDates.push(elem.year);
          dataDirectionOne.push(elem.east);
          dataDirectionTwo.push(elem.west);
          dataTotal.push(elem.total);
        });
      leftYData = dataDirectionOne;
      leftXData = dataDates;
      rightYData = dataDirectionTwo;
      rightXData = dataDates;

      chartBarLeft.updateSeries([{
        data: leftYData
      }]);
      chartBarLeft.updateOptions({
        chart: {
          type: 'bar',
          height: 250,
          width: '100%',
          stacked: true,
          foreColor: '#999',
        },
        animations:{
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
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
          text: 'East Bound',
          align: 'left',
        },
        tooltip: {
          shared: true,
          intersect: false
        }
      });

      chartBarRight.updateSeries([{
        data: rightYData
      }]);
      chartBarRight.updateOptions({
        chart: {
            type: 'bar',
            height: 250,
            width: '100%',
            stacked: true,
            foreColor: '#999',
          },
          animations:{
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
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
            text: 'West Bound',
            align: 'left',
          },
          tooltip: {
            shared: false,
            intersect: false
          }
      });
      trace1 = {
        type: "scatter",
        mode: "lines",
        name: 'Total Bike Traffic',
        x: leftXData,
        y: dataTotal,
        line: {color: '#30b842'}
      }
    
      totalChartData = [trace1];
      Plotly.newPlot("barbg", totalChartData, totalLayout);
    });
  }

  else if (location == 'Burke Gilman') {
    // Burke Gilman
    if (timescale == 'Year') {
      jsonUrl = "/api/burkegilman_year";
    }
    else if (timescale == 'Month') {
      jsonUrl = "/api/burkegilman_month";
    }
    
    d3.json(jsonUrl)
      .then(function(data) {
        data.forEach((elem) => {
          dataDates.push(elem.year);
          dataDirectionOne.push(elem.bike_north);
          dataDirectionTwo.push(elem.bike_south);
          dataTotal.push(elem.total);
        });
      leftYData = dataDirectionOne;
      leftXData = dataDates;
      rightYData = dataDirectionTwo;
      rightXData = dataDates ;

      chartBarLeft.updateSeries([{
        data: leftYData
      }]);
      chartBarLeft.updateOptions({
        chart: {
              type: 'bar',
              height: 250,
              width: '100%',
              stacked: true,
              foreColor: '#999',
        },
        animations:{
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
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
          text: 'North bound',
          align: 'left',
        },
        tooltip: {
          shared: true,
          intersect: false
        }
      });

      chartBarRight.updateSeries([{
        data: rightYData
      }]);
      chartBarRight.updateOptions({
        chart: {
            type: 'bar',
            height: 250,
            width: '100%',
            stacked: true,
            foreColor: '#999',
          },
          animations:{
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
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
            text: 'South Bound',
            align: 'left',
          },
          tooltip: {
            shared: false,
            intersect: false
          }
      });
      trace1 = {
        type: "scatter",
        mode: "lines",
        name: 'Total Bike Traffic',
        x: leftXData,
        y: dataTotal,
        line: {color: '#30b842'}
      }
    
      totalChartData = [trace1];
      Plotly.newPlot("barbg", totalChartData, totalLayout);
    });
  }
};


init();