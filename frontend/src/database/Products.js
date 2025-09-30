const products = [
    {
        productName: "Basmati Rice 5kg",
        expiryDate: "2026-12-31",
        price: 850.00,
        quantityInStock: 150,
        category: "Grains & Cereals",
        supplierID: "507f1f77bcf86cd799439011"
    },
    {
        productName: "Fresh Milk 1L",
        expiryDate: "2026-02-15",
        price: 180.00,
        quantityInStock: 75,
        category: "Dairy Products",
        supplierID: "507f1f77bcf86cd799439012"
    },
    {
        productName: "Brown Bread",
        expiryDate: "2026-02-08",
        price: 120.00,
        quantityInStock: 40,
        category: "Bakery",
        supplierID: "507f1f77bcf86cd799439013"
    },
    {
        productName: "Ceylon Tea 400g",
        expiryDate: "2027-01-20",
        price: 320.00,
        quantityInStock: 200,
        category: "Beverages",
        supplierID: "507f1f77bcf86cd799439014"
    },
    {
        productName: "Chicken Breast 1kg",
        expiryDate: "2026-02-10",
        price: 1200.00,
        quantityInStock: 25,
        category: "Meat & Poultry",
        supplierID: "507f1f77bcf86cd799439015"
    },
    {
        productName: "Red Onions 1kg",
        expiryDate: "2026-02-20",
        price: 280.00,
        quantityInStock: 80,
        category: "Vegetables",
        supplierID: "507f1f77bcf86cd799439016"
    },
    {
        productName: "Bananas 1kg",
        expiryDate: "2026-02-12",
        price: 250.00,
        quantityInStock: 60,
        category: "Fruits",
        supplierID: "507f1f77bcf86cd799439017"
    },
    {
        productName: "Coconut Oil 500ml",
        expiryDate: "2026-08-15",
        price: 450.00,
        quantityInStock: 90,
        category: "Oils & Condiments",
        supplierID: "507f1f77bcf86cd799439018"
    },
    {
        productName: "Dhal 1kg",
        expiryDate: "2026-10-30",
        price: 380.00,
        quantityInStock: 120,
        category: "Pulses & Lentils",
        supplierID: "507f1f77bcf86cd799439019"
    },
    {
        productName: "Sugar 1kg",
        expiryDate: null,
        price: 190.00,
        quantityInStock: 100,
        category: "Spices & Sugar",
        supplierID: "507f1f77bcf86cd799439020"
    },
    {
        productName: "Tomatoes 1kg",
        expiryDate: "2026-02-14",
        price: 320.00,
        quantityInStock: 45,
        category: "Vegetables",
        supplierID: "507f1f77bcf86cd799439016"
    },
    {
        productName: "Yogurt 400g",
        expiryDate: "2026-02-18",
        price: 220.00,
        quantityInStock: 35,
        category: "Dairy Products",
        supplierID: "507f1f77bcf86cd799439012"
    },
    {
        productName: "Fish - Tuna 1kg",
        expiryDate: "2026-02-09",
        price: 1500.00,
        quantityInStock: 20,
        category: "Fish & Seafood",
        supplierID: "507f1f77bcf86cd799439021"
    },
    {
        productName: "Eggs (12 pieces)",
        expiryDate: "2026-02-25",
        price: 360.00,
        quantityInStock: 50,
        category: "Dairy Products",
        supplierID: "507f1f77bcf86cd799439012"
    },
    {
        productName: "Carrots 1kg",
        expiryDate: "2026-02-22",
        price: 180.00,
        quantityInStock: 70,
        category: "Vegetables",
        supplierID: "507f1f77bcf86cd799439016"
    },
    {
        productName: "Apples 1kg",
        expiryDate: "2026-02-28",
        price: 480.00,
        quantityInStock: 40,
        category: "Fruits",
        supplierID: "507f1f77bcf86cd799439017"
    },
    {
        productName: "White Flour 1kg",
        expiryDate: "2026-06-15",
        price: 140.00,
        quantityInStock: 85,
        category: "Grains & Cereals",
        supplierID: "507f1f77bcf86cd799439011"
    },
    {
        productName: "Coconut 1 piece",
        expiryDate: "2026-02-16",
        price: 80.00,
        quantityInStock: 30,
        category: "Fruits",
        supplierID: "507f1f77bcf86cd799439017"
    },
    {
        productName: "Curd 400ml",
        expiryDate: "2026-02-20",
        price: 160.00,
        quantityInStock: 45,
        category: "Dairy Products",
        supplierID: "507f1f77bcf86cd799439012"
    },
    {
        productName: "Green Beans 500g",
        expiryDate: "2026-02-17",
        price: 220.00,
        quantityInStock: 25,
        category: "Vegetables",
        supplierID: "507f1f77bcf86cd799439016"
    },
    {
        productName: "Instant Noodles",
        expiryDate: "2026-12-01",
        price: 80.00,
        quantityInStock: 150,
        category: "Instant Foods",
        supplierID: "507f1f77bcf86cd799439022"
    },
    {
        productName: "Biscuits Marie 300g",
        expiryDate: "2026-04-30",
        price: 120.00,
        quantityInStock: 65,
        category: "Snacks",
        supplierID: "507f1f77bcf86cd799439023"
    },
    {
        productName: "Chili Powder 100g",
        expiryDate: "2026-11-20",
        price: 150.00,
        quantityInStock: 80,
        category: "Spices & Sugar",
        supplierID: "507f1f77bcf86cd799439020"
    },
    {
        productName: "Soap Bar",
        expiryDate: null,
        price: 95.00,
        quantityInStock: 200,
        category: "Personal Care",
        supplierID: "507f1f77bcf86cd799439024"
    },
    {
        productName: "Shampoo 400ml",
        expiryDate: "2026-01-15",
        price: 480.00,
        quantityInStock: 30,
        category: "Personal Care",
        supplierID: "507f1f77bcf86cd799439024"
    }
];

module.exports = products;
