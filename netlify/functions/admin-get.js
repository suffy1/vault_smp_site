const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Şifre kontrolü için veriyi al
  if (!event.body) return { statusCode: 400, body: "No Body" };
  const { password } = JSON.parse(event.body);

  // Şifre yanlışsa reddet
  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM stashes ORDER BY id DESC');
    await client.end();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
