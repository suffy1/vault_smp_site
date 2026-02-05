import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

export default async (request, context) => {
  try {
    const dbUrl = Deno.env.get("NETLIFY_DATABASE_URL");

    if (!dbUrl) {
      console.error("Veritabanı URL'si bulunamadı!");
      return new Response(JSON.stringify({ error: "Environment variable missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const client = new Client({
      url: dbUrl,
      tls: {
        enabled: true,
        enforce: false,
      },
    });

    await client.connect();
    const result = await client.queryObject("SELECT * FROM stashes ORDER BY id ASC");
    await client.end();

    return new Response(JSON.stringify(result.rows), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });

  } catch (error) {
    console.error("VERİTABANI HATASI:", error);
    return new Response(JSON.stringify({ 
      error: "Database Connection Failed", 
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
