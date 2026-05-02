const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Customer = require('../models/customer');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const googleClient = new OAuth2Client();

async function verifyGoogleCredential(credential, clientId) {
  const configuredAudience = process.env.GOOGLE_CLIENT_ID || clientId || '';
  const audience = configuredAudience
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (!credential) {
    throw new Error('Google credential is required');
  }

  if (!audience.length) {
    throw new Error('Google client ID is not configured on the server');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error('Unable to verify Google account email');
  }

  return payload;
}

router.post('/login', async (req, res) => {
  try {
    const { email, name, picture, googleId, emailVerified, credential, clientId } = req.body;

    let resolvedEmail = email;
    let resolvedName = name;
    let resolvedPicture = picture;
    let resolvedGoogleId = googleId;
    let resolvedEmailVerified = emailVerified;

    if (credential) {
      const verifiedProfile = await verifyGoogleCredential(credential, clientId);
      resolvedEmail = verifiedProfile.email;
      resolvedName = verifiedProfile.name || verifiedProfile.given_name || resolvedEmail?.split('@')[0];
      resolvedPicture = verifiedProfile.picture || picture;
      resolvedGoogleId = verifiedProfile.sub;
      resolvedEmailVerified = verifiedProfile.email_verified;
    }

    if (!resolvedEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let customer = await Customer.findOne({ email: resolvedEmail });

    if (!customer) {
      customer = await Customer.create({
        email: resolvedEmail,
        name: resolvedName || resolvedEmail.split('@')[0],
        googleId: resolvedGoogleId || undefined,
        profilePicture: resolvedPicture || undefined,
        isVerified: resolvedEmailVerified !== false
      });
    } else {
      let shouldSave = false;

      if (resolvedGoogleId && customer.googleId !== resolvedGoogleId) {
        customer.googleId = resolvedGoogleId;
        shouldSave = true;
      }

      if (resolvedName && customer.name !== resolvedName) {
        customer.name = resolvedName;
        shouldSave = true;
      }

      if (resolvedPicture && customer.profilePicture !== resolvedPicture) {
        customer.profilePicture = resolvedPicture;
        shouldSave = true;
      }

      if (resolvedEmailVerified === true && customer.isVerified !== true) {
        customer.isVerified = true;
        shouldSave = true;
      }

      if (shouldSave) {
        await customer.save();
      }
    }

    const customerObject = customer.toObject();

    const token = jwt.sign(
      {
        userId: customerObject._id.toString(),
        email: customerObject.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ...customerObject,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).lean();
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update notification preferences + language
router.put('/:id/profile', async (req, res) => {
  try {
    const { name, phone, gender } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (gender !== undefined) update.gender = gender;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).lean();

    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/notification-preferences', async (req, res) => {
  try {
    const { email, push, promos, language } = req.body;
    const update = {};
    if (email !== undefined || push !== undefined || promos !== undefined) {
      update.notificationPreferences = {};
      if (email !== undefined) update['notificationPreferences.email'] = email;
      if (push !== undefined) update['notificationPreferences.push'] = push;
      if (promos !== undefined) update['notificationPreferences.promos'] = promos;
    }
    if (language) update.language = language;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).lean();

    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/push-subscription', async (req, res) => {
  try {
    const { subscription } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: { pushSubscription: subscription || null } },
      { new: true }
    ).lean();

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      message: 'Push subscription updated',
      pushSubscription: customer.pushSubscription || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/language', async (req, res) => {
  try {
    const { language } = req.body;

    if (!language) {
      return res.status(400).json({ error: 'Language is required' });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: { language } },
      { new: true }
    ).lean();

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
