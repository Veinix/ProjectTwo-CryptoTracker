# Changelog

All notable changes to this project will be documented in this file

## Legend

🚀 - Feature

💉 - Fixed

🪲 - Bug

## [1.0.0] Unreleased - 2023-MM-DD

## Project Details and Guidelines

### Remarks

1. Use the jQuery library (Do I really need to though?)
2. API calls to be made my jQuery AJAX and not XMLHTTPReq. (Didn't Assaf say we can just use the method we were taught?)
3. Adaptive design for mobile - Bootstrap
4. Bonus: Real time reports

---

## Displays

### Main Page

The main page will display the following elements:

1. Title - Name of page and large wide image and use of parallax scrolling.
2. Navigation - Ability to navigate to coins, real time reports, and about page.
    - Created by making an ajax call to load everything onto the page at once (hence the need for the loading screen at first).

3. Coins, all the coins that return from the API. Note: For development purposes, you can only work on part of what returns from the API. Create just 100 coins. The work during the development process will take a lot of time if you grab all the coins every time.
    - Ability to search at a client level only (Only the coins that have loaded onto the page).
    - Coins will be displayed in Bootstrap card tabs. (Any other interesting method to display them will be accepeted)
4. On load of the main page, call the API to get the different coins.

---

### Search/Filter Function

Search through the coins that have been loaded from the earlier request. You can search by currency code only, that is, BTC will return info about Bitcoin, as well as all the other functionalities of toggle and more info will apply to the results.

If the user searches for BT, they will not get any results.

---

### Coin Data

`More Info Button`

#### API Details link 1

<https://api.coingecko.com/api/v3/coins/list>

Type of request: GET

Paramaters: none

On button press, this button will open information via a collapser/collapsable inside the coin card with extra information about the card. The extra information will be provided from the API, in other words, on pressing "More Info" there will an API call that returns the relevant information.

#### API Details link 2

<https://api.coingecko.com/api/v3/coins/${id}>

Type of request: GET

Paramaters: id

The above request returns a JSON object with information about the specific coin. You must dsiplay the following information:

1. Image
2. Price in USD, EUR, ILS - with appropriate currency symbols.

---

### Loading API data and Caching

Each load that causes the user to wait (even 500 milliseconds) must be accompanied by a progress bar until the information is loaded. (Progress bar does not have to be linear, can just be a spinner)

Every call made to fetch "additional information" from the API will be saved in a local cache that will be managed in your client.  The information will be saved for a situation where the user clicks on `More Info` once to fetch the information and display it, and a second time to hide it back. If on the next click no more than 2 minutes have passed since the call to the API, your client will simply display the existing information - received in the previous call. If 2 minutes have passed, your client will have to call API again to display the latest information and save it in the cache.

### Toggle Favorites

Via a switch `Favorites Switch` a user can favorite coins. On switch, add or remove the current coin from the list of favorited reports (detailed below). Up to five coins will be allowed on this list.

If the user wants to add a sixth coin, they will have to remove one of the five coins already selected. A modal window will pop up with the list of coins selected for the report and a toggle that will allow you to remove one of the five selected coins (Or more), as well as a "cancel" button that will allow you to withdraw from the requested action (adding a new coin to the report on one existing account).

After confirming their choice, the modal window will close and the updated information will be displayed in the main window.

The modal window should only pop up when more than 5 coins are selected.

---

## Real Time Reports Page

The purpose of this screen is to display a graph describing the state (value?) of the coins selected in the toggle button in real time.

### Graph

Each favorited currency belongs to the above graph and report. The graph will be built and displayed using a jQuery package called: [Canvas.js](https://canvasjs.com/jquery-charts)

Use "Chart with multiple axes" to display several coins in a graph.

** If you prefer, you can choose a package of your own graphs. (Yes, I'd prefer a non-jQuery one)

### Graph Data

To get the information for a number of selected coins (maximum 5) it is not necessary to perform readings as the number of coins. You must use the following API:

#### API Details link 3

[Cryto Compare](https://min-api.cryptocompare.com/documentation)

##### Example Link for Ethereum and Bitcoin in USD

<https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR>

In order to get the prices of multiple coins you can use the above API. In the example provided, we are getting the price of Ethereum and Bitcoin in USD and EUR.

Note: It is enough the show the details in USD only (David Bonus: Display them in EUR and ILS, and have ability to switch between them).

The API must be called every 2 seconds as soon as the user navigates to the graph page.

Graph description:

1. The graph will contain lines of different colors as the number of coins selected.

2. Each color will be a currency and it will be written in the graph which color belongs to which currency - according to the currency legend.

3. The information in the graph will be updated every 2 seconds (Every request).

4. Every entry to the page of the graph resets the information, that is, the X-axis representing time, as well as the Y-axis representing the price of the currency, will be reset. (To make sure there are no duplicates)

5. Any addition or subtraction of a currency from and to the report will affect the graph accordingly.

---

## About Page

In this page, your personal details will be displayed along with the project's description and your picture.
