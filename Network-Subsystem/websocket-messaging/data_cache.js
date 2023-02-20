// File: data_cache.js
// Author: chatGPT, assembled by Julian Fisher
// Date: 1/24/2023

// EVERYTHING BELOW THIS LINE WAS GENERATE USING CHATGPT

// Description: A javascript class that implements a simple data cache with a maximum size and retention time.

class dataCache {
    /**
     * Creates an instance of dataCache.
     * @param {number} maxCacheSize - The maximum number of entries to be stored in the cache
     * @param {number} retentionTime - The maximum amount of time to hold data in the cache, in milliseconds
     */
    constructor(maxCacheSize, retentionTime) {
        this.maxCacheSize = maxCacheSize;
        this.retentionTime = retentionTime;
        this.queue = [];
    }

    /**
     * Caches a new value, along with the date and time it was added.
     * If adding the new item goes above the maximum size of the queue, it also pops the first item from the queue.
     * @param {any} value - The value to be added to the cache
     */
    cache(value) {
        let dateTime = new Date();
        let entry = {
            value: value,
            datetime: dateTime
        };
        this.queue.push(entry);
        if (this.queue.length > this.maxCacheSize) {
            this.queue.shift();
        }
    }

    /**
     * Removes items from the front of the queue that have a date time older than the defined retentionTime
     */
    cleanCache() {
        let currentTime = new Date();
        while (this.queue.length > 0 && currentTime - this.queue[0].datetime > this.retentionTime) {
            this.queue.shift();
        }
    }
    
    /**
     * Returns an array of all the data in the queue, excluding the datetime of when the data was added to the queue
     * @returns {Array} - An array of all the cached values
     */
    getCache() {
        let data = [];
        for (let i = 0; i < this.queue.length; i++) {
            data.push(this.queue[i].value);
        }
        return data;
    }

    /**
     * Check if a value is present in the cache
     * @param {any} value - The value to be checked
     * @returns {boolean} - true if the value is in the cache, false otherwise
     */
    isCached(value) {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].value === value) {
                return true;
            }
        }
        return false;
    }
}

module.exports = dataCache;