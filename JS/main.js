/// <reference path="jquery-3.7.0.js"/>

"use strict";

//# Main JS
$(() => {
    
    // Handles all processes related to the homepage.
    // Assigns the value returned from the `loadCoinList` function to the constant `coinsList` and then displays it using the `displayCoins(coinsList)` function
    // Called on page load
    async function handleHome() {
        const url = "https://api.coingecko.com/api/v3/coins/list";
        const coinsList = await timestampHandler("coinsList", url);
        displayCoins(coinsList)
    }


    // Handles requests for more coin data such as price in USD or Thumbnail then displays the data in the correct container
    // Called when the "More Info" button on a card is clicked
    async function handleMoreCoinData(coinID) {
        const url = `https://api.coingecko.com/api/v3/coins/${coinID}?market_data=true`;
        let moreData = await timestampHandler(`moreInfo-${coinID}`, url)

        // Paths to the prices and image
        const priceUSD = moreData.market_data?.current_price.usd ?? "N/A";
        const priceEUR = moreData.market_data?.current_price.eur ?? "N/A";
        const priceILS = moreData.market_data?.current_price.ils ?? "N/A";
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
    // On "More Info" click, gets more information with the ID of the coin.
    $("#home--coins-container").on("click", ".badge.coin-card--more-info", async function () {
        const coinID = $(this).attr("id").substring(9);
        await handleMoreCoinData(coinID);
    })

    // Function to display the coins in the coin container on the homepage
    // Called by the `handleHome` function.
    async function displayCoins(coinsList) {
        coinsList = coinsList.filter(coin => coin.name.length <= 15 && coin.id.length <= 10);
        // Setting range of coins. Bitcoin is around 1114
        let start = 0;
        let end = 200;

        // Variable to hold the HTML content
        let html = ``;

        for (let i = start; i < end; i++) {

            let coinID = coinsList[i].id
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
        // ! Might be a bug here when you implement the search
        // Shows that favorites are selected (Keeping them toggled after refresh)
        for (let i = start; i < end; i++) {
            let favListArr = local.get("favList")
            if (!favListArr) return;
            for (let j = 0; j < favListArr.length; j++) {
                const storedCoinID = favListArr[j][0]
                let coinID = coinsList[i].id
                if (storedCoinID === coinID) {
                    $(`#switch-${coinID}`).prop("checked", !($(`#switch-${coinID}`).prop("checked")));
                }
            }
        }
    }

    
    // Timestamp Handler to check if data in local storage has been updated recently.
    // If more than two minutes have passed, performs a GET request from the url and updates the entry in local storage
    async function timestampHandler(entryKey, url) {
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

    // AJAX GET Request
    async function getJSON(url) {
        return $.ajax({
            url: url,
            dataType: 'json'
        })
    }

    // Nav Pills Functionality
    // Checking if the selected section is saved, if not, default is homeSection
    $("a.nav-link").removeClass("active");
    $("section").removeClass("d-flex").hide();

    const selectedSection = local.get("selectedSection");
    if (selectedSection) {
        $(`a.nav-link[data-section="${selectedSection}"]`).addClass("active");
        $("#" + selectedSection).addClass("d-flex").show();
    } else {
        $(`a.nav-link[data-section="homeSection"]`).addClass("active");
        $("#homeSection").addClass("d-flex").show();
    }

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

        // Keeping selected section on refresh
        local.add("selectedSection", sectionID)
    })

    // On click of the nav-tabs, perform action according to the tab
    $("#homeLink").click(async () => await handleHome());
    $("#reportsLink").click(() => { console.log("Reports Clicked") })
    $("#aboutLink").click(() => { console.log("About Clicked") })

    // TODO Search Bar
    // Search Bar functionality
    $("form.searchbar-container").on("submit", function(event){
        event.preventDefault();
        alert("Click")
    });

    //# On page load
    handleHome()

    $("#home--coins-container").on("change", ".form-check-input.coin-card--favtoggle", async function () {
        const coinID = $(this).attr("id").substring(7);
        const coinName = $(`#subtitle-${coinID}`).html()
        const coinInfo = [coinID, coinName];

        const that = $(this)
        favoritesHandler(coinInfo, that)
    })

    function favoritesHandler(coinInfo, that) {

        let favListArr = local.get("favList")
        if (!favListArr) {
            favListArr = []
            local.add("favList", favListArr)
        }

        // If more than 5 switches are on, the sixth switch should trigger the modal
        if ($("#home--coins-container input:checked").length > 5) {
            favoriteModalHandler(favListArr, that);
        }

        // When the switch is switched on, push it to the array, otherwise remove it from the array
        if (that.is(':checked')) {
            favListArr.push(coinInfo);
        } else {
            const index = favListArr.indexOf(coinInfo)
            favListArr.splice(index, 1)
        }

        // Update the array in storage
        local.add("favList", favListArr)
    }

    function favoriteModalHandler(favListArr, that) {

        // For every coin in the favListArr, make a row with the coin name and a checkbox
        let html = ``;
        for (let i = 0; i < favListArr.length; i++) {
            const coin = favListArr[i];
            html += `
                <li class="list-group-item container">
                    <div class="row">
                        <div class="col-10"> 
                            <span> ${coin[1]} </span> 
                        </div>
                        <div class="col-2">
                            <input class="form-check-input" type="checkbox" id="favcheck-${coin[0]}" value="${coin[0]}" checked="true">
                        </div>
                    </div>
                </li>
            `
        }

        // Adding the last selected coin (Because it is not saved to the favList automatically)
        const coinID = $(that).attr("id").substring(7);
        const coinName = $(`#subtitle-${coinID}`).html()
        html += `
        <li class="list-group-item bg-secondary-subtle container">
            <div class="row">
                <div class="col-10"> 
                    <span> ${coinName} </span> 
                </div>
                <div class="col-2">
                    <input class="form-check-input" type="checkbox" id="favcheck-${coinID}" value="${coinID}" checked="true">
                </div>
            </div>
        </li>
        `

        // Updating the innerHTML of the list container
        $("#favoritesModal").find(".list-group.list-group-flush").html(html);

        // Displaying the modal
        $("#favoritesModal").modal("toggle");
    }

    // Disabled the save changes button if more than 5 checkboxes are selected inside the modal
    function updateSaveButtonState() {
        const checkedCheckboxes = $('#favListContainer input[type="checkbox"]:checked')
        if (checkedCheckboxes.length > 5) $("#modal-save").prop("disabled", true);
        else $("#modal-save").prop("disabled", false);
    }
    $("#favoritesModal").on("change",'#favListContainer input[type="checkbox"]',updateSaveButtonState);

    //# Discard Changes / Exit Buttons
    $("#favoritesModal").on("click", "*.modal-discard", function () {
        const favListArr = local.get("favList")
        const lastCoinID = favListArr[favListArr.length - 1][0];
        if (favListArr.length > 5) {
            $(`#switch-${lastCoinID}`).prop("checked", false)
            favListArr.pop();
            local.add("favList", favListArr);
        }
    })

    //# Save Changes Button
    $(".modal-footer").on("click", "#modal-save", function () {
        // Checking if there are less than 6 checkboxes checked
        const checkedCheckboxes = $('#favListContainer input[type="checkbox"]:checked')
        
        const favListArr = local.get("favList")

        // Get the values of the unchecked boxes and remove from the favListArr array
        const uncheckedCheckboxes = $('#favListContainer input[type="checkbox"]:not(:checked)')
        $(uncheckedCheckboxes).each(function () {
           const coinID = $(this).attr("value")
           $(`#switch-${coinID}`).prop("checked", false)
           favListArr.forEach(favCoinData => {
                if (coinID === favCoinData[0]) {
                    const index = favListArr.indexOf(favCoinData)
                    favListArr.splice(index, 1)
                }
           });
        })

        // Get the values of the checked boxes and ensure they are in the favListArr array
        $(checkedCheckboxes).each(function () {
            // Value of each checkbox is the ID of the coin
            const coinID = $(this).attr("value")
            $(`#switch-${coinID}`).prop("checked", true)
            
            // Checking if the favListArr contains each of the coins
            const coinName = $(`#subtitle-${coinID}`).html()
            const isCoinInFavList = favListArr.some(([id, name]) => (id === coinID) && (name === coinName));
            if (!isCoinInFavList) {
                favListArr.push([coinID,coinName]);
            }
        });
        
        // Updating the list in storage
        local.add("favList",favListArr)     
        
        // Resetting the save button "disabled" property
        $("#modal-save").prop("disabled", true);

        // Hiding modal
        $("#favoritesModal").modal("toggle");
    })
    
    //# Scroll to Top button
    // When the users scroll down 50 px from the top, display the button
    $(window).scroll(()=> {
        if ($(document).scrollTop() > 300) {
            $("#scrollTop-button").css("display", "block");
        } else {
            $("#scrollTop-button").css("display", "none");
        }
    });

    // When the user clicks on the scrollTop-button, scroll to the top of the document
    $("#scrollTop-button").click(function() {
        $("html, body").animate({scrollTop: 0}, 400);
    });



});

