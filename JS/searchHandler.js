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

        function filterCoins(){
            const searchQuery = $("#home--searchbar").val().toLowerCase();
            const coinsList = storageHandler.get("coinsList")[0];
            return coinsList.filter(coin => coin.id.toLowerCase().includes(searchQuery))
        }

        const filteredCoins = filterCoins();
        if (filteredCoins.length === 0) {
            const notFoundMessage = 
            `<div class="missing-container">
            <h2> We could not find what you were looking for </h2>
            <span class="pt-2"> Maybe try something else? </span>
            </div>`

            $("#home--coins-container").html(notFoundMessage)

        } else coinsHandler.display(filteredCoins)
    };

    $(`form.searchbar-container button[type="reset"]`).on("click", ()=>{
        const coinsList = storageHandler.get("coinsList")[0];
        const filteredCoins = coinsList.filter(coin => coin.name.length <= 15 && coin.id.length < 12)
        coinsHandler.display(filteredCoins)
    })
})