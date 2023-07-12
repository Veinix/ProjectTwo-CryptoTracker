/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

//# Using CanvasJS Library for the graph
// graphContainer
// TODO make object?
const reportsGraphHandler = (()=>{
    
    let dataPoints1 = [];
    let dataPoints2 = [];
    let dataPoints3 = [];
    
    const options = {
        title: {
            text: "Electricity Generation in Turbine"
        },
        axisX: {
            title: "chart updates every 2 secs"
        },
        axisY: {
            suffix: "Wh"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00Wh",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: "Turbine 1",
            dataPoints: dataPoints1
        },
        {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00Wh",
            showInLegend: true,
            name: "Turbine 2",
            dataPoints: dataPoints2
        }, {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00Wh",
            showInLegend: true,
            name: "Turbine 2",
            dataPoints: dataPoints3
        }]
    };
    
    const chart = new CanvasJS.Chart("graphContainer", options);
    
    let updateInterval = 2000;

    // initial value
    let yValue1 = 800;
    let yValue2 = 810;
    let yValue3 = 780;
    
    let time = new Date;
    // starting at 10.00 am
    time.setHours(10);
    time.setMinutes(10);
    time.setSeconds(10);
    time.setMilliseconds(10);
    
    function updateChart(count) {
        count = count || 1;
        let deltaY1, deltaY2, deltaY3;
        for (let i = 0; i < count; i++) {
            time.setTime(time.getTime() + updateInterval);
            deltaY1 = -1 + Math.random() * (1 + 1);
            deltaY2 = -1 + Math.random() * (1 + 1);
            deltaY3 = -1 + Math.random() * (1 + 1);
    
            // Adding random value and rounding it to two digits. 
            yValue1 = Math.round((yValue1 + deltaY1) * 100) / 100;
            yValue2 = Math.round((yValue2 + deltaY2) * 100) / 100;
            yValue3 = Math.round((yValue3 + deltaY3) * 100) / 100;
    
            // pushing the new values
            dataPoints1.push({
                x: time.getTime(),
                y: yValue1
            });
            dataPoints2.push({
                x: time.getTime(),
                y: yValue2
            });
            dataPoints3.push({
                x: time.getTime(),
                y: yValue3
            });

            chart.render();
        }
    
        // Updating legend text with  updated with y Value 
        options.data[0].legendText = "Turbine 1 : " + yValue1 + "Wh";
        options.data[1].legendText = "Turbine 2 : " + yValue2 + "Wh";
        options.data[2].legendText = "Turbine 3 : " + yValue3 + "Wh";
        chart.render();
    }

    // Generates first set of dataPoints 
    updateChart(100);
    setInterval(updateChart(), updateInterval);

    $(window).on("resize", ()=> {
        const graphContainer = $("#graphContainer");
        const newWidth = graphContainer.innerWidth(); // Adjust this based on your layout
      
        // Set new dimensions for the chart container
        graphContainer.width(newWidth);      
        // Render the chart with the updated dimensions
        chart.render();
      });
})