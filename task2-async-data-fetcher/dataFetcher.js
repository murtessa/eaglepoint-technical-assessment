/**
 * Async Data Fetcher with Retry Logic
 * 
 * This module provides a function to fetch data from a URL with automatic
 * retry logic on failure. It waits 1 second between retries and throws an
 * error after all retries are exhausted.
 */

/**
 * Delays execution for a specified number of milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetches data from a URL with automatic retry logic
 * 
 * @param {string} url - The URL to fetch data from
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @returns {Promise<any>} The fetched data
 * @throws {Error} If all retry attempts fail
 * 
 * @example
 * try {
 *   const data = await fetchWithRetry('https://api.example.com/data', 3);
 *   console.log(data);
 * } catch (error) {
 *   console.error('Failed after all retries:', error.message);
 * }
 */
async function fetchWithRetry(url, maxRetries = 3) {
    // Input validation
    if (typeof url !== 'string' || !url.trim()) {
        throw new TypeError('URL must be a non-empty string');
    }
    
    if (typeof maxRetries !== 'number' || maxRetries < 0) {
        throw new TypeError('maxRetries must be a non-negative number');
    }
    
    let lastError;
    
    // Attempt fetch with retries
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // Attempt to fetch the data
            const response = await fetch(url);
            
            // Check if response is ok (status 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse and return the JSON data
            const data = await response.json();
            return data;
            
        } catch (error) {
            lastError = error;
            
            // If this is not the last attempt, wait before retrying
            if (attempt < maxRetries) {
                console.log(`Attempt ${attempt + 1} failed. Retrying in 1 second...`);
                await delay(1000); // Wait 1 second between retries
            } else {
                // All retries exhausted
                console.log(`All ${maxRetries + 1} attempts failed.`);
            }
        }
    }
    
    // Throw error after all retries are exhausted
    throw new Error(`Failed to fetch data after ${maxRetries + 1} attempts. Last error: ${lastError.message}`);
}

/**
 * Mock API call function that randomly succeeds or fails
 * Useful for testing retry logic without making actual HTTP requests
 * 
 * @param {string} url - The URL (not used, but kept for API consistency)
 * @param {number} successRate - Probability of success (0.0 to 1.0, default: 0.3)
 * @returns {Promise<any>} Mock data on success
 * @throws {Error} Randomly on failure
 */
async function mockApiCall(url, successRate = 0.3) {
    // Simulate network delay
    await delay(Math.random() * 500 + 100); // 100-600ms delay
    
    // Randomly succeed or fail based on successRate
    if (Math.random() < successRate) {
        // Success - return mock data
        return {
            success: true,
            data: {
                id: Math.floor(Math.random() * 1000),
                message: 'Mock API call succeeded',
                timestamp: new Date().toISOString()
            },
            url: url
        };
    } else {
        // Failure - throw error
        const errors = [
            'Network timeout',
            'Connection refused',
            'Server error',
            'Request failed'
        ];
        const randomError = errors[Math.floor(Math.random() * errors.length)];
        throw new Error(randomError);
    }
}

/**
 * Fetches data using a mock function with retry logic
 * This is useful for testing without making actual HTTP requests
 * 
 * @param {string} url - The URL (for logging purposes)
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} successRate - Probability of success for mock function (default: 0.3)
 * @returns {Promise<any>} The fetched data
 * @throws {Error} If all retry attempts fail
 */
async function fetchWithRetryMock(url, maxRetries = 3, successRate = 0.3) {
    // Input validation
    if (typeof url !== 'string' || !url.trim()) {
        throw new TypeError('URL must be a non-empty string');
    }
    
    if (typeof maxRetries !== 'number' || maxRetries < 0) {
        throw new TypeError('maxRetries must be a non-negative number');
    }
    
    let lastError;
    
    // Attempt fetch with retries
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // Use mock function instead of real fetch
            const data = await mockApiCall(url, successRate);
            return data;
            
        } catch (error) {
            lastError = error;
            
            // If this is not the last attempt, wait before retrying
            if (attempt < maxRetries) {
                console.log(`Attempt ${attempt + 1} failed: ${error.message}. Retrying in 1 second...`);
                await delay(1000); // Wait 1 second between retries
            } else {
                // All retries exhausted
                console.log(`All ${maxRetries + 1} attempts failed.`);
            }
        }
    }
    
    // Throw error after all retries are exhausted
    throw new Error(`Failed to fetch data after ${maxRetries + 1} attempts. Last error: ${lastError.message}`);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWithRetry,
        fetchWithRetryMock,
        mockApiCall,
        delay
    };
}

