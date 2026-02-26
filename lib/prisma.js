// lib/prisma.js [REFRESHED]

import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma';

dotenv.config();

// Create Neon adapter
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// Construct PrismaClient with adapter
export const db = globalThis.db || new PrismaClient({ adapter });

// Reuse PrismaClient in development to avoid multiple connections
if (process.env.NODE_ENV !== 'production') {
  globalThis.db = db;
}