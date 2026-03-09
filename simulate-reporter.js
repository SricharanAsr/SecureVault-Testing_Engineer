const fs = require('fs');
const path = require('path');

const mockResults = {
    testResults: [
        {
            assertionResults: [
                {
                    title: 'TC-API-002: Encrypted Storage Validation',
                    status: 'passed',
                    failureMessages: []
                },
                {
                    title: 'TC-SYNC-001: Multi-Device Sync',
                    status: 'failed',
                    failureMessages: ['Conflict detected']
                }
            ]
        }
    ]
};

const filePath = path.join(__dirname, 'jest-results.json');
fs.writeFileSync(filePath, JSON.stringify(mockResults, null, 2));
console.log('Created mock jest-results.json');

// Now run the reporter script
process.env.QATOUCH_DOMAIN = 'zeroknowledgevault';
process.env.QATOUCH_PROJECT_KEY = 'mPx9';
process.env.QATOUCH_TEST_RUN_ID = 'DEBUG_RUN';
process.env.QATOUCH_API_TOKEN = 'DEBUG_TOKEN';

require('./scripts/qa-touch-reporter.js');
