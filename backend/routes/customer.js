const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// POST /api/customer/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, lat, lng } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await Customer.findOne({ $or: [{ email }, { mobile }] });
    if (existing) {
      return res.status(409).json({ message: 'Customer already exists' });
    }

    const customerData = { name, email, mobile };
    if (lat && lng) {
      customerData.location = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };
    }

    const customer = new Customer(customerData);
    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully', customer });
  } catch (error) {
    console.error('Customer register error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;