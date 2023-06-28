"use strict";

/**
 * Module to more easily manipulate and read local storage data by packaging often-used lines of code into methods
 * @example lcl.store("key", value);
 * @method store -- Adds an entry by it's key and value to `localStorage`.
 * @method retrieve -- Returns an entry from `localStorage` based on its key
 * @method remove -- Removes an entry from `localStorage` based on its key
 * @method clear -- Empties the `localStorage`
 * @method init -- Tests if `localStorage` is available in the current environment
 * @method clean -- Removes all null or undefined keys from `localStorage`
 * @method amount -- Displays in the console the amount of items in storage
 */
const lcl = { 
    /**
     * Adds an entry to `localStorage` via it's key-value pair. Does not return anything
     * 
     * `key` must be a string, `value` is automatically turned into a string via `JSON.stringify(value)`;
     * 
     * @example 
     * lcl.store("dataKey",dataValue);
     * @param {string} key - Key of the entry
     * @param {any} value - Value of the entry
     * 
     * @module
     *  
     */
    store(key, value){
        key.toString();
        const data = JSON.stringify(value);
        localStorage.setItem(key, data);
    },
    /**
     * Returns an entry from `localStorage` via it's `key`. The entry is parsed into it's original form (eg. Array) before return. If there is no such entry with the provided `key` it will return `null`
     *
     * @param {string} key - Key of the entry
     * @returns {any} Entry stored
     */
    retrieve(key) {
        key.toString();
        const entry = localStorage.getItem(key);
        return entry ? JSON.parse(entry) : null;
    },
    /**
     * Removes an entry from `localStorage` via it's `key`
     *
     * @param {string} key - Key of the entry
     */
    remove(key) {
        localStorage.removeItem(key);
    },
    /**
     * Clears all entries in `localStorage`
     */
    clear(){
        localStorage.clear();
    },
    /**
     * Tests to see if the environment supports `localStorage`. 
     * 
     * Certain environments that do not support the Web Storage API include older browsers or restricted environments
     */
    init() {
        if (typeof localStorage === "undefined" | "null") {
            console.error("Local storage is not supported in this browser/environment.");
        } else console.log("%cEnvironment supports localStorage","color: #1F680B")
    },
    /**
     * Removes any entry whose key is empty/null/undefined, from `localStorage`
     */
    clean() {
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
    // 
    /**
     * Displays in the console the length or the amount of things in `localStorage`
     */
    amount() {
        console.log(`Currently ${localStorage.length} entries in localStorage`);
    } 
}
