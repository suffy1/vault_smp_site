const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    
    try {
        await client.connect();
        
        // Frontend'den gelen veriyi al
        const { seller, price, title, region, description, images } = JSON.parse(event.body);
        
        // Resim dizisini (Array) JSON string'e çevirip kaydediyoruz ki veritabanı bozulmasın
        const imagesJson = JSON.stringify(images);

        // SQL Sorgusu: Security yerine region eklendi
        const query = `
            INSERT INTO stashes (seller, price, title, region, description, images, status, date)
            VALUES ($1, $2, $3, $4, $5, $6, 'Active', NOW())
            RETURNING *;
        `;
        
        const values = [seller, price, title, region, description, imagesJson];
        
        await client.query(query, values);
        await client.end();

        return { statusCode: 200, body: JSON.stringify({ message: 'Success' }) };
    } catch (e) {
        await client.end();
        return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
};
