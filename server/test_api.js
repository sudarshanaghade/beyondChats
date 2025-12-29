const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    console.log('Testing API...');
    try {
        const articles = await makeRequest('/articles');
        console.log(`GET /articles: found ${articles.length} articles`);

        if (articles.length > 0) {
            const id = articles[0].id;
            const article = await makeRequest(`/articles/${id}`);
            console.log(`GET /articles/${id}: ${article.title}`);
        }
    } catch (e) {
        console.error('API Test Failed:', e.message);
    }
}

test();
