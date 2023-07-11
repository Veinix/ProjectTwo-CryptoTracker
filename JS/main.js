/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

$(() => {
    // On first load, handleHome, since it is the default
    handleHome()

    //# Nav Pills Functionality
    // TODO Combine some of these event listeners
    // On nav pill click, perform action according to the tab
    $("#homeLink").click(async () => await handleHome());
    $("#reportsLink").click(() => handleReports())
    $("#aboutLink").click(() => handleAbout()) 

    // Checking if the selected section is saved, if not, default is homeSection
    $("a.nav-link").removeClass("active");
    $("section").removeClass("d-flex").hide();

    // On refresh/reload make sure the current selected section stays active
    const selectedSection = local.get("selectedSection");
    if (selectedSection) {
        $(`a.nav-link[data-section="${selectedSection}"]`).addClass("active");
        $("#" + selectedSection).addClass("d-flex").show();
    } else {
        $(`a.nav-link[data-section="homeSection"]`).addClass("active");
        $("#homeSection").addClass("d-flex").show();
    }

    // On nav pill click, 
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

    // Handles all processes related to the homepage.
    // Assigns the value returned from the `loadCoinList` function to the constant `coinsList` and then displays it using the `displayCoins(coinsList)` function
    // Called on page load
    async function handleHome() {
        const url = "https://api.coingecko.com/api/v3/coins/list";
        const coinsList = await timeStamp.get("coinsList", url);
        const filteredCoins = coinsList.filter(coin => coin.name.length <= 15 && coin.id.length < 12)
        coinsHandler.display(filteredCoins)
    }

    function handleReports() {
        graph.render()
    }

    function handleAbout() {

    }

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

