const Customer = require('../models/Customer');
const CustomerAddress = require('../models/CustomerAddress');

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

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingCustomer) {
            return res.status(400).json({
                message: 'Customer with this email or phone already exists'
            });
        }

        // Create customer
        const customer = new Customer({
            customerName,
            email,
            phone,
            loyaltyPoints: 0
        });

        await customer.save();

        // Create address if provided
        if (address) {
            const customerAddress = new CustomerAddress({
                customerID: customer._id,
                address
            });
            await customerAddress.save();
        }

        res.status(201).json({
            message: 'Loyalty card created successfully',
            customer: {
                _id: customer._id,
                customerName: customer.customerName,
                email: customer.email,
                phone: customer.phone,
                loyaltyPoints: customer.loyaltyPoints
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
    calculateLoyaltyPoints,
    applyLoyaltyDiscount
};
