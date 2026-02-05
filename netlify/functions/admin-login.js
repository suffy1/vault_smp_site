exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    
    try {
        const { password } = JSON.parse(event.body);
        // Netlify'da ADMIN_PASSWORD tanımlı değilse varsayılan 'admin' olur
        const correct = process.env.ADMIN_PASSWORD || 'admin';

        if (password === correct) {
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }
        return { statusCode: 401, body: JSON.stringify({ error: 'Wrong password' }) };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
};
