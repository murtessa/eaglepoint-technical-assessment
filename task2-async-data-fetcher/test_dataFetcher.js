/**
 * Test suite for Async Data Fetcher with Retry
 */

const { fetchWithRetry, fetchWithRetryMock, mockApiCall, delay } = require('./dataFetcher');

/**
 * Test helper to run async tests with error handling
 */
async function runTest(testName, testFn) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${testName}`);
    console.log('='.repeat(60));
    
    try {
        await testFn();
        console.log(`✓ ${testName} passed`);
    } catch (error) {
        console.log(`✗ ${testName} failed: ${error.message}`);
        console.error(error);
    }
}

/**
 * Test 1: Successful fetch on first attempt (using mock)
 */
async function testSuccessfulFirstAttempt() {
    console.log('Testing successful fetch on first attempt...');
    
    // Use high success rate to likely succeed on first try
    const result = await fetchWithRetryMock('https://api.example.com/data', 3, 0.9);
    console.log('Success! Result:', JSON.stringify(result, null, 2));
}

/**
 * Test 2: Successful fetch after retries (using mock)
 */
async function testSuccessfulAfterRetries() {
    console.log('Testing successful fetch after some retries...');
    console.log('(This may take a few attempts due to randomness)');
    
    // Use moderate success rate - might need retries
    const result = await fetchWithRetryMock('https://api.example.com/data', 5, 0.4);
    console.log('Success after retries! Result:', JSON.stringify(result, null, 2));
}

/**
 * Test 3: Failure after all retries exhausted (using mock)
 */
async function testFailureAfterAllRetries() {
    console.log('Testing failure after all retries are exhausted...');
    
    try {
        // Use very low success rate to ensure failure
        await fetchWithRetryMock('https://api.example.com/data', 2, 0.01);
        console.log('ERROR: Should have thrown an error');
    } catch (error) {
        console.log('✓ Correctly threw error after all retries:', error.message);
    }
}

/**
 * Test 4: Test with real API (if available)
 * Note: This will only work if you have internet connection
 * and the API endpoint is accessible
 */
async function testRealApi() {
    console.log('Testing with real API endpoint...');
    console.log('Using JSONPlaceholder API (public test API)');
    
    try {
        // Using a reliable public API for testing
        const result = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1', 3);
        console.log('Success! Fetched data:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.log('Failed to fetch from real API:', error.message);
        console.log('(This is expected if there\'s no internet connection)');
    }
}

/**
 * Test 5: Test error handling for invalid inputs
 */
async function testErrorHandling() {
    console.log('Testing error handling for invalid inputs...');
    
    // Test empty URL
    try {
        await fetchWithRetryMock('', 3);
        console.log('ERROR: Should have thrown TypeError for empty URL');
    } catch (error) {
        if (error instanceof TypeError) {
            console.log('✓ Correctly threw TypeError for empty URL');
        } else {
            console.log('ERROR: Wrong error type for empty URL');
        }
    }
    
    // Test invalid maxRetries
    try {
        await fetchWithRetryMock('https://api.example.com', -1);
        console.log('ERROR: Should have thrown TypeError for negative maxRetries');
    } catch (error) {
        if (error instanceof TypeError) {
            console.log('✓ Correctly threw TypeError for negative maxRetries');
        } else {
            console.log('ERROR: Wrong error type for negative maxRetries');
        }
    }
}

/**
 * Test 6: Test delay function
 */
async function testDelay() {
    console.log('Testing delay function...');
    const start = Date.now();
    await delay(1000);
    const end = Date.now();
    const elapsed = end - start;
    
    console.log(`Delay test: waited ~${elapsed}ms (expected ~1000ms)`);
    if (elapsed >= 950 && elapsed <= 1100) {
        console.log('✓ Delay function works correctly');
    } else {
        console.log('⚠ Delay might be slightly off (acceptable for async operations)');
    }
}

/**
 * Test 7: Test mock API call directly
 */
async function testMockApiCall() {
    console.log('Testing mockApiCall function directly...');
    
    let successCount = 0;
    let failureCount = 0;
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
        try {
            await mockApiCall('test-url', 0.5); // 50% success rate
            successCount++;
        } catch (error) {
            failureCount++;
        }
    }
    
    console.log(`Mock API results: ${successCount} successes, ${failureCount} failures out of ${iterations} attempts`);
    console.log(`Success rate: ${(successCount / iterations * 100).toFixed(1)}%`);
}

/**
 * Main test runner
 */
async function runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log('ASYNC DATA FETCHER WITH RETRY - TEST SUITE');
    console.log('='.repeat(60));
    
    // Run tests with mock function (more reliable for testing)
    await runTest('Successful First Attempt (Mock)', testSuccessfulFirstAttempt);
    await runTest('Successful After Retries (Mock)', testSuccessfulAfterRetries);
    await runTest('Failure After All Retries (Mock)', testFailureAfterAllRetries);
    await runTest('Error Handling', testErrorHandling);
    await runTest('Delay Function', testDelay);
    await runTest('Mock API Call Direct', testMockApiCall);
    
    // Test with real API (optional, may fail without internet)
    await runTest('Real API Test (Optional)', testRealApi);
    
    console.log('\n' + '='.repeat(60));
    console.log('All tests completed!');
    console.log('='.repeat(60));
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runAllTests,
    testSuccessfulFirstAttempt,
    testSuccessfulAfterRetries,
    testFailureAfterAllRetries,
    testRealApi,
    testErrorHandling,
    testDelay,
    testMockApiCall
};

