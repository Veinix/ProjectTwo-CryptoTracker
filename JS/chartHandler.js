/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

//# Using CanvasJS Library for the chart
$(()=>{
    
    async function getCompareData() {
        // Getting the favList (2D array) from local storage
        const favListArr = storageHandler.get("favList");

        // Using map to extract elements at index 2 from each sub-array, since we know the structure of the favListArr array
        const coinSymbolArr = favListArr.map(coinInfo => coinInfo[2])

        // Converting array to string, since the fsyms (from symbols) query parameter takes a string.
        // Note that all query strings and query paramaters need to be strings.
        const coinSymbolString = coinSymbolArr.toString();
        const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinSymbolString}&tsyms=USD`

        // Take the data from ajaxHandler.getJSON(url), which should be an object where the key is the symbol of the coin we sent and the properties of said object are the values in USD, EUR and ILS.
        //? Example: {SYMBOL: {USD: XXX, EUR: XXX, ILS: XXX}}
        // Then convert it to a 2D array, where array[i] is a subarray containing the aformentioned key at subarray[0] and an object containing the values at subarray[1]
        //? Example:[[SYMBOL1, {USD: XXX, EUR: XXX, ILS: XXX}],[SYMBOL2, {USD: XXX, EUR: XXX, ILS: XXX}]]
        const cryptoObject = await ajaxHandler.getJSON(url)
        const comparedData = []
        for (const key in cryptoObject) {
            comparedData.push([key,cryptoObject[key]])
        }
        return comparedData
    }

    async function updateDataOptions(comparedData){
        const options = {
            title: {
                text: "Current Data"
            },
            axisX: {
                title: "Time",
                gridThickness: 1,
                labelAngle: -30,
            },
            axisY: {
                title: "Price",
                prefix: "$",
                includeZero: true
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 22,
                fontColor: "dimGrey",
                itemclick: toggleDataSeries
            },
        };

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    
        // Initializing the optionsData array, then for each coin in the comparedData array push their respective options.
        // options.data is an array of objects, each detailing how each dataPoint or tracked coin looks
        const optionsData = []
        for (let i = 0; i < comparedData.length; i++) {
            const comparedCoinArr = comparedData[i];
            const comparedCoinSymbol = comparedCoinArr[0]
            optionsData.push({
                type: "line",
                yValueFormatString: "$" + "#.####",
		        showInLegend: true,
                name: comparedCoinSymbol,
                dataPoints: [],
            }) 
            
        }

        options.data = optionsData
        return options;
    }
    
    async function createInitialDataPoints(comparedData){
        // Each data point is an array of objects, where the data point represents the coin and the object is how the value of the coin. Each object is in the format {x: new Date, y: value};
        //? Example: {x: ${unix timestamp}, y: 5000 }

        // comparedData is a complex array
        //? Example:[[SYMBOL1, {USD: XXX, EUR: XXX, ILS: XXX}],[SYMBOL2, {USD: XXX, EUR: XXX, ILS: XXX}]]

        const dataPoints = []
        for (let i = 0; i < comparedData.length; i++) {
            const comparedCoinArr = comparedData[i];
            const comparedCoinSymbol = comparedCoinArr[0]
            const comparedCoinValue = comparedCoinArr[1].USD
            dataPoints.push([comparedCoinSymbol, [{y: comparedCoinValue}]])
        }

        // dataPoints is a complex array where dataPoints[i] is an array wherein dataPoints[i][0] is the coin symbol and dataPoints[i][1] is an array of objects, in the format {x: new Date, y: value};
        //? Example: [[SYMBOL1, [{x: ${unix timestamp}, y: YYY},{x: ${unix timestamp}, y: XXX},{x: ${unix timestamp}, y: ZZZ}]]]
        return dataPoints
    }


    async function renderCoinChart(){
        const comparedData = await getCompareData()
        const options = await updateDataOptions(comparedData)
        
        const chart = new CanvasJS.Chart("chartContainer", options);
        chart.render();
        
        // Initial values
        const initialDataPoints = await createInitialDataPoints(comparedData);
        for (let i = 0; i < initialDataPoints.length; i++) {
            let coinDataPoint = initialDataPoints[i];
            let yValue = coinDataPoint[1][0].y
            let coinSymbol = coinDataPoint[0]
            options.data[i].legendText = `${coinSymbol}: ${options.axisY.prefix}${yValue}`;

            options.data[i].dataPoints.push({
                x: new Date,
                y: yValue
            })
        }
        
        // Dynamically updated values
        const updateInterval = 2000;
        async function updateChart() {
            const updatedCompareData = await getCompareData()
            const updatedDataPoints = await createInitialDataPoints(updatedCompareData);
            for (let i = 0; i < updatedDataPoints.length; i++) {
                let coinDataPoint = updatedDataPoints[i];
                let yValue = coinDataPoint[1][0].y
                let coinSymbol = coinDataPoint[0]
                options.data[i].legendText = `${coinSymbol}: ${options.axisY.prefix}${yValue}`;
    
                if ( options.data[i].dataPoints.length >= 10 ){
                    options.data[i].dataPoints.shift({
                        x: new Date,
                        y: yValue
                    })
                } else {
                    options.data[i].dataPoints.push({
                        x: new Date,
                        y: yValue
                    })
                }
            }
            chart.render();
        }

        setInterval(async ()=> await updateChart(), updateInterval);
    }

    (()=>{
        const favListArr = storageHandler.get("favList");
        if (!favListArr) {
            const loadingSpinner = 
            `<div class="loading-container w-100 h-100">
            <div class="loading-spinner"></div>
            <span class="pt-2"> Loading...</span>
            </div>`;
            $("#chartContainer").html(loadingSpinner)
        }
        else renderCoinChart();
    })();
})