/**
 * Test suite and working examples for Rate Limiter
 */

const { RateLimiter, createRateLimiter } = require('./rateLimiter');

/**
 * Helper function to delay execution
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Example 1: Basic rate limiting - allowing requests within limit
 */
async function example1_BasicRateLimiting() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 1: Basic Rate Limiting - Allowing Requests Within Limit');
    console.log('='.repeat(60));
    
    const limiter = createRateLimiter();
    const userId = 'user123';
    
    console.log(`\nMaking 5 requests for user ${userId} (limit is 5 per 60 seconds):`);
    
    for (let i = 1; i <= 5; i++) {
        const allowed = limiter.isAllowed(userId);
        const status = limiter.getStatus(userId);
        
        console.log(`Request ${i}: ${allowed ? '✓ ALLOWED' : '✗ BLOCKED'} | ` +
                   `Remaining: ${status.remaining} | Used: ${status.used}/${status.limit}`);
    }
    
    limiter.destroy();
}

/**
 * Example 2: Blocking requests when limit exceeded
 */
async function example2_BlockingWhenLimitExceeded() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 2: Blocking Requests When Limit Exceeded');
    console.log('='.repeat(60));
    
    const limiter = createRateLimiter();
    const userId = 'user456';
    
    console.log(`\nMaking 7 requests for user ${userId} (limit is 5 per 60 seconds):`);
    
    for (let i = 1; i <= 7; i++) {
        const allowed = limiter.isAllowed(userId);
        const status = limiter.getStatus(userId);
        
        console.log(`Request ${i}: ${allowed ? '✓ ALLOWED' : '✗ BLOCKED'} | ` +
                   `Remaining: ${status.remaining} | Used: ${status.used}/${status.limit}`);
    }
    
    limiter.destroy();
}

/**
 * Example 3: Auto-reset after time window
 */
async function example3_AutoResetAfterTimeWindow() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 3: Auto-Reset After Time Window');
    console.log('='.repeat(60));
    
    // Create a limiter with shorter window for demonstration (5 requests per 3 seconds)
    const limiter = new RateLimiter(5, 3000);
    const userId = 'user789';
    
    console.log(`\nUsing shorter window: 5 requests per 3 seconds for user ${userId}`);
    console.log('\nStep 1: Make 5 requests (should all be allowed):');
    
    for (let i = 1; i <= 5; i++) {
        const allowed = limiter.isAllowed(userId);
        const status = limiter.getStatus(userId);
        console.log(`Request ${i}: ${allowed ? '✓ ALLOWED' : '✗ BLOCKED'} | ` +
                   `Remaining: ${status.remaining}`);
    }
    
    console.log('\nStep 2: Try 6th request immediately (should be blocked):');
    const blocked = limiter.isAllowed(userId);
    const status1 = limiter.getStatus(userId);
    console.log(`Request 6: ${blocked ? '✓ ALLOWED' : '✗ BLOCKED'} | ` +
               `Remaining: ${status1.remaining} | Reset in: ${status1.resetInSeconds}s`);
    
    console.log('\nStep 3: Wait 3.5 seconds for window to reset...');
    await delay(3500);
    
    console.log('\nStep 4: Try request again after window reset (should be allowed):');
    const allowedAfterWait = limiter.isAllowed(userId);
    const status2 = limiter.getStatus(userId);
    console.log(`Request after wait: ${allowedAfterWait ? '✓ ALLOWED' : '✗ BLOCKED'} | ` +
               `Remaining: ${status2.remaining} | Used: ${status2.used}/${status2.limit}`);
    
    limiter.destroy();
}

/**
 * Example 4: Multiple users tracked independently
 */
async function example4_MultipleUsers() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 4: Multiple Users Tracked Independently');
    console.log('='.repeat(60));
    
    const limiter = createRateLimiter();
    const user1 = 'alice';
    const user2 = 'bob';
    
    console.log(`\nMaking requests for two different users:`);
    console.log(`User 1: ${user1}, User 2: ${user2}`);
    
    // User 1 makes 3 requests
    console.log(`\n${user1} makes 3 requests:`);
    for (let i = 1; i <= 3; i++) {
        const allowed = limiter.isAllowed(user1);
        const status = limiter.getStatus(user1);
        console.log(`  ${user1} Request ${i}: ${allowed ? '✓ ALLOWED' : '✗ BLOCKED'} | ` +
                   `Remaining: ${status.remaining}`);
    }
    
    // User 2 makes 3 requests
    console.log(`\n${user2} makes 3 requests:`);
    for (let i = 1; i <= 3; i++) {
        const allowed = limiter.isAllowed(user2);
        const status = limiter.getStatus(user2);
        console.log(`  ${user2} Request ${i}: ${allowed ? '✓ ALLOWED' : '✗ BLOCKED'} | ` +
                   `Remaining: ${status.remaining}`);
    }
    
    // Both users should have independent limits
    console.log(`\nStatus Summary:`);
    console.log(`  ${user1}:`, limiter.getStatus(user1));
    console.log(`  ${user2}:`, limiter.getStatus(user2));
    
    limiter.destroy();
}

