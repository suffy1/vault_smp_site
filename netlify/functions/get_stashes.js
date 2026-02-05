const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Veritabanı bağlantısı
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // En yeni ilanlar en üstte görünecek şekilde çek (ORDER BY id DESC)
    const result = await client.query('SELECT * FROM stashes ORDER BY id DESC');
    
    await client.end();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Herkese açık
      },
      body: JSON.stringify(result.rows)
    };

  } catch (error) {
    console.error("Database Hatası:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
