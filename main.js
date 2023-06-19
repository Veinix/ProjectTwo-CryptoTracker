/// <reference path="jquery-3.7.0.js"/>

"use strict";

//# Main JS
$(() => {
    //Load coins on page visit
    //! On page refresh, causes the display to go to the Home Page
    handleHome()

    // Function handling currencies and everything in homepage
    async function handleHome() {
        // Get currencies
        // const coins = await getJSON("https://api.coingecko.com/api/v3/coins/list");
        const coins = await getJSON("/rawdata/coins/list.json");
        // Display coins
        displayCoins(coins);
    }

    // Function to display coins
    function displayCoins(coins) {
        // Limiting length of the id
        coins = coins.filter(coin => coin.id.length <= 7);
        let html = ``;
        // i < x where x is the max amount of cards I want to display.
        for (let i = 0; i < 12; i++) {
            // Displaying the cards
            html += `
            <div class="col">
                <div class="card coin-card d-flex">
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
                        <span class="badge coin-card--more-info">More Info</span>
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
    