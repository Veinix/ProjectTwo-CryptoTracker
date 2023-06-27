/// <reference path="jquery-3.7.0.js"/>

"use strict";

//# Main JS
$(() => {
    //Load coins on page visit
    //TODO On page refresh, display goes to the Home Page (Which is index.html). Implement local storage or cache to keep current page

    //TODO Create Storage System
    

    // # Test Functions
    handleHome()
    // Test Homepage with data from bitcoin stored locally
    async function handleHome() {
        // Get currencies
        // const coinsList = await getJSON("https://api.coingecko.com/api/v3/coins/list");
        const coinsList = await getJSON("/rawdata/coins/list.json");
        displayCoins(coinsList)
    }

    // Getting the price of the coin in USD, EUR and ILS + coin image
    let hasBeenClosed = true;
    async function handleMoreCoinData(coinID) {
        if (hasBeenClosed) {
            // const data = await getJSON(`https://api.coingecko.com/api/v3/coins/${coinID}?market_data=true`);
            const data = await getJSON("/rawdata/coins/bitcoin.json")
            let priceUSD = data.market_data.current_price.usd;
            let priceEUR = data.market_data.current_price.eur;
            let priceILS = data.market_data.current_price.ils;
            let coinImgSrc = data.image.large;
            
            const moreInfo = `
            <div class="card card-body p-0 pt-1 coin-card--collapse-content">
                <span class="fw-bold mb-0">${data.id} <span class="order-2 fw-bold text-black-50">${data.symbol}</span></span>
                <img src="${coinImgSrc}" class="coin-card--img">
                <span class="badge rounded-pill mb-2 coin-card--long-pill"> Current Price </span>
                <span class="mb-1">$${priceUSD.toLocaleString()}</span>
                <span class="mb-1">€${priceEUR.toLocaleString()}</span>
                <span class="pb-1">₪${priceILS.toLocaleString()}</span>
            </div>
            `;
            $(`#collapse-${coinID}`).html(moreInfo);
            hasBeenClosed = false;
        } else {
            hasBeenClosed = true;
        }
    }

    // Function to display the coins in the coin container in the homepage
    async function displayCoins(coinsList) {
        let html = ``;
        // Bitcoin position in the list is 1123
        for (let i = 1123; i < 1124; i++) { // if i = 0, x is the max amount of cards displayed.
            
            // Coin components
            let coinID = coinsList[i].id
            let coinName = coinsList[i].name
            let coinSymbol = coinsList[i].symbol

            // Displaying the cards
            html += `
            <div class="col">
                <div class="card coin-card d-flex">
                    <div class="collapse coin-card--collapse" id="collapse-${coinID}">
                        <div class="loading-container w-100">
                            <div class="loading-spinner"></div>
                            <span class="pt-2"> Loading...</span>
                        </div>
                    </div>

                    <div class="card-body d-flex flex-column justify-content-between">
                        <div class="coin-card--header">
                            <span class="badge rounded-pill coin-card--coin-rank">&nbsp;</span>
                            <div class="form-check form-switch coin-card--favtoggle-div">
                                <input class="form-check-input coin-card--favtoggle" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                            </div>
                        </div>
                        <h3 class="card-title mb-1 text-center">${coinSymbol}</h3>
                        <h4 class="card-subtitle mb-3">${coinName}</h4>
                    </div>

                    <div class="card-footer">
                        <button class="badge coin-card--more-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${coinID}" id="moreInfo-${coinID}">
                            More Info
                        </button>
                    </div>
                </div>
                </div>
            `;
        }
                
        $("#home--coins-container").html(html);
    }

    // Getting data from API
    async function getJSON(url) {
        const response = await fetch(url);
        console.count("API Calls") // Counting the calls we make
        const json = await response.json();
        return json;
    }

    // Nav Pills Functionality
    $("a.nav-link").on("click", function () {
        // Changing which tab is highlighted
        $("a.nav-link").removeClass("active");
        $(this).addClass("active");

        // Display correct section
        const sectionID = $(this).attr("data-section");
        $("section").removeClass("d-flex");
        $("section").hide();
        $("#" + sectionID).addClass("d-flex");
        $("#" + sectionID).show();
    })

    // On clicking more info, getting the ID of the coin.
    $("#home--coins-container").on("click", ".badge.coin-card--more-info", async function(){
        const coinID = $(this).attr("id").substring(9);
        await handleMoreCoinData(coinID);
    })

    // On click of the nav-tabs, do a thing
    $("#homeLink").click(async () => await handleHome());
    $("#reportsLink").click(() => {console.log("Reports Clicked")})
    $("#aboutLink").click(() => {console.log("About Clicked")})
});

    