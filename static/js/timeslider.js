let broadwayData_hourly = "/api/broadway_hourly";

d3.json(broadwayData_hourly)
    .then(function(broadwayDataHourly) {
        let broadwayDate = []
        let broadwayEB = []
        let broadwayWB = []
        let broadwayTotal = []
    
        broadwayDataHourly.forEach((elem) => {
        // console.log({elem})
        broadwayDate.push(elem.date);
        broadwayEB.push(elem.north);
        broadwayWB.push(elem.south);
        broadwayTotal.push(elem.total);
        });
        // Ideally would have daily data for every location in one graph
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'Total Bike Traffic',
            x: broadwayDate,
            y: broadwayTotal,
            line: {color: '#17BECF'}
        }

        var datatest = [trace1];
    
        var layouttime = {
        title: 'Total Bike Traffic',
        xaxis: {
            autorange: false,
            range: ['2012', '2023'],
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
            rangeslider: {range: ['2012', '2023']},
            type: 'date'
        },
        yaxis: {
            autorange: true,
            range: [0, 1000],
            type: 'linear'
        }
        };
        var layout = {
            title: 'Basic Time Series',
            xaxis: {
                autorange: false,
                range: ['2012', '2023'],
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
                rangeslider: {range: ['2012', '2023']},
                type: 'date'
            },
          };
        console.log({broadwayDate});
        console.log({broadwayTotal});
        console.log({datatest})
        Plotly.newPlot("barbg", datatest, layout);
    });