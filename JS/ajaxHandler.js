/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

const timeStamp = (()=>{

    // AJAX GET Request
    async function getJSON(url) {
        try {
            const response = await $.ajax({
                url: url,
                dataType: "json",
            })

            return response
        } catch (error) {
            return await handleErrors(error, url);
        }
    }

    // No way to catch CORs errors client-side.
    // Handling errors from the catch block, and responding to them
    async function handleErrors(error, url){
        if (error.status === 429) {
            console.log("429 Status Error: Too Many Requests");
            console.log("Error: ", error);
            
        } else if (error.status < 100 || error.status > 599) {
            console.log("Non-Standard HTTP Status Error Caught", "\n Status code: " + error.status);
            console.log("Error: ", error);
            
        } else if (error.status >= 100 || error.status <= 599) {
            console.log("Standard HTTP Status Error Caught", "\n Status code: " + error.status);
            console.log("Error: ", error);
        }
        console.log("Trying again in 20 seconds")
        await wait(20000);
        return getJSON(url)
    }

    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    // Timestamp Handler to check if data in local storage has been updated recently.
    // If more than two minutes have passed, performs a GET request from the url and updates the entry in local storage
    async function get(entryKey, url) {
        if (local.get(entryKey) === null || local.get(entryKey)[0] === null) {
            const data = await getJSON(url);
            const newTimestamp = Date.now();
            local.add(entryKey, [data, newTimestamp])

            return (local.get(entryKey))[0];
        }

        const oldTimestamp = (local.get(entryKey))[1];
        const currentTime = Date.now();
        const timeElapsed = (currentTime - oldTimestamp) / 1000;

        if (timeElapsed >= 120) {
            const data = await getJSON(url);
            const newTimestamp = Date.now();
            local.add(entryKey, [data, newTimestamp])

            return (local.get(entryKey))[0];

        } else return (local.get(entryKey))[0];
    }

    return {
        get: get
    }
    
})();
