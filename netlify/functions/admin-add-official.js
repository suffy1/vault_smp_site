exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);

        // Admin panelinden gelen yeni veri yapısı
        const { seller, price, title, region, description, images } = data;

        const newOfficialStash = {
            id: Date.now(),
            seller: seller || "VaultSMP", // Admin girmezse default VaultSMP
            price,
            title,
            region, // YENİ
            description,
            images,
            status: "Active", // Admin eklediği için direkt Active
            isOfficial: true,
            date: new Date().toISOString()
        };

        // DB KAYIT İŞLEMİ...
        console.log("Admin İlanı:", newOfficialStash);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Resmi ilan eklendi.", data: newOfficialStash }),
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
};
