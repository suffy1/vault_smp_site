// netlify/functions/admin-login.js
exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { password } = JSON.parse(event.body);

        // Netlify Panelinde ayarladığın "ADMIN_PASSWORD" değişkeni ile kıyaslar
        // Eğer panelden ayarlamadıysan kodun çalışması için 'sabit_sifre' kısmını değiştirme,
        // Netlify panelinden Environment Variable ekle: Key: ADMIN_PASSWORD, Value: senin_sifren
        const correctPassword = process.env.ADMIN_PASSWORD || "admin123"; 

        if (password === correctPassword) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, token: "session_valid_123" }) // Basit bir session onayı
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ success: false, message: "Yanlış Şifre" })
            };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
