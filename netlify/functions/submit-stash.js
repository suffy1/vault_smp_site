exports.handler = async (event, context) => {
    // Sadece POST isteklerini kabul et
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);

        // YENİ VERİ YAPISI:
        // security YOK, region VAR.
        const { seller, price, title, region, description, images } = data;

        // Basit Validasyon (Backend tarafında da kontrol şart)
        if (!seller || !price || !title || !region || !description) {
            return { 
                statusCode: 400, 
                body: JSON.stringify({ message: "Eksik bilgi girdiniz." }) 
            };
        }

        // --- BURASI VERİTABANI BAĞLANTISI ---
        // (Eğer MongoDB, Supabase veya JSONBin kullanıyorsan burayı güncellemelisin)
        // Şimdilik test için konsola basıyoruz ve başarılı dönüyoruz.
        
        const newStash = {
            id: Date.now(), // Geçici ID
            seller,
            price,
            title,
            region, // ARTIK SERVER BİLGİSİ KAYDEDİLİYOR
            description,
            images, // ARTIK DİZİ (ARRAY) OLARAK GELİYOR
            status: "Pending", // İlk eklendiğinde onay bekliyor
            date: new Date().toISOString()
        };

        console.log("YENİ STASH GELDİ:", newStash);

        // --- VERİTABANI KAYIT KODUNU BURAYA YAZACAKSIN ---

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "İlan başarıyla alındı!", data: newStash }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Sunucu hatası", error: error.toString() }),
        };
    }
};
