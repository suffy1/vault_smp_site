exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);

        // YENİ DATA YAPISI
        const { seller, price, title, region, description, images } = data;

        // Validasyon
        if (!seller || !price || !title || !region || !description) {
            return { 
                statusCode: 400, 
                body: JSON.stringify({ message: "Eksik bilgi." }) 
            };
        }

        const newStash = {
            id: Date.now(),
            seller,
            price,
            title,
            region, // Security yerine Region kaydediyoruz
            description,
            images, // Array olarak geliyor
            status: "Pending",
            date: new Date().toISOString()
        };

        // BURADA VERİTABANI KAYIT İŞLEMİ OLACAK
        console.log("Kullanıcı İlanı:", newStash);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "İlan alındı!", data: newStash }),
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
};
