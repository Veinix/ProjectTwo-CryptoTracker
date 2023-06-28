/// <reference path="jquery-3.7.0.js"/>

"use strict";

//# Main JS
$(() => {
    //TODO On page refresh, display goes to the Home Page (Which is index.html). Implement local storage or cache to keep current page
    /**
     * Handles all processes related to the homepage.
     * 
     * Assigns the value returned from the `loadCoinList` function to the constant `coinsList` and then displays it using the `displayCoins(coinsList)` function
     * 
     * Called on page load
     *  
     * {@link retrieveCoinList}, {@link displayCoins}
     * 
     */
    async function handleHome() {
        const coinsList = await retrieveCoinList();
        displayCoins(coinsList)
    }

    /**
     * Retrieves `"Coin List"` data.
     * 
     * Called by the `handleHome` function
     * 
     * @returns {{}} Object containing coins
     * 
     * {@link getJSON}, {@link handleHome}, {@link timestampHandler}
    */
    async function retrieveCoinList() {
        if (lcl.retrieve("CoinsList") === null) {
            const coins = await getJSON("https://api.coingecko.com/api/v3/coins/list")
            const timeStamp = Date.now();
            lcl.store("CoinsList", [coins, timeStamp])
            
            const coinsList = lcl.retrieve("CoinsList");
            return coinsList[0];
        } else {
            const url = "https://api.coingecko.com/api/v3/coins/list";
            return timestampHandler("CoinsList", url);
        }
    }

    /**
     * Handles requests for more coin data such as price in USD or Thumbnail then displays the data in the correct container
     * 
     * Called when the "More Info" button on a card is clicked
     * 
     * @param {String} coinID - ID of desired coin
     * 
     * {@link timestampHandler}
     */
    async function handleMoreCoinData(coinID) {
        let moreData;

        if (lcl.retrieve(`moreInfo-${coinID}`) === null) {
            const coinData = await getJSON(`https://api.coingecko.com/api/v3/coins/${coinID}?market_data=true`);
            const timeStamp = Date.now();
            lcl.store(`moreInfo-${coinID}`, [coinData, timeStamp]);
            moreData = (lcl.retrieve(`moreInfo-${coinID}`))[0];
        } else {
            const url = `https://api.coingecko.com/api/v3/coins/${coinID}?market_data=true`;
            moreData = await timestampHandler(`moreInfo-${coinID}`, url)
        }

        // Paths to the prices and image
        const priceUSD = moreData.market_data.current_price.usd;
        const priceEUR = moreData.market_data.current_price.eur;
        const priceILS = moreData.market_data.current_price.ils;
        const coinImgSrc = moreData.image.large;
        
        const moreInfo = `
        <div class="card card-body p-0 pt-1 coin-card--collapse-content">
        <span class="fw-bold mb-0">${moreData.id} <span class="order-2 fw-bold text-black-50">${moreData.symbol}</span></span>
        <img src="${coinImgSrc}" class="coin-card--img">
        <span class="badge rounded-pill mb-2 coin-card--long-pill"> Current Price </span>
        <span class="mb-1">${priceUSD.toLocaleString("en-us",{style:"currency",currency:"USD",maximumFractionDigits:20})}</span>
        <span class="mb-1">${priceEUR.toLocaleString("en-us",{style:"currency",currency:"EUR",maximumFractionDigits:20})}</span>
        <span class="pb-1">${priceILS.toLocaleString("en-us",{style:"currency",currency:"ILS",maximumFractionDigits:20})}</span>
        </div>`;

        $(`#collapse-${coinID}`).html(moreInfo);
    }

    /**
     * Function to display the coins in the coin container on the homepage
     * 
     * Called by the `handleHome` function.
     * 
     * @param {{}} coinsList - coinsList from API/Local Storage
     * 
     * {@link handleHome}
     */
    async function displayCoins(coinsList) {
        // Getting random coins every time the list is displayed
        let randEnd = Math.floor(Math.random()*9949)+1
        let randStart = randEnd - 100;

        let html = ``;
        // Bitcoin position in the list is 1123
        for (let i = 0; i < 1; i++) { // if i = 0, x is the max amount of cards displayed.
            
            let coinID = coinsList[i].id
            let coinName = coinsList[i].name
            let coinSymbol = coinsList[i].symbol

            resizeText(coinID)

            html += `
            <div class="col">
                <div class="card coin-card d-flex">
                    <div class="collapse coin-card--collapse" id="collapse-${coinID}">
                        <div class="loading-container w-100">
                            <div class="loading-spinner"></div>
                            <span class="pt-2"> Loading...</span>
                        </div>
                    </div>

                    <div class="card-body d-flex flex-column">
                        <div class="coin-card--header">
                            <span class="badge rounded-pill coin-card--coin-rank">&nbsp;</span>
                            <div class="form-check form-switch coin-card--favtoggle-div">
                                <input class="form-check-input coin-card--favtoggle" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                            </div>
                        </div>
                        <h3 class="my-3 text-center" id="title-${coinID}">${coinSymbol}</h3>
                        <h4 class="mt-4" id="subtitle-${coinID}">${coinName}</h4>
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

    /**
     * Handler checking if data in local storage has been updated recently. 
     * 
     * If more than two minutes have passed, updates the 
     * 
     * Tries to retrieve the entry and locate it's timestamp to compare to current time
     * 
     * @param {string} Entry Key of entry
     * @param {string} URL API request url
     * 
     * @returns Requested entry
     */
    async function timestampHandler(entry, url) {
        const oldTimestamp =  (lcl.retrieve(entry))[1];
        const currentTime = Date.now();
        const timeElapsed = (currentTime - oldTimestamp) / 1000;
    
        if (timeElapsed >= 120) { 
            const data = await getJSON(url);
            const newTimestamp = Date.now();
            lcl.store(entry, [data, newTimestamp])
        
            return (lcl.retrieve(entry))[0];

        } else return (lcl.retrieve(entry))[0];
    }

    /**
     * Function that fetches data from an API or other sources. Counts in the console the amount of calls made, to give an indication if too many calls are being made
     * 
     * Called by the `loadCoinList`, `handleMoreCoinData`, `moreDataTimestampHandler` functions
     *  
     * @param url - Path to resource
     * @returns JSON object with requested data
     * 
     * {@link loadCoinList}, {@link handleMoreCoinData}, {@link moreDataTimestampHandler}
     */
    async function getJSON(url) {
        return $.ajax({
            url: url,
            dataType: 'json'})
        .done(()=> console.count("API Calls")); 
    }

    /**
     * Function to resize a text element that is too long for it's container or position
     * 
     * @param {string} id ID of the element
     */
    function resizeText(id) {
        const textElement = $(`#${id}`);
        const containerWidth = textElement.innerWidth(); // Using innerWidth to include padding
        const textWidth = textElement.scrollWidth;

        if (textWidth > containerWidth) {
        const fontSize = parseInt(textElement.css("font-size"));
        const newFontSize = fontSize * (containerWidth / textWidth);
        textElement.css("font-size", newFontSize + "px");
        }
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

    // On "More Info" click, gets more information with the ID of the coin.
    $("#home--coins-container").on("click", ".badge.coin-card--more-info", async function(){
        const coinID = $(this).attr("id").substring(9);
        await handleMoreCoinData(coinID);
    })

    // On click of the nav-tabs, perform action according to the tab
    $("#homeLink").click(async () => await handleHome());
    $("#reportsLink").click(() => {console.log("Reports Clicked")})
    $("#aboutLink").click(() => {console.log("About Clicked")})

    // Reset API Calls counter every 30 seconds
    setInterval(console.countReset("API Calls"), 30000);

    //# On page load
    handleHome()
});

    