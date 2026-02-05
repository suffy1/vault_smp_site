const { Client } = require('pg');
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    const data = JSON.parse(event.body);
    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL, ssl: { rejectUnauthorized: false } });
    
    try {
        await client.connect();
        await client.query(
            `INSERT INTO stashes (title, region, price, seller, description, security, images, status) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')`,
            [data.title, data.region, data.price, data.seller, data.description, data.security, data.images]
        );
        await client.end();
        return { statusCode: 200, body: JSON.stringify({ message: "Saved" }) };
    } catch (e) { return { statusCode: 500, body: e.message }; }
};
