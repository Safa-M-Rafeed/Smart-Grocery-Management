const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Import models
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Staff = require('../models/Staff');
const Delivery = require('../models/Delivery');
const CustomerAddress = require('../models/CustomerAddress');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Generate unique IDs
const generateID = (prefix) => {
  return prefix + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Seed data
const seedData = async () => {
  try {
    // Drop existing collections to clear indexes
    await mongoose.connection.db.dropCollection('customers').catch(() => {});
    await mongoose.connection.db.dropCollection('products').catch(() => {});
    await mongoose.connection.db.dropCollection('orders').catch(() => {});
    await mongoose.connection.db.dropCollection('orderitems').catch(() => {});
    await mongoose.connection.db.dropCollection('staffs').catch(() => {});
    await mongoose.connection.db.dropCollection('deliveries').catch(() => {});
    await mongoose.connection.db.dropCollection('customeraddresses').catch(() => {});

    console.log('Cleared existing data and indexes');

    // Create customers
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customers = [
      {
        customerName: "Randeesh Vimodya",
        email: "randeesh@gmail.com",
        password: customerPassword,
        phone: "0704910990",
        loyaltyPoints: 150
      },
      {
        customerName: "Danushka Kumara",
        email: "danushka@gmail.com",
        password: customerPassword,
        phone: "0714223249",
        loyaltyPoints: 75
      },
      {
        customerName: "Kavishka Dulshan",
        email: "kavishka@gmail.com",
        password: customerPassword,
        phone: "0727996589",
        loyaltyPoints: 200
      },
      {
        customerName: "Kavith Hirusha",
        email: "kavith@gmail.com",
        password: customerPassword,
        phone: "0752119504",
        loyaltyPoints: 50
      },
      {
        customerName: "Kaveesha Randunu",
        email: "kaveesha@gmail.com",
        password: customerPassword,
        phone: "0779559167",
        loyaltyPoints: 300
      }
    ];

    const createdCustomers = await Customer.insertMany(customers);
    console.log('Created customers');

    // Create customer addresses
    const addresses = [
      {
        customerID: createdCustomers[0]._id,
        address: "123 Galle Road, Colombo 03, Sri Lanka"
      },
      {
        customerID: createdCustomers[1]._id,
        address: "456 Kandy Road, Kandy, Sri Lanka"
      },
      {
        customerID: createdCustomers[2]._id,
        address: "789 Negombo Road, Negombo, Sri Lanka"
      },
      {
        customerID: createdCustomers[3]._id,
        address: "321 Matara Road, Galle, Sri Lanka"
      },
      {
        customerID: createdCustomers[4]._id,
        address: "654 Anuradhapura Road, Kurunegala, Sri Lanka"
      }
    ];

    await CustomerAddress.insertMany(addresses);
    console.log('Created customer addresses');

    // Create products
    const products = [
      {
        productName: "Fresh Apples",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        price: 150, // 150 LKR
        quantityInStock: 50,
        category: "Fruits"
      },
      {
        productName: "Organic Bananas",
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        price: 200, // 200 LKR
        quantityInStock: 30,
        category: "Fruits"
      },
      {
        productName: "Whole Milk",
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        price: 180, // 180 LKR
        quantityInStock: 25,
        category: "Dairy"
      },
      {
        productName: "Fresh Bread",
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        price: 120, // 120 LKR
        quantityInStock: 20,
        category: "Bakery"
      },
      {
        productName: "Organic Spinach",
        expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        price: 100, // 100 LKR
        quantityInStock: 15,
        category: "Vegetables"
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log('Created products');

    // Create delivery staff
    const hashedPassword = await bcrypt.hash('delivery123', 10);
    const deliveryStaff = [
      {
        staffID: generateID('DS'),
        staffName: "Amish Tharanya",
        email: "amish@gmail.com",
        password: hashedPassword,
        role: "Delivery Staff",
        salary: 35000,
        contactNo: "034223137",
        isActive: true
      },
      
    ];

    const createdStaff = await Staff.insertMany(deliveryStaff);
    console.log('Created delivery staff');

    // Create orders
    const orders = [
      {
        orderID: generateID('ORD'),
        customerID: createdCustomers[0]._id,
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "Ready for Delivery",
        totalAmount: 650, // 650 LKR (450 + 200 delivery fee)
        paymentStatus: "Paid",
        paymentMethod: "Cash on Delivery",
        deliveryAddress: "123 Galle Road, Colombo 03, Sri Lanka",
        specialInstructions: "Leave at front door if no answer"
      },
      {
        orderID: generateID('ORD'),
        customerID: createdCustomers[1]._id,
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: "Ready for Delivery",
        totalAmount: 820, // 820 LKR (620 + 200 delivery fee)
        paymentStatus: "Paid",
        paymentMethod: "Online Payment",
        deliveryAddress: "456 Kandy Road, Kandy, Sri Lanka",
        specialInstructions: "Ring doorbell twice"
      },
      {
        orderID: generateID('ORD'),
        customerID: createdCustomers[2]._id,
        orderDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: "Ready for Delivery",
        totalAmount: 500, // 500 LKR (300 + 200 delivery fee)
        paymentStatus: "Paid",
        paymentMethod: "Cash on Delivery",
        deliveryAddress: "789 Negombo Road, Negombo, Sri Lanka",
        specialInstructions: "Call before delivery"
      }
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log('Created orders');

    // Create order items
    const orderItems = [
      // Order 1 items
      {
        orderID: createdOrders[0]._id,
        productID: createdProducts[0]._id,
        quantity: 3,
        subtotal: 450 // 3 * 150 LKR
      },
      {
        orderID: createdOrders[0]._id,
        productID: createdProducts[2]._id,
        quantity: 2,
        subtotal: 360 // 2 * 180 LKR
      },
      // Order 2 items
      {
        orderID: createdOrders[1]._id,
        productID: createdProducts[1]._id,
        quantity: 5,
        subtotal: 1000 // 5 * 200 LKR
      },
      {
        orderID: createdOrders[1]._id,
        productID: createdProducts[3]._id,
        quantity: 2,
        subtotal: 240 // 2 * 120 LKR
      },
      // Order 3 items
      {
        orderID: createdOrders[2]._id,
        productID: createdProducts[4]._id,
        quantity: 2,
        subtotal: 200 // 2 * 100 LKR
      },
      {
        orderID: createdOrders[2]._id,
        productID: createdProducts[2]._id,
        quantity: 1,
        subtotal: 180 // 1 * 180 LKR
      }
    ];

    await OrderItem.insertMany(orderItems);
    console.log('Created order items');

    // Create deliveries with Sri Lankan coordinates
    const deliveries = [
      {
        deliveryID: generateID('DEL'),
        orderID: createdOrders[0]._id,
        deliveryDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        deliveryStatus: "Pending",
        staffID: createdStaff[0]._id,
        estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        latitude: 6.9271, // Colombo
        longitude: 79.8612
      },
      {
        deliveryID: generateID('DEL'),
        orderID: createdOrders[1]._id,
        deliveryDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
        deliveryStatus: "Pending",
        staffID: createdStaff[1]._id,
        estimatedDeliveryTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
        latitude: 7.2906, // Kandy
        longitude: 80.6337
      },
      {
        deliveryID: generateID('DEL'),
        orderID: createdOrders[2]._id,
        deliveryDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
        deliveryStatus: "In Transit",
        staffID: createdStaff[0]._id,
        estimatedDeliveryTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
        latitude: 7.2088, // Negombo
        longitude: 79.8356
      }
    ];

    // Add some additional delivery locations for demonstration
    const additionalDeliveries = [
      {
        deliveryID: generateID('DEL'),
        orderID: createdOrders[0]._id, // Reuse existing order for demo
        deliveryDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        deliveryStatus: "Pending",
        staffID: createdStaff[1]._id,
        estimatedDeliveryTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        latitude: 6.0535, // Galle
        longitude: 80.2210
      },
      {
        deliveryID: generateID('DEL'),
        orderID: createdOrders[1]._id, // Reuse existing order for demo
        deliveryDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
        deliveryStatus: "Delivered",
        staffID: createdStaff[0]._id,
        estimatedDeliveryTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
        latitude: 7.8731, // Anuradhapura
        longitude: 80.7718
      }
    ];

    const allDeliveries = [...deliveries, ...additionalDeliveries];

    await Delivery.insertMany(allDeliveries);
    console.log('Created deliveries');

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdCustomers.length} customers created`);
    console.log(`- ${products.length} products created`);
    console.log(`- ${createdStaff.length} delivery staff created`);
    console.log(`- ${createdOrders.length} orders created`);
    console.log(`- ${orderItems.length} order items created`);
    console.log(`- ${allDeliveries.length} deliveries created`);
    
    console.log('\n🔑 Delivery Staff Login Credentials:');
    console.log('Email: alex.rodriguez@store.com | Password: delivery123');
    console.log('Email: maria.garcia@store.com | Password: delivery123');
    
    console.log('\n🛒 Customer Login Credentials:');
    console.log('Email: john.smith@email.com | Password: customer123');
    console.log('Email: sarah.johnson@email.com | Password: customer123');
    console.log('Email: mike.wilson@email.com | Password: customer123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
connectDB().then(() => {
  seedData();
});
