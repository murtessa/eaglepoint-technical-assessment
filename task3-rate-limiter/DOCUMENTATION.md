# Task 3: Rate Limiter - Documentation

## Search History & Research

### 1. Rate Limiting Algorithms
**Search Terms:** "rate limiting algorithms", "sliding window vs fixed window rate limiting", "token bucket vs sliding window"
**URLs:**
- https://en.wikipedia.org/wiki/Rate_limiting
- https://www.figma.com/blog/an-alternative-approach-to-rate-limiting/
- https://konghq.com/blog/how-to-design-a-scalable-rate-limiting-algorithm
- https://stackoverflow.com/questions/667508/whats-a-good-rate-limiting-algorithm

**Findings:**
- **Fixed Window**: Simple but allows bursts at window boundaries
- **Sliding Window**: More accurate, prevents bursts, better user experience
- **Token Bucket**: Good for allowing bursts but more complex
- **Leaky Bucket**: Smooths out traffic but can delay requests
- For this task, sliding window is most appropriate for accuracy

### 2. JavaScript Map vs Object for Rate Limiting
**Search Terms:** "javascript map vs object performance", "map vs object when to use"
**URLs:**
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
- https://stackoverflow.com/questions/18541940/map-vs-object-in-javascript
- https://javascript.info/map-set

**Findings:**
- Map is better for dynamic keys (user IDs)
- Map maintains insertion order
- Map has better performance for frequent additions/deletions
- Map doesn't have prototype pollution issues
- Map is the better choice for this use case

### 3. Timestamp Storage and Cleanup
**Search Terms:** "javascript store timestamps array", "cleanup expired entries javascript"
**URLs:**
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
- https://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript

**Findings:**
- `Date.now()` returns milliseconds since epoch (efficient)
- Arrays are good for storing multiple timestamps per user
- Need periodic cleanup to prevent memory leaks
- `setInterval` can be used for automatic cleanup

### 4. Sliding Window Implementation Patterns
**Search Terms:** "sliding window rate limiter javascript", "implement sliding window algorithm"
**URLs:**
- https://github.com/animir/node-rate-limiter-flexible
- https://www.npmjs.com/package/rate-limiter-flexible
- https://stackoverflow.com/questions/667508/whats-a-good-rate-limiting-algorithm

**Findings:**
- Store array of timestamps per user
- Filter timestamps outside current window
- Check if count exceeds limit
- Add new timestamp if allowed
- Clean up old timestamps periodically

### 5. JavaScript Class vs Function for Rate Limiter
**Search Terms:** "javascript class vs function factory pattern", "when to use classes javascript"
**URLs:**
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- https://javascript.info/class
- https://stackoverflow.com/questions/22528967/es6-class-vs-function-prototype

**Findings:**
- Classes are good for stateful objects (rate limiter has state)
- Classes provide clear API with methods
- Classes are more maintainable for complex logic
- Class is appropriate for this use case

## Thought Process & Design Decisions

### Approach Selection

**Why sliding window algorithm:**
1. **Accuracy**: More accurate than fixed window - prevents bursts at window boundaries
2. **User Experience**: Better UX - users can't game the system by waiting for window reset
3. **Fairness**: Distributes requests more evenly over time
4. **Industry Standard**: Commonly used in production systems

**Why class-based implementation:**
1. **State Management**: Rate limiter needs to maintain state (user requests map)
2. **Multiple Methods**: Need several related methods (isAllowed, makeRequest, getStatus)
3. **Lifecycle Management**: Need cleanup and destruction methods
4. **Encapsulation**: Keeps internal state private

### Alternatives Considered

1. **Fixed Window Algorithm**:
   - Simpler implementation (just count requests per window)
   - **Rejected**: Allows bursts at window boundaries (user can make 5 requests at 59s, then 5 more at 1s)
   - **Trade-off**: Simplicity vs. accuracy

2. **Token Bucket Algorithm**:
   - Allows bursts (good for some use cases)
   - **Rejected**: More complex, doesn't match requirement of "5 requests per 60 seconds" exactly
   - **Trade-off**: Flexibility vs. meeting exact requirements

3. **Object instead of Map**:
   - Simpler syntax in some cases
   - **Rejected**: Map is better for dynamic keys, better performance, no prototype issues
   - **Trade-off**: Familiarity vs. best practices

4. **Set instead of Array for timestamps**:
   - Faster lookups
   - **Rejected**: Need to preserve order and allow duplicates (same timestamp possible)
   - **Trade-off**: Performance vs. correctness

5. **No automatic cleanup**:
   - Simpler code
   - **Rejected**: Memory leak - old entries never removed
   - **Trade-off**: Simplicity vs. memory management

### Data Structure Choices

- **Map<string, number[]>**: 
  - Key: user ID (string)
  - Value: array of timestamps (numbers)
  - Efficient lookups and updates
  - Easy to iterate and clean up

- **Array for timestamps**:
  - Preserves order (important for sliding window)
  - Easy to filter by time
  - Simple to add new timestamps

- **Number for timestamps**:
  - `Date.now()` returns milliseconds (number)
  - Efficient storage and comparison
  - Easy to calculate time differences

### Cleanup Strategy

- **Periodic cleanup**: `setInterval` every 10 seconds
- **On-demand cleanup**: Also cleanup during `isAllowed()` check
- **Why both**: Periodic prevents memory buildup, on-demand ensures accuracy
- **Cleanup interval**: 10 seconds is a good balance (not too frequent, not too rare)

