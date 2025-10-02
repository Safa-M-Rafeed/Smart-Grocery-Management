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

// Check customer by email and return loyalty card status
const checkCustomerByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const customer = await Customer.findOne({ email });
    
    if (customer) {
      res.json({ 
        exists: true,
        hasLoyaltyCard: !!customer.phone, // Has loyalty card if phone exists
        customer: {
          _id: customer._id,
          customerName: customer.customerName,
          email: customer.email,
          phone: customer.phone,
          loyaltyPoints: customer.loyaltyPoints
        }
      });
    } else {
      res.json({ exists: false, hasLoyaltyCard: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add phone number to existing customer (for loyalty card)
const addPhoneToExistingCustomer = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ 
        message: 'Email and phone number are required' 
      });
    }

    // Check if phone number already exists with another customer
    const existingPhoneCustomer = await Customer.findOne({ phone });
    if (existingPhoneCustomer && existingPhoneCustomer.email !== email) {
      return res.status(400).json({ 
        message: 'This phone number is already associated with another customer' 
      });
    }

    // Find customer by email and update phone
    const customer = await Customer.findOneAndUpdate(
      { email },
      { phone },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'Phone number added successfully - Loyalty card activated',
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

    // Check if phone number already exists
    const existingCustomerByPhone = await Customer.findOne({ phone });
    if (existingCustomerByPhone) {
      return res.status(400).json({ 
        message: 'This phone number is already associated with another customer' 
      });
    }

    // Check if email already exists
    const existingCustomerByEmail = await Customer.findOne({ email });
    if (existingCustomerByEmail) {
      return res.status(400).json({ 
        message: 'Customer with this email already exists. Use "Add Phone to Existing Customer" option.' 
      });
    }

    // Create new customer with loyalty card
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
      message: 'New customer and loyalty card created successfully',
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
      const duplicateField = Object.keys(error.keyPattern)[0];
      if (duplicateField === 'phone') {
        return res.status(400).json({ 
          message: 'This phone number is already associated with another customer' 
        });
      }
      return res.status(400).json({ 
        message: 'Customer already exists' 
      });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  checkCustomerByPhone,
  checkCustomerByEmail,
  addPhoneToExistingCustomer,
  createCustomer
};
 