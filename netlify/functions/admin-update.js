const { Client } = require('pg');

exports.handler = async (event, context) => {
  const { password, id, action, status } = JSON.parse(event.body);

  // Şifre kontrolü
  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    if (action === 'delete') {
      // İlanı sil
      await client.query('DELETE FROM stashes WHERE id = $1', [id]);
    } else if (action === 'update') {
      // Durumu güncelle (Available veya Sold yap)
      await client.query('UPDATE stashes SET status = $1 WHERE id = $2', [status, id]);
    }
    
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "İşlem Başarılı" })
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
