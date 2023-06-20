/// <reference path="jquery-3.7.0.js"/>

"use strict";

//# Main JS
$(() => {
    //Load coins on page visit
    //! On page refresh, causes the display to go to the Home Page
    // handleHome()

    // # Test Functions
    homepageTest()
    // Test Homepage with data from bitcoin stored locally
    async function homepageTest() {
        // Get currencies
        const coinsList = await getJSON("https://api.coingecko.com/api/v3/coins/list");
        // const coinsList = await getJSON("/rawdata/coins/list.json");
        displayCoinsTest(coinsList)
    }

    // Getting the daily prices for the last 7 days
    async function pastWeekPrices(coinID) {
        const weekPrices = await getJSON(`https://api.coingecko.com/api/v3/coins/${coinID}/market_chart?vs_currency=usd&days=6&interval=daily`);
        // const weekPrices = await getJSON("/rawdata/coins/market_chart.json")
        let weekHigh = weekPrices.prices[0][1];
        let weekLow = weekPrices.prices[0][1];
        for (let i = 0; i < 7; i++) {
            const coinPrice = weekPrices.prices[i][1];
            if (coinPrice > weekHigh) weekHigh = coinPrice;
            if (coinPrice < weekLow) weekLow = coinPrice;
        }

        // Formatting Data
        weekHigh.toFixed(2)
        weekLow.toFixed(2)
        return [weekHigh, weekLow];
    }

    // Getting the marketCapRank and price of the coin in USD, EUR and ILS
    async function moreCoinData(coinID) {
        const data = await getJSON(`https://api.coingecko.com/api/v3/coins/${coinID}?market_data=true`);
        // const data = await getJSON("/rawdata/coins/bitcoin.json")
        let marketCapRank = data.market_cap_rank;
        let priceUSD = data.market_data.current_price.usd;
        let priceEUR = data.market_data.current_price.eur;
        let priceILS = data.market_data.current_price.ils;
        return [priceUSD, priceEUR, priceILS, marketCapRank];
    }

    // Function to display the coins in the coin container in the homepage
    async function displayCoinsTest(coinsList) {
        let html = ``;
        // Bitcoin position in the list is 1123
        for (let i = 1120; i < 1124; i++) { // if i = 0, x is the max amount of cards displayed.
            
            // Coin components
            let coinID = coinsList[i].id
            let coinName = coinsList[i].name
            let coinSymbol = coinsList[i].symbol

            // More Data: Price of coin in USD, EUR, ILS; Market Cap Ranking; Weekly High and Low
            let moreCoinDataArr = await moreCoinData(coinID)
            console.log(moreCoinDataArr)
            let priceUSD = moreCoinDataArr[0].toLocaleString();
            let priceEUR = moreCoinDataArr[1].toLocaleString();
            let priceILS = moreCoinDataArr[2].toLocaleString();

            let marketCapRank = moreCoinDataArr[3]

            let weekHighLow = await pastWeekPrices(coinID)
            let weekHigh = weekHighLow[0].toLocaleString(); 
            let weekLow = weekHighLow[1].toLocaleString();

            // Displaying the cards
            html += `
            <div class="col">
                <div class="card coin-card d-flex">
                    <div class="collapse coin-card--collapse" id="collapse-${coinID}">
                        <div class="card card-body p-0 pt-1 coin-card--collapse-content">
                            <span class="fw-bold mb-0">${coinName} <span class="order-2 fw-bold text-black-50">${coinSymbol}</span></span>
                            <span class="badge rounded-pill mb-1 coin-card--long-pill"> Week High/Low </span>
                            <span class="mb-1">$${weekHigh}</span>
                            <span class="mb-1">$${weekLow}</span>
                            <span class="badge rounded-pill mb-2 coin-card--long-pill"> Current Price </span>
                            <span class="mb-1">$${priceUSD}</span>
                            <span class="mb-1">€${priceEUR}</span>
                            <span class="pb-1">₪${priceILS}</span>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div class="coin-card--header">
                            <span class="badge rounded-pill coin-card--coin-rank">Rank# ${marketCapRank}</span>
                            <div class="form-check form-switch coin-card--favtoggle-div">
                                <input class="form-check-input coin-card--favtoggle" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                            </div>
                        </div>
                        
                        <img src="https://placehold.co/100x100?text=COIN" class="coin-card--img">
                        <h5 class="card-title mb-1 text-center">${coinSymbol}</h5>
                        <h6 class="card-subtitle mb-3">${coinName}</h6>

                        
                    </div>
                    <div class="card-footer">
                        <button class="badge coin-card--more-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${coinID}">
                            More Info
                        </button>
                    </div>
                </div>
                </div>
            `;
        }
                
        $("#home--coins-container").html(html);
    }
    //# End of Test Functions ^^^^



    // Function handling currencies and everything in homepage
    async function handleHome() {
        // Get currencies
        // const coins = await getJSON("https://api.coingecko.com/api/v3/coins/list");
        const coins = await getJSON("/rawdata/coins/list.json");
        
        // Display coins
        displayCoins(coins);
    }

    // Function to display coins
    async function displayCoins(coins) {
        // Limiting length of the id
        // coins = coins.filter(coin => coin.id.length <= 7);
        let html = ``;
        // const lastWeekPricesJSON = await getJSON(`https://api.coingecko.com/api/v3/coins/${coins[i].id}/market_chart?vs_currency=usd&days=6&interval=daily`)
        // const weekPrices = lastWeekPricesJSON.prices;
        // const weekLow = weekPrices;
        // const weekHigh = weekPrices;
        
        // i < x where x is the max amount of cards I want to display.
        for (let i = 0; i < 12; i++) {
            // Displaying the cards
            html += `
            <div class="col">
                <div class="card coin-card d-flex">
                    <div class="collapse coin-card--collapse" id="collapse-${coins[i].id}">
                        <div class="card card-body p-0 pt-2 coin-card--collapse-content">
                            <span class="fw-bold mb-3">${coins[i].name} <span class="order-2 fw-bold text-black-50">${coins[i].symbol}</span></span>
                            <span class="mb-1">High</span>
                            <span class="mb-1">Low</span>
                            <span class="badge rounded-pill mb-2 coin-card--long-pill"> &nbsp;</span>
                            <span class="mb-1">USD</span>
                            <span class="mb-1">EURO</span>
                            <span class="pb-1">NIS</span>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div class="coin-card--header">
                            <span class="badge rounded-pill coin-card--coin-rank">coins[i].rank</span>
                            <div class="form-check form-switch coin-card--favtoggle-div">
                                <input class="form-check-input coin-card--favtoggle" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                            </div>
                        </div>
                        
                        <img src="https://placehold.co/100x100?text=COIN" class="coin-card--img">
                        <h5 class="card-title mb-1 text-center">${coins[i].symbol}</h5>
                        <h6 class="card-subtitle mb-3">${coins[i].name}</h6>

                        
                    </div>
                    <div class="card-footer">
                        <button class="badge coin-card--more-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${coins[i].id}">
                            More Info
                        </button>
                    </div>
                </div>
                </div>
            `;
        }
                   
        $("#home--coins-container").html(html);
    }

    // Getting moreInfo's data
    async function handleMoreInfo(coinId){
        const coin = await getJSON("https://api.coingecko.com/api/v3/coins/" + coinId);
        const imageSource = coin.image.thumb;
        const usd = coin.market_data.current_price.usd;
        const eur = coin.market_data.current_price.eur;
        const ils = coin.market_data.current_price.ils;
        const moreInfo = `
            <img src="${imageSource}">
            <p> USD: $${usd} </p>
            <p> EUR: &euro;${usd} </p>
            <p> ILS: &#8362;${usd} </p>
        `; 
        $(`#collapse_${coinId}`).children().html(moreInfo);
    }

    // Getting data from API
    async function getJSON(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    // Nav Pills Functionality
    $("a.nav-link").on("click", function () {
        // Changing which tab is highlighted
        $("a.nav-link").removeClass("active");
        $(this).addClass("active");

        // Display correct section
        //TODO Had little bug where jQuery tried to make the section display:none but the bootstrap class would override it
        const sectionID = $(this).attr("data-section");
        $("section").removeClass("d-flex");
        $("section").hide();
        $("#" + sectionID).addClass("d-flex");
        $("#" + sectionID).show();
    })

    // On clicking more info, getting the ID of the coin.
    $("#coinsContainer").on("click", ".more-info", async function(){
        const coinId = $(this).attr("id").substring(7);
        await handleMoreInfo(coinId);
    })

    // On click of the nav-tabs, do a thing
    $("#homeLink").click(async () => await handleHome());
    $("#reportsLink").click(() => {console.log("Reports Clicked")})
    $("#aboutLink").click(() => {console.log("About Clicked")})

});

//# --------------- #//
//# Dev Tools Below #// 
//# --------------- #//
// To access from the console, it must be global
function test(){
    console.log("Successfully called function `Test`");
}
    