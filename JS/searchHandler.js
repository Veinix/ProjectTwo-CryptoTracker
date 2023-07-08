/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

$(()=> {

    $("form.searchbar-container").on("submit", searchForCoins)
    async function searchForCoins(event){
        event.preventDefault();

        const loadingSpinner = 
        `<div class="loading-container">
        <div class="loading-spinner"></div>
        <span class="pt-2"> Loading...</span>
        </div>`;
        $("#home--coins-container").html(loadingSpinner)

        function filterItems() {
            const searchQuery = $("#home--searchbar").val().toLowerCase();
            const searchOption = $("#home--searchbar-options").val(); // Get the selected search option
            const coinsList = local.get("coinsList")[0];

            if (searchOption === "id") {
                return coinsList.filter(coin => coin.id.toLowerCase().includes(searchQuery))
            } else if (searchOption === "name") {
                return coinsList.filter(coin => coin.name.toLowerCase().includes(searchQuery))
            } else if (searchOption === "symbol") {
                return coinsList.filter(coin => coin.symbol.toLowerCase().includes(searchQuery))
            }
        }

        const filteredCoins = filterItems()
        console.log(filteredCoins)
        if (filteredCoins.length === 0) {
            const notFound = 
            `<div class="missing-container">
            <h2> We could not find what you were looking for </h2>
            <span class="pt-2"> Maybe try something else? </span>
            </div>`

            $("#home--coins-container").html(notFound)

        } else coinsHandler.display(filteredCoins)
    };

    $(`form.searchbar-container button[type="reset"]`).on("click", ()=>{
        const coinsList = local.get("coinsList")[0];
        const filteredCoins = coinsList.filter(coin => coin.name.length <= 15 && coin.id.length < 12)
        coinsHandler.display(filteredCoins)
    })
})