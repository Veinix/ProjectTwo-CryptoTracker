/// <reference path="./assets/library/jquery-3.7.0.js"/>

"use strict";

//# Main JS
$(() => {
    
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
        const url = "https://api.coingecko.com/api/v3/coins/list";
        const coinsList = await timestampHandler("CoinsList", url);
        displayCoins(coinsList)
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

        resizeText(`#collapseheader-${coinID}`)
        resizeText(`#collapsesubheader-${coinID}`)
    }
    // On "More Info" click, gets more information with the ID of the coin.
    $("#home--coins-container").on("click", ".badge.coin-card--more-info", async function () {
        const coinID = $(this).attr("id").substring(9);
        await handleMoreCoinData(coinID);
    })

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
        // Setting range of coins. Bitcoin is around 1114
        let end = 1214;
        let start = 1114;
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

        // Resizes the text of the coin ID and the coin name in the card, if it's too large for the container
        for (let i = start; i < end; i++) {
            let coinID = coinsList[i].id
            resizeText("#title-" + coinID);
            resizeText("#subtitle-" + coinID);

        }

        // Shows that favorites are selected (Keeping them toggled after refresh)
        for (let i = start; i < end; i++) {
            let favListArr = lcl.retrieve("favlist")
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
        if (lcl.retrieve(entry) === null) {
            const data = await getJSON(url);
            const newTimestamp = Date.now();
            lcl.store(entry, [data, newTimestamp])

            return (lcl.retrieve(entry))[0];
        }

        const oldTimestamp = (lcl.retrieve(entry))[1];
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
            dataType: 'json'
        })
    }

    /**
     * Function to resize a text element that is too large for it's container or position
     * 
     * @param {string} elementSelector ID of the element
     */
    function resizeText(elementSelector) {
        
        const textElement = $(elementSelector);
        const containerHeight = textElement.parent().innerHeight();
        const containerWidth = textElement.parent().innerWidth();
        const originalFontSize = parseFloat(textElement.css('font-size'));
        let newFontSize = originalFontSize;

        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

        // Decrease font size until text fits within container height
        try {
            while (textElement[0].scrollHeight > containerHeight) {
                newFontSize -= 1;
                textElement.css('font-size', `${newFontSize / rootFontSize}rem`);
            }

            // Decrease font size until text fits within container height
            while (textElement[0].scrollWidth > containerWidth) {
                newFontSize -= 1;
                textElement.css('font-size', `${newFontSize / rootFontSize}rem`);
            }
        } catch (err) {
            console.log(elementSelector, "\n" + err)
            // TODO Remove from display the coin cards that give errors
        }
    }

    // Nav Pills Functionality
    // Checking if the selected section is saved, if not, default is homeSection
    $("a.nav-link").removeClass("active");
    $("section").removeClass("d-flex").hide();

    const selectedSection = lcl.retrieve("selectedSection");
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
        lcl.store("selectedSection", sectionID)
    })

    // On click of the nav-tabs, perform action according to the tab
    $("#homeLink").click(async () => await handleHome());
    $("#reportsLink").click(() => { console.log("Reports Clicked") })
    $("#aboutLink").click(() => { console.log("About Clicked") })

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

        let favListArr = lcl.retrieve("favlist")
        if (!favListArr) {
            favListArr = []
            lcl.store("favlist", favListArr)
        }

        // If more than 5 switches are on, the sixth switch should trigger the modal
        if ($("input:checked").length > 5) {
            return favoriteModalHandler(favListArr, that);
        }

        // When the switch is switched on, push it to the array, otherwise remove it from the array
        if (that.is(':checked')) {
            favListArr.push(coinInfo);
        } else {
            const index = favListArr.indexOf(coinInfo)
            favListArr.splice(index, 1)
        }

        // Update the array in storage
        lcl.store("favlist", favListArr)
    }
    // TODO Add more stylings and buttons to the list in the modal, add the ability to edit the fav list and store it in storage
    function favoriteModalHandler(favListArr, that) {

        // Adding the rows of coins in the favList to the list
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

        // Adding the last selected coin (Because it is not saved to the favlist)
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

    // Clicking discard, Modal not saving the changes, unchecking the last selected
    $("#favoritesModal").on("click", "*.modal-discard", function () {
        const checkedCheckboxes = $('#home--coins-container input[type="checkbox"]:checked');
        if (checkedCheckboxes.length > 5) {
            const checkboxID = checkedCheckboxes[checkedCheckboxes.length - 1].id;
            $(`#${checkboxID}`).prop("checked", false)
        }
    })

    // Clicking save, Modal saving the changes, and updating favListArr
    $(".modal-footer").on("click", "#modal-save", function () {
        const favlistArr = lcl.retrieve("favlist")

        // Get the values of the unchecked boxes and remove from the favlistArr array
        const uncheckedCheckboxes = $('#favListContainer input[type="checkbox"]:not(:checked)')
        $(uncheckedCheckboxes).each(function () {
           const coinID = $(this).attr("value")
           $(`#switch-${coinID}`).prop("checked", false)
           favlistArr.forEach(favCoinData => {
                if (coinID === favCoinData[0]) {
                    const index = favlistArr.indexOf(favCoinData)
                    favlistArr.splice(index, 1)
                }
           });
        })

        // Updating the list in storage
        lcl.store("favlist",favlistArr)       

        // Hiding modal
        $("#favoritesModal").modal("toggle");
    }) 
    
});

