/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

const timeStamp = (()=>{

    // AJAX GET Request
    async function getJSON(url) {
        return $.ajax({
            url: url,
            dataType: 'json'
        })
    }

    // Timestamp Handler to check if data in local storage has been updated recently.
    // If more than two minutes have passed, performs a GET request from the url and updates the entry in local storage
    async function get(entryKey, url) {
        if (local.get(entryKey) === null) {
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
