exports.handler = async (event, context) => {
    // BURASI NORMALDE VERİTABANINDAN ÇEKİLİR
    // Şimdilik frontend düzgün görünsün diye YENİ MOCK veri dönüyoruz.
    
    const mockStashes = [
        {
            id: 101,
            title: "Obsidian Skybase",
            seller: "VaultSMP",
            price: "$250",
            region: "NA West", // YENİ: Region eklendi
            description: "Y 256 seviyesinde, full obsidian kaplı, patlamaz base.",
            // security: "High", // ESKİ: Kaldırıldı
            images: [
                "https://i.imgur.com/example1.jpg", 
                "https://i.imgur.com/example2.jpg"
            ],
            status: "Available"
        },
        {
            id: 102,
            title: "Underwater Bunker",
            seller: "User_X",
            price: "$90",
            region: "EU Central", // YENİ
            description: "Okyanus tabanının altında gizli girişli stash.",
            images: ["https://i.imgur.com/example3.jpg"],
            status: "Sold"
        },
        {
            id: 103,
            title: "End Void Stash",
            seller: "PvPGod",
            price: "$500",
            region: "Asia", // YENİ
            description: "End dünyasında boşlukta, bulunması imkansız.",
            images: ["https://i.imgur.com/example4.jpg"],
            status: "Available"
        }
    ];

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(mockStashes),
    };
};
