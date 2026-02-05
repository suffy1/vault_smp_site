exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST" && event.httpMethod !== "PUT") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        const { id, title, price, region, description, images, status } = data;

        // Güncellenecek veri paketi
        const updateData = {
            title,
            price,
            region, // Security gitti, Region geldi
            description,
            images,
            status,
            updatedAt: new Date().toISOString()
        };

        // DB GÜNCELLEME İŞLEMİ (ID'ye göre)...
        console.log(`ID ${id} güncelleniyor:`, updateData);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "İlan güncellendi.", data: updateData }),
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
};