/**
 * Example 5: Using makeRequest() method (throws error on limit exceeded)
 */
async function example5_MakeRequestMethod() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 5: Using makeRequest() Method (Throws Error on Limit)');
    console.log('='.repeat(60));
    
    const limiter = createRateLimiter();
    const userId = 'user999';
    
    console.log(`\nMaking requests using makeRequest() for user ${userId}:`);
    
    try {
        // Make 5 requests (should all succeed)
        for (let i = 1; i <= 5; i++) {
            limiter.makeRequest(userId);
            const status = limiter.getStatus(userId);
            console.log(`Request ${i}: ✓ SUCCESS | Remaining: ${status.remaining}`);
        }
        
        // Try 6th request (should throw error)
        console.log('\nAttempting 6th request (should throw error):');
        limiter.makeRequest(userId);
        console.log('ERROR: Should have thrown an error');
        
    } catch (error) {
        console.log(`✓ Correctly threw error: ${error.message}`);
    }
    
    limiter.destroy();
}

/**
 * Example 6: getStatus() method details
 */
async function example6_GetStatusDetails() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 6: getStatus() Method - Detailed Information');
    console.log('='.repeat(60));
    
    const limiter = createRateLimiter();
    const userId = 'user_status';
    
    console.log(`\nMaking requests and checking status for user ${userId}:`);
    
    for (let i = 1; i <= 3; i++) {
        limiter.isAllowed(userId);
        const status = limiter.getStatus(userId);
        
        console.log(`\nAfter request ${i}:`);
        console.log(`  User ID: ${status.userId}`);
        console.log(`  Used: ${status.used}/${status.limit}`);
        console.log(`  Remaining: ${status.remaining}`);
        console.log(`  Reset in: ${status.resetInSeconds} seconds`);
        console.log(`  Reset at: ${status.resetAt}`);
    }
    
    limiter.destroy();
}

/**
 * Example 7: Cleanup of expired entries
 */
async function example7_CleanupExpiredEntries() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 7: Cleanup of Expired Entries');
    console.log('='.repeat(60));
    
    // Create limiter with short window for demonstration
    const limiter = new RateLimiter(5, 2000); // 2 second window
    const userId = 'user_cleanup';
    
    console.log(`\nUsing 2-second window for user ${userId}`);
    console.log('Making 5 requests:');
    
    for (let i = 1; i <= 5; i++) {
        limiter.isAllowed(userId);
    }
    
    const status1 = limiter.getStatus(userId);
    console.log(`\nImmediately after 5 requests:`);
    console.log(`  Used: ${status1.used}/${status1.limit}`);
    console.log(`  Remaining: ${status1.remaining}`);
    
    console.log('\nWaiting 2.5 seconds for window to expire...');
    await delay(2500);
    
    // Manually trigger cleanup
    limiter.cleanup();
    
    const status2 = limiter.getStatus(userId);
    console.log(`\nAfter cleanup (window expired):`);
    console.log(`  Used: ${status2.used}/${status2.limit}`);
    console.log(`  Remaining: ${status2.remaining}`);
    console.log(`  (Window has reset, all requests expired)`);
    
    limiter.destroy();
}

/**
 * Run all examples
 */
async function runAllExamples() {
    console.log('\n' + '='.repeat(60));
    console.log('RATE LIMITER - WORKING EXAMPLES');
    console.log('='.repeat(60));
    
    await example1_BasicRateLimiting();
    await example2_BlockingWhenLimitExceeded();
    await example3_AutoResetAfterTimeWindow();
    await example4_MultipleUsers();
    await example5_MakeRequestMethod();
    await example6_GetStatusDetails();
    await example7_CleanupExpiredEntries();
    
    console.log('\n' + '='.repeat(60));
    console.log('All examples completed!');
    console.log('='.repeat(60));
}

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples().catch(console.error);
}

module.exports = {
    runAllExamples,
    example1_BasicRateLimiting,
    example2_BlockingWhenLimitExceeded,
    example3_AutoResetAfterTimeWindow,
    example4_MultipleUsers,
    example5_MakeRequestMethod,
    example6_GetStatusDetails,
    example7_CleanupExpiredEntries
};

