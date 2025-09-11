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
  return rows as Proposal[];
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