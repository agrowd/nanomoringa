import { NextResponse } from "next/server"
import { sql } from '@vercel/postgres'

export async function POST() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        slug VARCHAR UNIQUE NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT,
        price INTEGER NOT NULL,
        compare_at INTEGER,
        category VARCHAR NOT NULL,
        sizes TEXT[] NOT NULL DEFAULT '{}',
        colors TEXT[] NOT NULL DEFAULT '{}',
        images TEXT[] NOT NULL DEFAULT '{}',
        videos TEXT[] NOT NULL DEFAULT '{}',
        tags TEXT[] NOT NULL DEFAULT '{}',
        stock INTEGER NOT NULL DEFAULT 0,
        featured BOOLEAN NOT NULL DEFAULT false,
        sku VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_on_sale BOOLEAN NOT NULL DEFAULT false,
        sale_price INTEGER,
        sale_start_date TIMESTAMP,
        sale_end_date TIMESTAMP,
        sale_duration_days INTEGER DEFAULT 7
      )
    `
    
    return NextResponse.json({ message: "Database initialized successfully" })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json({ error: "Error initializing database" }, { status: 500 })
  }
}
