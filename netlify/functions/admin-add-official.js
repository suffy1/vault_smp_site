const { Client } = require('pg');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    if (body.password !== process.env.ADMIN_PASSWORD) return { statusCode: 401, body: "Unauthorized" };

    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();

    try {
        const d = body.data;
        // Seller otomatik 'VaultSMP', Status otomatik 'Available'
        await client.query(
            `INSERT INTO stashes (title, region, price, seller, description, security, images, status) 
             VALUES ($1, $2, $3, 'VaultSMP', $4, $5, $6, 'Available')`,
            [d.title, d.region, d.price, d.description, d.security, d.images]
        );
        await client.end();
        return { statusCode: 200, body: JSON.stringify({ message: "Published" }) };
    } catch (e) {
        return { statusCode: 500, body: e.message };
    }
};
