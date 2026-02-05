const { Client } = require('pg');
exports.handler = async (event) => {
    const { password } = JSON.parse(event.body);
    if (password !== process.env.ADMIN_PASSWORD) return { statusCode: 401, body: "Unauthorized" };

    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const result = await client.query('SELECT * FROM stashes ORDER BY id DESC'); // En yeniler üstte
    await client.end();
    return { statusCode: 200, body: JSON.stringify(result.rows) };
};
