const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');

// Utility to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/salon/register
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, address, lat, lng } = req.body;
    if (!name || !mobile || !address || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let salon = await Salon.findOne({ mobile });
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (salon) {
      // Update OTP for verification
      salon.otp = { code: otpCode, expiresAt: otpExpiry };
      await salon.save();
      // TODO: Integrate SMS service to send otpCode to mobile
      return res.status(200).json({ message: 'OTP sent for verification' });
    }

    // Create new salon
    salon = new Salon({
      name,
      mobile,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      otp: { code: otpCode, expiresAt: otpExpiry },
      verified: false
    });
    await salon.save();

    // TODO: Send OTP via SMS

    res.status(201).json({ message: 'Salon registered. OTP sent for verification' });
  } catch (error) {
    console.error('Salon register error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/salon/verify
router.post('/verify', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Missing mobile or OTP' });
    }

    const salon = await Salon.findOne({ mobile });
    if (!salon) return res.status(404).json({ message: 'Salon not found' });

    if (salon.otp && salon.otp.code === otp && salon.otp.expiresAt > new Date()) {
      salon.verified = true;
      salon.otp = undefined;
      await salon.save();
      return res.status(200).json({ message: 'Salon verified successfully' });
    }

    res.status(400).json({ message: 'Invalid or expired OTP' });
  } catch (error) {
    console.error('Salon verify error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/salon/nearby?lat=&lng=&radius=5000
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Missing latitude or longitude' });
    }

    const salons = await Salon.find({
      verified: true,
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius)
        }
      }
    }).select('-otp');

    res.status(200).json({ salons });
  } catch (error) {
    console.error('Nearby salons error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;