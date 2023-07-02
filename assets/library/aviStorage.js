"use strict";
/** 
 * @module aviStorage
 * @description Module to more easily manipulate storage with easier, more robust and user-friendly syntax
*/

//# Local Storage Object
/**
 * More easily manipulate and read local storage data
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
     * @param {boolean} [doesReturn] - Set to true to return the stored information
     * 
     *  
    */
    store(key, value, doesReturn){
        // Validate the key parameter
        if (typeof key !== "string" || key.trim() === "") {
            throw new Error("Invalid key. Key must be a non-empty string.");
        }

        // Convert key to string and stringifying value
        key = key.toString();
        const data = JSON.stringify(value);

        // Try-Catch block to catch errors such as "QuotaExceededError" (Local Storage limit reached)
        try {
            localStorage.setItem(key, data);
          } catch (error) {
            if (error instanceof DOMException && error.name === "QuotaExceededError") {
              console.error(
                "Storage quota exceeded. Cannot add more data to localStorage. \n Recommendations: \n 1) Use lcl.remove(key) to remove data that is not needed anymore \n 2) Periodically delete information that is not needed \n 3) Use other methods of storage (sessionStorage, cookies, cache, IndexedDB");
            } else {
              // Handle other errors
              console.error("An error occurred while accessing localStorage:", error);
            }
          }
        
        if (doesReturn) {  
            const entry = localStorage.getItem(key);
            return entry ? JSON.parse(entry) : null;
        }
    }
    ,
    /**
     * Returns an entry from `localStorage` via it's `key`. The entry is parsed into it's original form (eg. Array) before return. If there is no such entry with the provided `key` it will return `null`
     *
     * @param {string} key - Key of the entry
     * @returns {any} Entry stored
     */
    retrieve(key) {
        // Validate the key parameter
        if (typeof key !== "string" || key.trim() === "") {
            throw new Error("Invalid key. Key must be a non-empty string.");
        }

        // Convert key to string
        key = key.toString();
        const entry = localStorage.getItem(key);
        return entry ? JSON.parse(entry) : null;
    },
    /**
     * Removes an entry from `localStorage` via it's `key`
     *
     * @param {string} key - Key of the entry
     */
    remove(key) {
        // Validate the key parameter
        if (typeof key !== "string" || key.trim() === "") {
            throw new Error("Invalid key. Key must be a non-empty string.");
        }

        // Convert key to string
        key = key.toString();

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
        if (typeof localStorage === "undefined" | localStorage === "null") {
            console.error("Local storage is not supported in this browser/environment.");
            return false;
        } else {
            console.log("%cEnvironment supports localStorage","color: #1F680B")
            return true;
        }
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
    
    /**
     * Displays in the console the length or the amount of things in `localStorage`. Given parameters, it will log the length of a specific entry 
     * @param {string} [key] Key of entry
     */
    amount(key) {
        if (key) {
            // Validate the key parameter
            if (typeof key !== "string" || key.trim() === "") {
                throw new Error("Invalid key. Key must be a non-empty string.");
            }

            // Convert key to string
            key = key.toString();

            // Getting the length of the entry
            const entry = localStorage.getItem(key)
            console.log(`Entry "${key}" contains ${entry.length} `)
            return
        } 
        console.log(`Currently ${localStorage.length} entries in localStorage`);

    } 
}