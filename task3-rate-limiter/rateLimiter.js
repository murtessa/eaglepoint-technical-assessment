/**
 * Rate Limiter Implementation
 * 
 * Limits requests to 5 per 60 seconds per user using a sliding window algorithm.
 * Tracks requests by user ID and automatically resets after the time window.
 */

/**
 * Rate Limiter Class
 * 
 * Implements a sliding window rate limiter that allows a maximum number of
 * requests per time window per user. Automatically cleans up expired entries.
 */
class RateLimiter {
    /**
     * Creates a new RateLimiter instance
     * 
     * @param {number} maxRequests - Maximum number of requests allowed (default: 5)
     * @param {number} windowMs - Time window in milliseconds (default: 60000 = 60 seconds)
     */
    constructor(maxRequests = 5, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        
        // Map to store request timestamps per user
        // Structure: { userId: [timestamp1, timestamp2, ...] }
        this.userRequests = new Map();
        
        // Cleanup interval to remove expired entries
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 10000); // Clean up every 10 seconds
    }
    
    /**
     * Cleans up expired request entries for all users
     * Removes timestamps older than the current window
     */
    cleanup() {
        const now = Date.now();
        const cutoffTime = now - this.windowMs;
        
        for (const [userId, timestamps] of this.userRequests.entries()) {
            // Filter out timestamps outside the window
            const validTimestamps = timestamps.filter(ts => ts > cutoffTime);
            
            if (validTimestamps.length === 0) {
                // Remove user entry if no valid timestamps
                this.userRequests.delete(userId);
            } else {
                // Update with filtered timestamps
                this.userRequests.set(userId, validTimestamps);
            }
        }
    }
    
    /**
     * Checks if a request is allowed for a given user
     * 
     * @param {string} userId - The user ID to check
     * @returns {boolean} True if request is allowed, false if rate limit exceeded
     */
    isAllowed(userId) {
        if (!userId || typeof userId !== 'string') {
            throw new TypeError('userId must be a non-empty string');
        }
        
        const now = Date.now();
        const cutoffTime = now - this.windowMs;
        
        // Get existing timestamps for this user
        let timestamps = this.userRequests.get(userId) || [];
        
        // Remove timestamps outside the current window
        timestamps = timestamps.filter(ts => ts > cutoffTime);
        
        // Check if adding this request would exceed the limit
        if (timestamps.length >= this.maxRequests) {
            // Rate limit exceeded
            return false;
        }
        
        // Add current request timestamp
        timestamps.push(now);
        this.userRequests.set(userId, timestamps);
        
        // Request allowed
        return true;
    }
    
    /**
     * Attempts to make a request, throws error if rate limit exceeded
     * 
     * @param {string} userId - The user ID making the request
     * @throws {Error} If rate limit is exceeded
     */
    makeRequest(userId) {
        if (!this.isAllowed(userId)) {
            const timestamps = this.userRequests.get(userId) || [];
            const oldestRequest = Math.min(...timestamps);
            const timeUntilReset = this.windowMs - (Date.now() - oldestRequest);
            const secondsUntilReset = Math.ceil(timeUntilReset / 1000);
            
            throw new Error(
                `Rate limit exceeded for user ${userId}. ` +
                `Maximum ${this.maxRequests} requests per ${this.windowMs / 1000} seconds. ` +
                `Try again in ${secondsUntilReset} seconds.`
            );
        }
    }
    
    /**
     * Gets the number of remaining requests for a user
     * 
     * @param {string} userId - The user ID to check
     * @returns {number} Number of remaining requests in the current window
     */
    getRemainingRequests(userId) {
        if (!userId || typeof userId !== 'string') {
            throw new TypeError('userId must be a non-empty string');
        }
        
        const now = Date.now();
        const cutoffTime = now - this.windowMs;
        
        const timestamps = this.userRequests.get(userId) || [];
        const validTimestamps = timestamps.filter(ts => ts > cutoffTime);
        
        return Math.max(0, this.maxRequests - validTimestamps.length);
    }
    
    /**
     * Gets information about a user's rate limit status
     * 
     * @param {string} userId - The user ID to check
     * @returns {Object} Status information including remaining requests and reset time
     */
    getStatus(userId) {
        if (!userId || typeof userId !== 'string') {
            throw new TypeError('userId must be a non-empty string');
        }
        
        const now = Date.now();
        const cutoffTime = now - this.windowMs;
        
        const timestamps = this.userRequests.get(userId) || [];
        const validTimestamps = timestamps.filter(ts => ts > cutoffTime);
        
        const remaining = Math.max(0, this.maxRequests - validTimestamps.length);
        const oldestRequest = validTimestamps.length > 0 ? Math.min(...validTimestamps) : null;
        const resetTime = oldestRequest ? oldestRequest + this.windowMs : now;
        const secondsUntilReset = oldestRequest ? Math.ceil((resetTime - now) / 1000) : 0;
        
        return {
            userId,
            remaining,
            used: validTimestamps.length,
            limit: this.maxRequests,
            resetInSeconds: secondsUntilReset,
            resetAt: new Date(resetTime).toISOString()
        };
    }
    
    /**
     * Resets the rate limit for a specific user (useful for testing)
     * 
     * @param {string} userId - The user ID to reset
     */
    reset(userId) {
        if (userId) {
            this.userRequests.delete(userId);
        } else {
            // Reset all users
            this.userRequests.clear();
        }
    }
    
    /**
     * Stops the cleanup interval (call this when done with the rate limiter)
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

/**
 * Creates a rate limiter with default settings (5 requests per 60 seconds)
 * 
 * @returns {RateLimiter} A new RateLimiter instance
 */
function createRateLimiter() {
    return new RateLimiter(5, 60000);
}

// Export for use in other modules that use the rateLimiter module 
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RateLimiter,
        createRateLimiter
    };
}

