const { Client } = require('pg');
exports.handler = async (event) => {
    const { password, id, action, status } = JSON.parse(event.body);
    if (password !== process.env.ADMIN_PASSWORD) return { statusCode: 401, body: "Unauthorized" };

    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();

    if (action === 'delete') {
        await client.query('DELETE FROM stashes WHERE id = $1', [id]);
    } else if (action === 'update') {
        await client.query('UPDATE stashes SET status = $1 WHERE id = $2', [status, id]);
    }
    
    await client.end();
    return { statusCode: 200, body: JSON.stringify({ message: "Updated" }) };
};
