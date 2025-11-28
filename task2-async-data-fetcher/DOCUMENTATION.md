# Task 2: Async Data Fetcher with Retry - Documentation

## Search History & Research

### 1. JavaScript Fetch API
**Search Terms:** "javascript fetch API", "fetch API error handling", "fetch API async await"
**URLs:**
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- https://javascript.info/fetch-api

**Findings:**
- `fetch()` returns a Promise that resolves to a Response object
- Need to check `response.ok` or `response.status` to handle HTTP errors
- `fetch()` only rejects on network errors, not HTTP error status codes
- `response.json()` is async and returns a Promise

### 2. Async/Await in JavaScript
**Search Terms:** "javascript async await", "async await error handling", "async await best practices"
**URLs:**
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://javascript.info/async-await
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

**Findings:**
- `async` functions always return a Promise
- `await` pauses execution until Promise resolves/rejects
- Use try-catch for error handling in async functions
- Prefer async/await over Promise chains for readability

### 3. Retry Logic Patterns
**Search Terms:** "javascript retry pattern", "async retry logic", "exponential backoff vs fixed delay"
**URLs:**
- https://stackoverflow.com/questions/38213668/promise-retry-design-patterns
- https://dev.to/gafi/7-ways-to-implement-retry-logic-in-javascript-p1m
- https://en.wikipedia.org/wiki/Exponential_backoff

**Findings:**
- Fixed delay (1 second) is simpler and sufficient for this task
- Exponential backoff is better for production but adds complexity
- Loop with try-catch is the most straightforward retry pattern
- Should track last error to provide meaningful error messages

### 4. JavaScript setTimeout and Promises
**Search Terms:** "javascript setTimeout promise", "delay promise javascript"
**URLs:**
- https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
- https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep

**Findings:**
- `setTimeout` with Promise wrapper creates a delay function
- Pattern: `new Promise(resolve => setTimeout(resolve, ms))`
- This is the standard way to create delays in async/await code

### 5. Node.js vs Browser Fetch
**Search Terms:** "nodejs fetch", "node fetch module", "fetch in node.js"
**URLs:**
- https://nodejs.org/en/blog/announcements/v18-release-announce/
- https://github.com/node-fetch/node-fetch

**Findings:**
- Node.js 18+ has built-in `fetch()` (no need for node-fetch)
- For older Node versions, would need `node-fetch` package
- Our implementation works in both Node.js 18+ and browsers

## Thought Process & Design Decisions

### Approach Selection

**Why this approach:**
1. **Async/await over Promise chains**: More readable and easier to maintain
2. **Fixed 1-second delay**: Simple and meets requirements exactly
3. **Loop-based retry**: Clear and straightforward implementation
4. **Error tracking**: Store last error to provide meaningful error messages
5. **Input validation**: Check types and values before processing

### Alternatives Considered

1. **Exponential Backoff**:
   - Considered implementing exponential backoff (1s, 2s, 4s, etc.)
   - **Rejected**: Requirements specify "waits 1 second between retries" (fixed delay)
   - **Trade-off**: More sophisticated vs. meeting exact requirements

2. **Recursive Retry Function**:
   - Considered recursive approach for retry logic
   - **Rejected**: Loop is clearer and avoids potential stack overflow
   - **Trade-off**: Functional style vs. iterative clarity

3. **Promise.all with retries**:
   - Considered firing all retries simultaneously
   - **Rejected**: Doesn't meet requirement of waiting between retries
   - **Trade-off**: Faster but doesn't meet spec

4. **Separate retry utility function**:
   - Considered creating a generic retry wrapper
   - **Rejected**: Over-engineering for this specific task
   - **Trade-off**: Reusability vs. simplicity

### Data Structure Choices

- **Loop counter**: Simple integer for tracking attempts
- **lastError variable**: Store error for final error message
- **No complex data structures needed**: Simple variables suffice

### Mock Function Design

- **Random success/failure**: Uses `Math.random()` with configurable success rate
- **Simulated delay**: Adds realistic network delay (100-600ms)
- **Varied error messages**: Different error types for realism
- **Configurable**: Success rate can be adjusted for testing

