"use strict";

/**
 * More easily manipulate and read local storage data
 * @example storageHandler.add("key", value);
 * @method add -- Adds an entry by it's key and value to `localStorage`.
 * @method get -- Returns an entry from `localStorage` based on its key
 * @method remove -- Removes an entry from `localStorage` based on its key
 * @method clear -- Empties the `localStorage`
 * @method test -- Tests if `localStorage` is available in the current environment
 * @method clean -- Removes all null or undefined keys from `localStorage`
 */ 
const storageHandler = (() => {

        /**
         * Adds an entry to `localStorage` via it's key-value pair. Does not return anything
         * 
         * @example storageHandler.add("dataKey",dataValue);
         * @param {string} key - The key of the entry
         * @param {any} value - The value of the entry
         * @return {any} If `doesReturn` is set to true, returns the stored value
        */
        function add(key, value){
            // Validate the key parameter
            if (typeof key !== "string" || key.trim() === "") {
                throw new Error("Invalid key. Key must be a non-empty string.");
            }
            
            // Stringifying value
            const data = JSON.stringify(value);

            // Try-Catch block to catch errors
            try {
                localStorage.setItem(key, data);
            } catch (err) {
                // Handle  errors
                console.error("An error occurred while accessing localStorage:", err);
            }
        }

        
        /**
        * Returns an entry from `localStorage` via it's `key`. The entry is parsed into it's original form (eg. Array) before return. If there is no such entry with the provided `key` it will return `null`
        * 
        * @example storageHandler.get("dataKey",dataValue);
        * @param {string} key - Key of the entry
        * @returns {any} Entry stored
        */
        function get(key){
            // Validate the key parameter
            if (typeof key !== "string" || key.trim() === "") {
                throw new Error("Invalid key. Key must be a non-empty string.");
            }

            const entry = localStorage.getItem(key);
            return entry ? JSON.parse(entry) : null;
        }

        
        /**
        * Removes an entry from `localStorage` via it's `key`
        *
        * @example storageHandler.remove("dataKey")
        * @param {string} key - Key of the entry
        */
        function remove(key){
            // Validate the key parameter
            if (typeof key !== "string" || key.trim() === "") {
                throw new Error("Invalid key. Key must be a non-empty string.");
            }

            // Convert key to string
            key = key.toString();

            localStorage.removeItem(key);
        }

        
        /**
         * Removes all entries in `localStorage`
         * 
         * @example storageHandler.clear()
        */
        function clear(){
            localStorage.clear();
        }

        return {
            add: add,  
            get: get,
            remove: remove,
            clear: clear
        }
})();
