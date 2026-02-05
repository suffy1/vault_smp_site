const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Veritabanı bağlantı adresini al
  const dbUrl = process.env.NETLIFY_DATABASE_URL;

  if (!dbUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Veritabanı URL'si (NETLIFY_DATABASE_URL) bulunamadı!" })
    };
  }

  // Neon (Postgres) bağlantısını yapılandır
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false // Neon için gerekli SSL ayarı
    }
  });

  try {
    await client.connect();
    
    // Verileri çek
    const result = await client.query('SELECT * FROM stashes ORDER BY id ASC');
    
    await client.end();

    // Verileri döndür
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Her yerden erişime izin ver
      },
      body: JSON.stringify(result.rows)
    };

  } catch (error) {
    console.error("Veritabanı Hatası:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Veritabanı bağlantısı başarısız oldu.", details: error.message })
    };
  }
};
