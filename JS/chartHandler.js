/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

//# Using CanvasJS Library for the chart
$(()=>{

    async function getCompareData() {
        // Getting the favList (2D array) from local storage
        const favListArr = local.get("favList");

        // Using map to extract elements at index 2 from each sub-array, since we know the structure of the favListArr array
        const coinSymbolArr = favListArr.map(coinInfo => coinInfo[2])

        // Converting array to string, since the fsyms (from symbols) query parameter takes a string.
        // Note that all query strings and query paramaters need to be strings.
        const coinSymbolString = coinSymbolArr.toString();
        const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinSymbolString}&tsyms=USD,EUR,ILS`

        // Take the data from ajaxHandler.getJSON(url), which should be an object where the key is the symbol of the coin we sent and the properties of said object are the values in USD, EUR and ILS.
        // Example: {SYMBOL: {USD: XXX, EUR: XXX, ILS: XXX}}
        // Then convert it to a 2D array, where array[0] is a subarray containing the aformentioned key at subarray[0] and an object containing the values at subarray[1]
        // Example:[[SYMBOL1, {USD: XXX, EUR: XXX, ILS: XXX}],[SYMBOL2, {USD: XXX, EUR: XXX, ILS: XXX}]]
        const cryptoObject = await ajaxHandler.getJSON(url)
        const comparedData = []
        for (const key in cryptoObject) {
            comparedData.push([key,cryptoObject[key]])
        }

        //? Should I store the data in storage so we can store the info we have tracked for favorited coins, past and present?
        return comparedData
    }

    async function createDataPoints(){
        getCompareData();
        //TODO For each array in comparedData, make a new dataPoints[i] and update options.data with the information for each coin.


    }

    createDataPoints();

    // TODO to change the options of the graph. options is an object, so afterwards we need to update it via options.data and options.axisY
    async function updateDataOptions(){
        const comparedData = await getCompareData()

        const options = {
            title: {
                text: "Current Data"
            },
            axisX: {
                title: "Time",
                gridThickness: 1,
                // valueFormatString: "DDD MMM YYYY"
                valueFormatString: "HH:mm:ss"
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
                itemclick: function(e){
                    alert( "Legend item clicked with type : " + e.dataSeries.type);
                }
            },
            // TODO to change the data. Can be accessed via options.data
            data: [{
                type: "line",
                yValueFormatString: "$###.####",
                showInLegend: true,
                name: "Coin 1",
                dataPoints: dataPoints1
            },]
        };

        // Initializing the optionsData array, then for each coin in the comparedData array push their respective options.
        // The name will be comparedCoin[0], which is the Symbol.
        // The dataPoints is an array of objects. The object is comparedCoin[1], which is the currencies.

        // options.data is an array of objects, each detailing how each dataPoint or tracked coin looks
        const optionsData = []
        for (let i = 0; i < comparedData.length; i++) {
            const comparedCoin = comparedData[i];
            
            optionsData.push({
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "$###.####",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: comparedCoin[0],
                dataPoints: [comparedCoin[1].USD],
            }) 
            
        }

        // Currently only displaying USD data, so the optionsAxisY prefix will be $ instead of {chosenCurrency}
        const optionsAxisY = 
            {
                title: "Price",
                // prefix: "{chosenCurency}",
                prefix: "$",
                includeZero: true
            }
            
        return [optionsData, optionsAxisY];
    }

    // TODO According to what the user chooses, display a different currency
    async function chooseCurrencyToDisplay(currency){
        switch (currency) {
            case "USD":
                return "USD";
            case "EUR":
                return "EUR";
            case "ILS":
                return "ILS";
            default:
                return "USD";
        }
    }

    async function renderCoinChart(){
        // Each data point is an array of objects, where the data point represents the coin and the object is how the value of the coin. Each object is in format {x: new Date, y: value};
        //? For example: {x: ${unix timestamp}, y: 5000 }
        const dataPoints1 = [{x: new Date, y: 10}];
        const chosenCurrency = "$"
        const coinSymbol = "PLACEHOLDER_SYMBOL"
        const options = {
            title: {
                text: "Current Data"
            },
            axisX: {
                title: "Time",
                gridThickness: 1,
                // valueFormatString: "DDD MMM YYYY"
                valueFormatString: "HH:mm:ss"
            },
            axisY: {
                title: "Price",
                prefix: chosenCurrency,
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
                itemclick: function(e){
                    alert( "Legend item clicked with type : " + e.dataSeries.type);
                }
            },
            // TODO to change the data. Can be accessed via options.data
            data: [{
                type: "line",
                yValueFormatString: chosenCurrency + "###.####",
                showInLegend: true,
                name: coinSymbol,
                dataPoints: dataPoints1
            },]
        };
        
        const chart = new CanvasJS.Chart("chartContainer", options);
        
        // TODO make initial value the first value we get from the comparedData function
        // Initial yValue of the corresponding dataPoint
        let yValue1 = dataPoints1[0].y;
        
        let time = new Date;

        const updateInterval = 2000;
        
        function updateChart(count) {
            count = count || 1;
            let deltaY1;
            for (let i = 0; i < count; i++) {
                time.setTime(time.getTime() + updateInterval);

                // Random delta y
                deltaY1 = Math.random() > 0.5? Math.random()*1 : -1*Math.random()*1;
                
                // Adding random value to yValue1 and if it is less than 0, make it 0. 
                const updatedValue = (yValue1 + deltaY1)
                yValue1 = updatedValue < 0 ? 0 : updatedValue;
                
                // TODO make the new values the latest update we get from the comparedData function
                // Pushing the new values to the dataPoint
                dataPoints1.push({
                    x: time.getTime(),
                    y: yValue1
                });
            }
        
            // TODO Update the created dataPoints
            // Updating legend text with updated yValu, where the yValue in the legend is capped at 11 significant figures
            function numToSigFigs(value){
                return parseFloat(value.toPrecision(11))
            }

            options.data[0].legendText = `${coinSymbol}: ${chosenCurrency}${numToSigFigs(yValue1)}`;
            chart.render();
        }

        // TODO Create function that does the updating
        // Generates first set of dataPoints 
        updateChart(1);
        setInterval(()=> updateChart(), updateInterval);
    }

    renderCoinChart()
    
})