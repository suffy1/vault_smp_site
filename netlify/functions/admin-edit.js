const { Client } = require('pg');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    if (body.password !== process.env.ADMIN_PASSWORD) return { statusCode: 401, body: "Unauthorized" };

    const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();

    try {
        if (body.action === 'delete') {
            await client.query('DELETE FROM stashes WHERE id = $1', [body.id]);
        } else if (body.action === 'update') {
            const d = body.data;
            await client.query(
                `UPDATE stashes SET title=$1, price=$2, seller=$3, status=$4, description=$5, images=$6 WHERE id=$7`,
                [d.title, d.price, d.seller, d.status, d.description, d.images, d.id]
            );
        }
        await client.end();
        return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
    } catch (e) {
        return { statusCode: 500, body: e.message };
    }
};
