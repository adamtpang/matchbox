import { sql } from "@vercel/postgres";

export interface Proposal {
  id: number;
  title: string;
  description: string;
  cost: number;
  image?: string;
  wallet?: string;
  created_at: string;
}

export interface Pledge {
  id: number;
  proposal_id: number;
  wallet: string;
  amount: number;
  tx_hash: string;
  verified: boolean;
  created_at: string;
}

export async function createProposal(p: {
  title: string;
  description: string;
  cost: number;
  image?: string;
  wallet?: string;
}) {
  await sql`CREATE TABLE IF NOT EXISTS proposals(
    id serial primary key,
    title text,
    description text,
    cost numeric,
    image text,
    wallet text,
    created_at timestamptz default now()
  )`;
  
  const result = await sql`INSERT INTO proposals (title, description, cost, image, wallet)
            VALUES (${p.title}, ${p.description}, ${p.cost}, ${p.image || null}, ${p.wallet || null})
            RETURNING id`;
  return result.rows[0];
}

export async function listProposals(): Promise<Proposal[]> {
  console.log("📊 DB: listProposals() called");
  
  // Check if database is configured
  if (!process.env.POSTGRES_URL) {
    console.log("⚠️  DB: No POSTGRES_URL found, returning fallback data");
    return getFallbackProposals();
  }
  
  try {
    await sql`CREATE TABLE IF NOT EXISTS proposals(
      id serial primary key,
      title text,
      description text,
      cost numeric,
      image text,
      wallet text,
      created_at timestamptz default now()
    )`;
    
    const { rows } = await sql`SELECT * FROM proposals ORDER BY created_at DESC`;
    
    // If no proposals exist, insert some demo data
    if (rows.length === 0) {
      await sql`INSERT INTO proposals (title, description, cost, image) VALUES 
        ('Build Community Garden', 'Create a sustainable garden space for the local community to grow vegetables and learn about sustainable farming.', 5000, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'),
        ('Free Coding Bootcamp', 'Provide free coding education to underserved communities, focusing on practical skills for web development.', 15000, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'),
        ('Solar Panel Installation', 'Install solar panels on community center to reduce energy costs and promote renewable energy.', 25000, 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400')`;
      
      const { rows: newRows } = await sql`SELECT * FROM proposals ORDER BY created_at DESC`;
      return newRows as Proposal[];
    }
    
    return rows as Proposal[];
  } catch (error) {
    console.error('❌ DB: Database error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return getFallbackProposals();
  }
}

function getFallbackProposals(): Proposal[] {
  console.log("📦 DB: Returning fallback proposal data");
  return [
    {
      id: 1,
      title: 'NS Community: Folding Tables',
      description: 'Purchase 10 folding tables for NS events, workshops, and community gatherings. High-quality, portable tables that can be used for years.',
      cost: 500,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'NS Community: Art Easels',
      description: 'Art easels for NS creative workshops, painting sessions, and design thinking activities. Support the artistic side of our community.',
      cost: 300,
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'NS Community: Drum Kit',
      description: 'Complete drum kit for music sessions, team building, and creative expression. Bring rhythm to our space.',
      cost: 800,
      image: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=400',
      created_at: new Date().toISOString()
    }
  ] as Proposal[];
}

export async function getProposal(id: number): Promise<Proposal | null> {
  const { rows } = await sql`SELECT * FROM proposals WHERE id = ${id}`;
  return rows[0] as Proposal || null;
}

export async function createPledge(p: {
  proposal_id: number;
  wallet: string;
  amount: number;
  tx_hash: string;
}) {
  await sql`CREATE TABLE IF NOT EXISTS pledges(
    id serial primary key,
    proposal_id integer references proposals(id),
    wallet text,
    amount numeric,
    tx_hash text unique,
    verified boolean default false,
    created_at timestamptz default now()
  )`;
  
  const result = await sql`INSERT INTO pledges (proposal_id, wallet, amount, tx_hash)
            VALUES (${p.proposal_id}, ${p.wallet}, ${p.amount}, ${p.tx_hash})
            RETURNING id`;
  return result.rows[0];
}

export async function getPledgesForProposal(proposalId: number): Promise<Pledge[]> {
  await sql`CREATE TABLE IF NOT EXISTS pledges(
    id serial primary key,
    proposal_id integer references proposals(id),
    wallet text,
    amount numeric,
    tx_hash text unique,
    verified boolean default false,
    created_at timestamptz default now()
  )`;
  
  const { rows } = await sql`SELECT * FROM pledges WHERE proposal_id = ${proposalId} AND verified = true ORDER BY created_at DESC`;
  return rows as Pledge[];
}

export async function verifyPledge(txHash: string) {
  await sql`UPDATE pledges SET verified = true WHERE tx_hash = ${txHash}`;
}