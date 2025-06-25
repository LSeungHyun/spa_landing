const http = require('http');

async function testAPI() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            prompt: 'test prompt for usage tracking'
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/improve-prompt',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log('Testing improve-prompt API...');

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

        req.write(postData);
        req.end();
    });
}

testAPI().catch(console.error); 