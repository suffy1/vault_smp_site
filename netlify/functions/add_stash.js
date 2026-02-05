const { Client } = require('pg');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  // 1. GÜVENLİK KONTROLÜ (Şifre Yanlışsa Dur)
  if (data.password !== process.env.ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Yanlış Şifre! Yetkisiz giriş." })
    };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // SQL Sorgusu: Veriyi tabloya ekle
    const query = `
      INSERT INTO stashes (title, region, price, description, security, seller, images, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Available')
      RETURNING *;
    `;

    const values = [
      data.title,
      data.region,
      data.price,
      data.description,
      data.security,
      data.seller,
      [data.image] // Resim linkini dizi içine alıyoruz
    ];

    const result = await client.query(query, values);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Başarılı", stash: result.rows[0] })
    };

  } catch (error) {
    console.error("Ekleme Hatası:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
