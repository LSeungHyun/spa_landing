const http = require('http');

async function testUsageAPI() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/usage-limit/check',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        console.log('Testing usage-limit/check API...');

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('Response Status:', res.statusCode);
                try {
                    const jsonData = JSON.parse(data);
                    console.log('Response Data:', JSON.stringify(jsonData, null, 2));
                } catch (e) {
                    console.log('Response Data (raw):', data);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.error('API Test Error:', error.message);
            reject(error);
        });

        req.end();
    });
}

testUsageAPI().catch(console.error); 