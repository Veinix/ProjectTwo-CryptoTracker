"use strict";

//TODO Making my own "library" with function objects

//# --- Code --- #\\
const local = {
    // Add key and value to localStorage
    store: function(key, value){
        key.toString();
        const data = JSON.stringify(value);
        localStorage.setItem(key, data);
    },
    // Get items from localStorage
    retrieve: function(key) {
        key.toString();
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    // Remove an item from localStorage
    remove: function(key) {
        localStorage.removeItem(key);
    },
    // Clear the localStorage
    clear: function(){
        localStorage.clear();
    },
    // Tests to see if the environment supports localStorage
    initialize: function() {
        if (typeof localStorage === 'undefined') {
            console.error('Local storage is not supported in this browser/environment.');
        } else console.log("Environment supports localStorage")
    },
    // consoleLogs all the keys and their values
    display: function() {
        for (let i = 0; i < localStorage.length; i++) {
            // console.log(localStorage.key(i))
            console.info(localStorage.getItem(localStorage.key(i)));
          }
    },
    // Removes any item whose key is empty/null/undefined, from localStorage
    clean: function() {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key === null | key === undefined | key === "") {
                localStorage.removeItem(key);
            }
            let value = localStorage.getItem(localStorage.key(i));
            if (value === null | value === undefined | value === "" ) {
                localStorage.removeItem(key);
            }
          }
    },
    // consoleLogs the length or the amount of things in localStorage
    amount: function() {
        console.log(localStorage.length);
    }
}
