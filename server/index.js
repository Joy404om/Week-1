import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { z } from 'zod';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const db = new Database('/workspace/server/bookmyglow.db');
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS salons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL UNIQUE,
    address TEXT,
    mapLink TEXT,
    lat REAL,
    lng REAL,
    verified INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS salon_otps (
    mobile TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expiresAt INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_salons_verified ON salons(verified);
`);

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);
const generateOtp = customAlphabet('0123456789', 6);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function parseLatLngFromGoogleMapsLink(link) {
  if (!link) return null;
  try {
    const url = new URL(link);
    // Pattern 1: q=lat,lng
    const q = url.searchParams.get('q');
    if (q) {
      const parts = q.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        const lat = Number(parts[0]);
        const lng = Number(parts[1]);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          return { lat, lng };
        }
      }
    }
    // Pattern 2: .../@lat,lng,zoom
    const atIndex = url.pathname.indexOf('@');
    if (atIndex !== -1) {
      const afterAt = url.pathname.slice(atIndex + 1);
      const parts = afterAt.split(',');
      if (parts.length >= 2) {
        const lat = Number(parts[0]);
        const lng = Number(parts[1]);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          return { lat, lng };
        }
      }
    }
    // Pattern 3: /?ll=lat,lng
    const ll = url.searchParams.get('ll');
    if (ll) {
      const [latStr, lngStr] = ll.split(',');
      const lat = Number(latStr);
      const lng = Number(lngStr);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return { lat, lng };
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function haversineDistanceKm(aLat, aLng, bLat, bLng) {
  const R = 6371; // km
  const dLat = toRadians(bLat - aLat);
  const dLng = toRadians(bLng - aLng);
  const lat1 = toRadians(aLat);
  const lat2 = toRadians(bLat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const customerLoginSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  mobile: z.string().min(7).max(20)
});

app.post('/api/customer/login', (req, res) => {
  const parseResult = customerLoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input', details: parseResult.error.flatten() });
  }
  const { name, email, mobile } = parseResult.data;
  const nowIso = new Date().toISOString();
  const existing = db.prepare('SELECT * FROM customers WHERE mobile = ?').get(mobile);
  let customer;
  if (existing) {
    db.prepare('UPDATE customers SET name = ?, email = ? WHERE id = ?').run(name, email, existing.id);
    customer = { ...existing, name, email };
  } else {
    const id = nanoid();
    db.prepare('INSERT INTO customers (id, name, email, mobile, createdAt) VALUES (?, ?, ?, ?, ?)')
      .run(id, name, email, mobile, nowIso);
    customer = { id, name, email, mobile, createdAt: nowIso };
  }
  const token = signToken({ sub: customer.id, role: 'customer' });
  return res.json({ token, customer });
});

const salonLoginStartSchema = z.object({
  name: z.string().min(2).max(120),
  mobile: z.string().min(7).max(20),
  address: z.string().min(5).max(300),
  mapLink: z.string().min(5).max(1000)
});

app.post('/api/salon/login-start', (req, res) => {
  const parseResult = salonLoginStartSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input', details: parseResult.error.flatten() });
  }
  const { name, mobile, address, mapLink } = parseResult.data;
  const coords = parseLatLngFromGoogleMapsLink(mapLink);
  const nowIso = new Date().toISOString();
  const existing = db.prepare('SELECT * FROM salons WHERE mobile = ?').get(mobile);

  if (existing) {
    db.prepare('UPDATE salons SET name = ?, address = ?, mapLink = ?, lat = ?, lng = ? WHERE id = ?')
      .run(name, address, mapLink, coords?.lat ?? null, coords?.lng ?? null, existing.id);
  } else {
    const id = nanoid();
    db.prepare('INSERT INTO salons (id, name, mobile, address, mapLink, lat, lng, verified, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, name, mobile, address, mapLink, coords?.lat ?? null, coords?.lng ?? null, 0, nowIso);
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  db.prepare('INSERT INTO salon_otps (mobile, otp, expiresAt) VALUES (?, ?, ?) ON CONFLICT(mobile) DO UPDATE SET otp = excluded.otp, expiresAt = excluded.expiresAt')
    .run(mobile, otp, expiresAt);

  // Simulate sending OTP via SMS
  console.log(`[BookMyGlow] OTP for ${mobile}: ${otp} (valid 5 min)`);

  return res.json({ otpSent: true, mobile, debugOtp: process.env.NODE_ENV === 'production' ? undefined : otp });
});

const salonVerifySchema = z.object({
  mobile: z.string().min(7).max(20),
  otp: z.string().length(6)
});

app.post('/api/salon/verify-otp', (req, res) => {
  const parseResult = salonVerifySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input', details: parseResult.error.flatten() });
  }
  const { mobile, otp } = parseResult.data;
  const record = db.prepare('SELECT * FROM salon_otps WHERE mobile = ?').get(mobile);
  if (!record) {
    return res.status(400).json({ error: 'OTP not found. Start login again.' });
  }
  if (Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }
  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP.' });
  }

  db.prepare('DELETE FROM salon_otps WHERE mobile = ?').run(mobile);
  db.prepare('UPDATE salons SET verified = 1 WHERE mobile = ?').run(mobile);
  const salon = db.prepare('SELECT * FROM salons WHERE mobile = ?').get(mobile);
  const token = signToken({ sub: salon.id, role: 'salon' });
  return res.json({ token, salon });
});

app.get('/api/salons/nearby', (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 5;
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: 'lat and lng query params are required numbers' });
  }
  const salons = db.prepare('SELECT id, name, address, mapLink, lat, lng FROM salons WHERE verified = 1 AND lat IS NOT NULL AND lng IS NOT NULL').all();
  const withDistance = salons.map(s => {
    const distanceKm = haversineDistanceKm(lat, lng, s.lat, s.lng);
    return { ...s, distanceKm };
  }).filter(s => s.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  return res.json({ results: withDistance });
});

app.get('/api/health', (_req, res) => {
  return res.json({ ok: true });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`BookMyGlow server running on http://localhost:${PORT}`);
});