## Step-by-Step Implementation Process

### Step 1: Create Delay Helper Function
- Implemented `delay(ms)` using Promise and setTimeout
- Simple utility for waiting between retries

**Problem faced**: None - standard pattern

### Step 2: Implement Basic Fetch with Retry
- Created `fetchWithRetry()` function with async/await
- Added loop for retry attempts (0 to maxRetries)
- Wrapped fetch in try-catch for error handling

**Problem faced**: Initially forgot that `fetch()` doesn't reject on HTTP errors
**Solution**: Added check for `response.ok` and throw error for non-2xx status codes

### Step 3: Add Retry Logic
- Implemented delay between retries (except after last attempt)
- Track last error for final error message
- Throw error after all retries exhausted

**Problem faced**: Need to wait 1 second between retries, not before first attempt
**Solution**: Only delay if `attempt < maxRetries` (not after last attempt)

### Step 4: Error Handling
- Check `response.ok` for HTTP errors
- Handle network errors (fetch rejects)
- Handle JSON parsing errors
- Provide meaningful error messages

**Problem faced**: Different error types (network, HTTP, JSON parsing)
**Solution**: Catch all errors and store in `lastError`, then re-throw with context

### Step 5: Input Validation
- Validate URL is non-empty string
- Validate maxRetries is non-negative number
- Throw appropriate TypeError for invalid inputs

**Problem faced**: None - straightforward validation

### Step 6: Create Mock Function
- Implemented `mockApiCall()` for testing
- Random success/failure based on success rate
- Simulated network delay
- Varied error messages

**Problem faced**: Making mock function realistic
**Solution**: Added random delay and varied error messages

### Step 7: Create Mock-based Retry Function
- Created `fetchWithRetryMock()` using mock function
- Same retry logic as real fetch function
- Useful for testing without network

**Problem faced**: None - straightforward adaptation

## Why This Solution is Best

### 1. **Readability & Maintainability**
- Clean async/await syntax (no Promise chains)
- Clear variable names (`lastError`, `attempt`, `maxRetries`)
- Well-documented with JSDoc comments
- Easy to understand retry flow

### 2. **Correctness**
- Handles all error types (network, HTTP, JSON parsing)
- Properly waits 1 second between retries (not before first)
- Validates inputs appropriately
- Provides meaningful error messages

### 3. **Efficiency**
- **Time Complexity**: O(1) per attempt, O(maxRetries) total
- **Space Complexity**: O(1) - only stores simple variables
- No unnecessary data structures or operations

### 4. **Testability**
- Mock function allows testing without network
- Configurable success rate for different test scenarios
- Clear separation between real fetch and mock
- Comprehensive test suite included

### 5. **Flexibility**
- Works in both Node.js 18+ and browsers
- Easy to extend (e.g., add exponential backoff)
- Configurable retry count
- Can be adapted for different fetch scenarios

### 6. **Error Handling**
- Comprehensive error handling at all levels
- Preserves original error information
- Provides context in final error message
- Appropriate error types (TypeError for invalid input)

### 7. **Meets Requirements Exactly**
- ✅ Fetches data from URL
- ✅ Retries on failure (up to max retry count)
- ✅ Waits 1 second between retries
- ✅ Returns data or throws error after all retries fail
- ✅ Uses async/await
- ✅ Includes mock function for testing

## Additional Features

### Mock Function Benefits
- **No network dependency**: Tests can run offline
- **Deterministic testing**: Can control success rate
- **Fast testing**: No real network delays
- **Error scenario testing**: Can force failures easily

### Code Organization
- **Modular design**: Separate functions for different concerns
- **Exportable**: Can be used as a module
- **Reusable**: Delay function can be used elsewhere

## Conclusion

This solution provides a clean, efficient, and correct implementation of async data fetching with retry logic. It uses modern JavaScript patterns (async/await), handles errors comprehensively, and includes a mock function for easy testing. The code is readable, maintainable, and meets all requirements exactly as specified.

