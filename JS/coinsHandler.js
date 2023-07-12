/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";


const coinsHandler = (()=>{
        // Handles requests for more coin data such as price in USD or Thumbnail then displays the data in the correct container
        // Called when the "More Info" button on a card is clicked
        async function moreInfo(coinID) {
            if (coinID.indexOf("_SPACE_") >= 0) {
                coinID = coinID.replace(/_SPACE_/g, " ");
            }
            console.log(coinID)
            const url = `https://api.coingecko.com/api/v3/coins/${coinID}?market_data=true`;
            console.log(url)
            const moreData = await timeStamp.get(`moreInfo-${coinID}`, url)
            // Paths to the prices and image
            const priceUSD = moreData.market_data.current_price.usd;
            const priceEUR = moreData.market_data.current_price.eur;
            const priceILS = moreData.market_data.current_price.ils;
            const coinImgSrc = moreData.image.large;
            
            let coinSymbol = moreData.symbol;
            let coinName = moreData.name;
            
            const moreInfo = `
            <div class="card card-body p-0 pt-1 collapse-content">
            <div class="collapse-content--header">
                    <span class="fw-bold mb-0" id="collapseheader-${coinID}">${coinName} <span class="order-2 fw-bold text-black-50" id="collapsesubheader-${coinID}">${coinSymbol}</span></span>
                    </div>
                <img src="${coinImgSrc}" class="coin-card--img">
                <span class="badge rounded-pill mb-2 coin-card--long-pill"> Current Price </span>
                <span class="mb-1">${priceUSD.toLocaleString("en-us", { style: "currency", currency: "USD", maximumFractionDigits: 20 })}</span>
                <span class="mb-1">${priceEUR.toLocaleString("en-us", { style: "currency", currency: "EUR", maximumFractionDigits: 20 })}</span>
                <span class="pb-1">${priceILS.toLocaleString("en-us", { style: "currency", currency: "ILS", maximumFractionDigits: 20 })}</span>
            </div>`;
            
            $(`#collapse-${coinID}`).html(moreInfo);
        }
    
        // Function to display the coins in the coin container on the homepage
        // Called by the `handleHome` function.
        async function display(coinsList) {
            // Setting range of coins. Bitcoin is around 1114
            let start = 0;
            let end = coinsList.length > 200 ? 200 : coinsList.length;
            
            // Variable to hold the HTML content
            let html = ``;

            for (let i = start; i < end; i++) {
                
                let coinID = coinsList[i].id

                // Some coingecko coin IDs contain spaces. When displaying them, add a special string that will be removed when sending it to the API.
                if (coinID.indexOf(" ") >= 0) {
                    coinID = coinID.replace(/ /g, "_SPACE_");
                }

                let coinName = coinsList[i].name
                let coinSymbol = coinsList[i].symbol
                
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
                                    <input class="form-check-input coin-card--favtoggle" type="checkbox" id="switch-${coinID}">
                                    </div>
                            </div>
                            <div class="mt-3 d-flex flex-column">
                            <div class="mb-2 coin-card--title-container">
                            <h3 id="title-${coinID}">${coinSymbol}</h3>
                            </div>
                            <div class="coin-card--subtitle-container">
                            <h4 id="subtitle-${coinID}">${coinName}</h4>
                            </div>
                            </div>
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

            // Displaying the cards
            $("#home--coins-container").html(html);

            // Shows that favorites are selected (Keeping them toggled after refresh)
            for (let i = start; i < end; i++) {
                let favListArr = local.get("favList")
                if (!favListArr) return;
                for (let j = 0; j < favListArr.length; j++) {
                    const storedCoinID = favListArr[j][0]
                    let coinID = coinsList[i].id
                    if (coinID.indexOf(" ") >= 0) {
                        coinID = coinID.replace(/ /g, "_SPACE_");
                    }
                    if (storedCoinID === coinID) {
                        $(`#switch-${coinID}`).prop("checked", !($(`#switch-${coinID}`).prop("checked")));
                    }
                }
            }
        }

    return { 
        display: display,
        moreInfo: moreInfo
    };

})()

$(()=>{
    // On "More Info" click, gets more information with the ID of the coin.
    $("#home--coins-container").on("click", ".badge.coin-card--more-info", async function () {
        const coinID = $(this).attr("id").substring(9);
        await coinsHandler.moreInfo(coinID);
    })
})
