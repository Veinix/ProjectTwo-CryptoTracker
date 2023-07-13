/// <reference path="./libraries/jquery-3.7.0.js"/>
"use strict";

$(()=> {
    // Making sure that you can't have more than 5 favorites by refreshing the modal window
    $(()=>{
        const favListArr = local.get("favList")
        if (!favListArr) return;
        if (favListArr.length >= 6) {
            modalHandler(favListArr)
        }
    })

    //# Main Favorites
    function favoritesHandler(coinInfo, that) {
        // If there is no favList, make one
        let favListArr = local.get("favList")
        if (!favListArr) favListArr = []
        
        // When the switch is switched on, push it to the array, otherwise remove it from the array
        if (that.is(":checked")) {
            favListArr.push(coinInfo);
        } else {
            // Looping through the elements in each array, since indexOf doesn't work on complex arrays
            for (let i = 0; i < favListArr.length; i++) {
                const coinInfoArr = favListArr[i];
                if (coinInfoArr[0] === coinInfo[0]) favListArr.splice(i, 1);
            }
        }

        // Update the array in storage
        local.add("favList", favListArr)

        // If more than 5 switches are on, the sixth switch should trigger the modal
        if (favListArr.length > 5) {
            modalHandler(favListArr)
        }
    }

    // Event listener for the switch on the coin-cards
    $("#home--coins-container").on("change", ".form-check-input.coin-card--favtoggle", 
        async function () {
            const coinID = $(this).attr("id").substring(7)
            const coinName = $(`#subtitle-${coinID}`).html()
            const coinSymbol = $(`#title-${coinID}`).html()
            const coinInfo = [coinID, coinName, coinSymbol];

            // Bringing this to the next function via that
            const that = $(this)
            favoritesHandler(coinInfo, that)
        }
    )

    //# Favorites Modal
    function modalHandler(favListArr) {
        // For every coin in the favListArr, make a row with the coin name and a checkbox
        let html = ``;
        for (let i = 0; i < favListArr.length; i++) {
            const coin = favListArr[i];
            if (i === (favListArr.length - 1)) {
                html += `
                <li class="list-group-item bg-secondary-subtle container">
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
            } else {
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
        }
        
        // Updating the innerHTML of the list container
        $("#favoritesModal").find(".list-group.list-group-flush").html(html);

        // Displaying the modal
        $("#favoritesModal").modal("toggle");
    }

    //# Discard Changes / Exit Buttons
    function discardChangesButton() {
        const favListArr = local.get("favList")
        const lastCoinID = favListArr[favListArr.length - 1][0];

        if (favListArr.length > 5) {
            $(`#switch-${lastCoinID}`).prop("checked", false)
            favListArr.pop();
            local.add("favList", favListArr);
        }
    }
    $("#favoritesModal").on("click", "*.modal-discard", discardChangesButton)


    //# Save Changes Button    
    function saveChangesButton() {
        // Get the values of the unchecked boxes and remove from the favListArr array
        const uncheckedCheckboxes = $('#favListContainer input[type="checkbox"]:not(:checked)')
        const favListArr = local.get("favList")

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
        const checkedCheckboxes = $('#favListContainer input[type="checkbox"]:checked')
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
    }
    $(".modal-footer").on("click", "#modal-save", saveChangesButton)


    // Disabled the save changes button if more than 5 checkboxes are selected inside the modal
    function updateSaveButtonState() {
        const checkedCheckboxes = $('#favListContainer input[type="checkbox"]:checked')
        if (checkedCheckboxes.length > 5) $("#modal-save").prop("disabled", true);
        else $("#modal-save").prop("disabled", false);
    }
    $("#favoritesModal").on("change",'#favListContainer input[type="checkbox"]',updateSaveButtonState);

})