## Step-by-Step Implementation Process

### Step 1: Design Class Structure
- Created `RateLimiter` class with constructor
- Defined instance variables: `maxRequests`, `windowMs`, `userRequests` Map
- Set up cleanup interval

**Problem faced**: Deciding on cleanup frequency
**Solution**: 10 seconds is a good balance - frequent enough to prevent memory issues, not so frequent it impacts performance

### Step 2: Implement isAllowed() Method
- Get user's existing timestamps
- Filter timestamps outside current window
- Check if adding request would exceed limit
- Add timestamp if allowed
- Return boolean

**Problem faced**: Need to filter old timestamps on every check
**Solution**: Filter timestamps before checking count - ensures accuracy

### Step 3: Implement Cleanup Method
- Iterate through all users
- Filter timestamps outside window for each user
- Remove user entries with no valid timestamps
- Update entries with filtered timestamps

**Problem faced**: Memory could grow if cleanup doesn't run
**Solution**: Both periodic cleanup and on-demand cleanup in `isAllowed()`

### Step 4: Implement makeRequest() Method
- Wrapper around `isAllowed()` that throws error
- Calculate time until reset for error message
- Provide helpful error message

**Problem faced**: None - straightforward wrapper

### Step 5: Implement getStatus() Method
- Calculate remaining requests
- Calculate reset time
- Return comprehensive status object

**Problem faced**: Calculating reset time (oldest request + window)
**Solution**: Find minimum timestamp in valid timestamps, add window duration

### Step 6: Implement getRemainingRequests() Method
- Similar to `isAllowed()` but returns count
- Useful for API responses

**Problem faced**: None - straightforward calculation

### Step 7: Implement reset() Method
- Allow resetting specific user or all users
- Useful for testing and admin operations

**Problem faced**: None - straightforward Map operations

### Step 8: Implement destroy() Method
- Clear cleanup interval
- Prevent memory leaks when limiter is no longer needed

**Problem faced**: None - standard cleanup pattern

## Why This Solution is Best

### 1. **Accuracy**
- **Sliding window** prevents gaming the system
- Users can't make 5 requests at end of window, then 5 more at start
- More fair and accurate than fixed window

### 2. **Efficiency**
- **Time Complexity**: 
  - `isAllowed()`: O(n) where n is requests in window (typically small, max 5)
  - `cleanup()`: O(u * n) where u is users, n is requests per user
  - Both are efficient for typical use cases
- **Space Complexity**: O(u * n) where u is users, n is requests per user
- **Optimization**: Periodic cleanup prevents unbounded growth

### 3. **Memory Management**
- Automatic cleanup prevents memory leaks
- Removes expired entries periodically
- Also cleans up during checks (double protection)

### 4. **User Experience**
- Clear error messages with reset time
- Status information available via `getStatus()`
- Helpful for API responses (can return remaining requests)

### 5. **Flexibility**
- Configurable limit and window
- Can be extended (e.g., different limits per user)
- Easy to integrate into existing systems

### 6. **Correctness**
- Handles edge cases (empty user ID, invalid inputs)
- Proper error handling
- Thread-safe for single-threaded JavaScript (no race conditions in Node.js)

### 7. **Maintainability**
- Clean class structure
- Well-documented methods
- Clear separation of concerns
- Easy to test

### 8. **Production Ready**
- Handles multiple users independently
- Automatic cleanup
- Comprehensive error handling
- Status monitoring capabilities

## Algorithm Details

### Sliding Window Logic

1. **On Request**:
   - Get current timestamp: `now = Date.now()`
   - Calculate cutoff: `cutoffTime = now - windowMs`
   - Filter user's timestamps: keep only those > `cutoffTime`
   - Check count: if `count >= maxRequests`, deny
   - Otherwise, add current timestamp and allow

2. **Cleanup**:
   - For each user, filter timestamps outside window
   - Remove users with no valid timestamps
   - Update users with filtered timestamps

### Example Timeline

```
Time 0s:  User makes request 1 → ALLOWED (1/5)
Time 5s:  User makes request 2 → ALLOWED (2/5)
Time 10s: User makes request 3 → ALLOWED (3/5)
Time 15s: User makes request 4 → ALLOWED (4/5)
Time 20s: User makes request 5 → ALLOWED (5/5)
Time 25s: User makes request 6 → BLOCKED (5/5, oldest expires at 60s)
Time 61s: Request 1 expires (outside 60s window)
Time 61s: User makes request 7 → ALLOWED (5/5, but request 1 expired)
```

## Additional Features

### Status Information
- `getStatus()` provides comprehensive information
- Useful for API rate limit headers (X-RateLimit-Remaining, etc.)
- Includes reset time for better UX

### Error Messages
- `makeRequest()` throws descriptive errors
- Includes time until reset
- Helpful for debugging and user feedback

### Cleanup Strategy
- Periodic cleanup (every 10 seconds)
- On-demand cleanup (during checks)
- Prevents memory leaks
- Maintains accuracy

## Conclusion

This sliding window rate limiter implementation provides an accurate, efficient, and production-ready solution. It uses modern JavaScript patterns (classes, Map), implements proper memory management, and includes comprehensive features like status monitoring and helpful error messages. The algorithm is fair, prevents gaming, and scales well for typical use cases.

