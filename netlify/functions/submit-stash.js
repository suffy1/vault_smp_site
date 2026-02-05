const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Sadece POST isteğine izin ver
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const query = `
      INSERT INTO stashes (title, region, price, seller, description, security, images, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')
    `;
    
    // images verisini dizi olarak gönderiyoruz
    const values = [
      data.title,
      data.region,
      data.price,
      data.seller,
      data.description,
      data.security,
      data.images 
    ];

    await client.query(query, values);
    await client.end();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: "İlan başarıyla gönderildi." })
    };

  } catch (error) {
    console.error("Ekleme Hatası:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
