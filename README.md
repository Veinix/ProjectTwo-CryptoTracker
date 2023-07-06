# Crypto Tracker

## About

This project's purpose is to take crypto data from the [Coin Gecko API](https://www.coingecko.com/en/api/documentation) and display them in a aesthetic way. It allows users to track and view information about different cryptocurrencies.

This is my second project while at John Bryce - studying web development.

## Features

- **Home Page**: Displays a list of cryptocurrencies with their symbols and names. Users can click on the "More Info" button to view additional information about a specific coin, such as its current price.
- **Search**: Users can search for coins by entering the coin symbol or name in the search bar.
- **Live Reports**: Provides real-time updates and charts for the selected cryptocurrency.
- **Favorites**: Users can mark coins as favorites to easily track their prices and receive notifications.

***More detailed information on features coming soon***

## Design Process and Methodology

Since I am using Bootstrap to design this project, I am using a mobile-first design methodology. To get an idea of the layout of how I want to have the elements displayed on a page I made sketches in Google Drawings corresponding to the different items I was creating. For the different functions, I used draw.io to create a rough sketch of what the functions does and how it works.

### Google Drawing Sketches

Every element in the page is displayed using containers or blocks. They also must be placed either vertically or horizontally. Below are images of this idea. Each element will go into a box, blue for horizontal containers (Elements inside blue are aligned horizontally) or red for vertical containers (Elements inside red are aligned vertically).

### Figma

***Coming Soon***

### Draw.io

***Coming Soon***

## Installation and Usage

To run the Crypto Tracker app locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Veinix/crypto-tracker.git`
2. Navigate to the project directory
3. Open the `index.html` file in a web browser.
4. Explore and enjoy!

## Contributing

Contributions are welcome! If you'd like to contribute to Crypto Tracker, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-feature`
3. Make your changes and commit them: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request.

## Known Bugs

- Too many calls being made causes the API to temporarily block the IP
- Coins with very long ids or names don't display correctly

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Dependencies

The Crypto Tracker application relies on the following dependencies:

- **jQuery**: JavaScript library for DOM manipulation and AJAX requests. You can include it by adding the following script tag to your HTML file:

  ```html
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  ```

- **[Coin Gecko API](https://www.coingecko.com/en/api/documentation)**: Coin Gecko API used to retrieve data about the coins
