const Customer = require('../models/Customer');
const CustomerAddress = require('../models/CustomerAddress');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');

// Check customer by phone number
const checkCustomerByPhone = async (req, res) => {
    try {
        const { phone } = req.query;

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const customer = await Customer.findOne({ phone });

        if (customer) {
            res.json({
                exists: true,
                customer: {
                    _id: customer._id,
                    customerName: customer.customerName,
                    email: customer.email,
                    phone: customer.phone,
                    loyaltyPoints: customer.loyaltyPoints
                }
            });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new customer with loyalty card
const createCustomer = async (req, res) => {
    try {
        const { customerName, email, phone, address } = req.body;

        // Validate required fields
        if (!customerName || !email || !phone) {
            return res.status(400).json({
                message: 'Customer name, email, and phone are required'
            });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingCustomer) {
            return res.status(400).json({
                message: 'Customer with this email or phone already exists'
            });
        }

        // Create customer with initial 0 loyalty points
        const customer = new Customer({
            customerName,
            email,
            phone,
            loyaltyPoints: 0
        });

        const savedCustomer = await customer.save();

        // Create address if provided
        if (address && address.trim()) {
            const customerAddress = new CustomerAddress({
                customerID: savedCustomer._id,
                address: address.trim()
            });
            await customerAddress.save();
        }

        res.status(201).json({
            message: 'Customer created successfully',
            customer: {
                _id: savedCustomer._id,
                customerName: savedCustomer.customerName,
                email: savedCustomer.email,
                phone: savedCustomer.phone,
                loyaltyPoints: savedCustomer.loyaltyPoints
            }
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `Customer with this ${field} already exists`
            });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update customer loyalty points and create transaction
const updateLoyaltyPoints = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { pointsEarned, pointsRedeemed, orderID, totalAmount } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Calculate new loyalty points
        let newPoints = customer.loyaltyPoints;
        if (pointsEarned) newPoints += pointsEarned;
        if (pointsRedeemed) newPoints -= pointsRedeemed;
        newPoints = Math.max(0, newPoints); // Ensure non-negative

        // Update customer
        customer.loyaltyPoints = newPoints;
        const updatedCustomer = await customer.save();

        // Create loyalty transaction
        const transactionID = `LT${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const loyaltyTransaction = new LoyaltyTransaction({
            transactionID,
            customerID: customerId,
            orderID: orderID || null,
            pointsEarned: pointsEarned || 0,
            pointsRedeemed: pointsRedeemed || 0
        });

        await loyaltyTransaction.save();

        res.json({
            message: 'Loyalty points updated successfully',
            customer: {
                _id: updatedCustomer._id,
                customerName: updatedCustomer.customerName,
                email: updatedCustomer.email,
                phone: updatedCustomer.phone,
                loyaltyPoints: updatedCustomer.loyaltyPoints
            },
            loyaltyTransaction: {
                transactionID: loyaltyTransaction.transactionID,
                pointsEarned: loyaltyTransaction.pointsEarned,
                pointsRedeemed: loyaltyTransaction.pointsRedeemed,
                date: loyaltyTransaction.date
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Get customer address
        const address = await CustomerAddress.findOne({ customerID: customerId });

        res.json({
            customer: {
                _id: customer._id,
                customerName: customer.customerName,
                email: customer.email,
                phone: customer.phone,
                loyaltyPoints: customer.loyaltyPoints,
                address: address ? address.address : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Calculate loyalty points (1 point per 100 LKR)
const calculateLoyaltyPoints = (totalAmount) => {
    return Math.floor(totalAmount / 100);
};

// Apply loyalty discount (1 point = 1 LKR discount)
const applyLoyaltyDiscount = (totalAmount, pointsToRedeem) => {
    const discount = pointsToRedeem;
    const finalAmount = totalAmount - discount;
    return {
        discount,
        finalAmount: finalAmount > 0 ? finalAmount : 0
    };
};

module.exports = {
    checkCustomerByPhone,
    createCustomer,
    updateLoyaltyPoints,
    getCustomerById,
    calculateLoyaltyPoints,
    applyLoyaltyDiscount
};
