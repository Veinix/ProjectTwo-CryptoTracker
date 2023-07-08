"use strict";

/**
 * More easily manipulate and read local storage data
 * @example local.add("key", value);
 * @method add -- Adds an entry by it's key and value to `localStorage`.
 * @method get -- Returns an entry from `localStorage` based on its key
 * @method remove -- Removes an entry from `localStorage` based on its key
 * @method clear -- Empties the `localStorage`
 * @method test -- Tests if `localStorage` is available in the current environment
 * @method clean -- Removes all null or undefined keys from `localStorage`
 */ 
const local = (() => {

        /**
         * Adds an entry to `localStorage` via it's key-value pair. Does not return anything
         * 
         * @example local.add("dataKey",dataValue);
         * @param {string} key - The key of the entry
         * @param {any} value - The value of the entry
         * @param {boolean} [doesReturn] Optional. Set to true to return the stored information
         * @return {any} If `doesReturn` is set to true, returns the stored value
        */
        function add(key, value, doesReturn){
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

        
        /**
        * Returns an entry from `localStorage` via it's `key`. The entry is parsed into it's original form (eg. Array) before return. If there is no such entry with the provided `key` it will return `null`
        * 
        * @example local.get("dataKey",dataValue);
        * @param {string} key - Key of the entry
        * @returns {any} Entry stored
        */
        function get(key){
            // Validate the key parameter
            if (typeof key !== "string" || key.trim() === "") {
                throw new Error("Invalid key. Key must be a non-empty string.");
            }

            // Convert key to string
            key = key.toString();
            const entry = localStorage.getItem(key);
            return entry ? JSON.parse(entry) : null;
        }

        
        /**
        * Removes an entry from `localStorage` via it's `key`
        *
        * @example local.remove("dataKey")
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
         * @example local.clear()
        */
        function clear(){
            localStorage.clear();
        }

        
        /**
         * Tests to see if the environment supports `localStorage`. 
         * 
         * Certain environments that do not support the Web Storage API include older browsers or restricted environments
         * 
         * @example local.test()
         * @returns {Boolean} Returns true if `localStorage` is supported
        */
        function test() {
            if (typeof localStorage === "undefined" | localStorage === "null") {
                console.error("Local storage is not supported in this browser/environment.");
                return false;
            } else {
                console.log("%cEnvironment supports localStorage","color: #1F680B")
                return true;
            }
        }

        
        /**
         * Removes any entry whose key or value is empty/null/undefined, from `localStorage`
         * 
         * @example local.clean()
        */
        function clean() {
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (!key) {
                    localStorage.removeItem(key);
                }
                let value = localStorage.getItem(localStorage.key(i));
                if (!value) {
                    localStorage.removeItem(key);
                }
            }
        }

        return {
            add: add,  
            get: get,
            remove: remove,
            clear: clear,
            test: test,
            clean: clean
        }
})();
