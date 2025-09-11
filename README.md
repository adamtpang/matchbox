# NS Crowdfund

Network State Community Crowdfunding Platform - Real crypto pledges with 1:1 NS matching.

## Features

- **Wallet Connect**: EVM wallets via RainbowKit (Base L2 focus)
- **Real Pledges**: USDC transfers to multisig Safe on Base
- **Member Gating**: NS Admit NFT holder verification
- **Proposal System**: Community-driven funding requests
- **1:1 Matching**: NS matches community pledges dollar-for-dollar

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd matchbox
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your `.env.local`:
   - `NEXT_PUBLIC_WALLETCONNECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com)
   - `POSTGRES_URL`: Vercel Postgres connection string
   - `NEXT_PUBLIC_SAFE_ADDRESS`: Base L2 Safe multisig address
   - `NEXT_PUBLIC_NS_ADMIT_CONTRACT`: NS membership NFT contract

3. **Database Setup**
   - Deploy to Vercel to get Postgres instance
   - Tables auto-create on first API call

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Architecture

### Smart Contracts
- **USDC Base**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Safe Multisig**: Controlled by NS core team (2-3 signers)
- **NS Admit NFT**: Membership verification contract

### Database Schema
```sql
proposals: id, title, description, cost, image, wallet, created_at
pledges: id, proposal_id, wallet, amount, tx_hash, verified, created_at
```

### API Endpoints
- `GET /api/proposals` - List all proposals
- `POST /api/proposals` - Create new proposal (members only)
- `POST /api/pledges` - Record verified pledge

## Deployment

1. **Vercel Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Environment Variables**
   - Add all `.env.local` vars to Vercel dashboard
   - Enable Vercel Postgres integration

3. **Safe Setup**
   - Deploy Safe on Base with NS signers
   - Update `NEXT_PUBLIC_SAFE_ADDRESS`

## Security Features

- Rate limiting on proposal creation
- Member-only proposal submission
- On-chain transaction verification
- Multisig fund management

## Demo Flow

1. Connect wallet (Base network)
2. Check NS membership (NFT balance)
3. Submit proposal if member
4. Pledge USDC to Safe
5. Transaction verified on-chain
6. Progress tracked with NS matching

## For Balaji

"We shipped a working v0 at nscrowdfund.vercel.app."

- Pledges are on-chain USDC to a Safe on Base
- Matching is automatic in the UI  
- Members gated by NS Admit NFT
- Request: $5-10k match budget for 30-day pilot

Ready to extend to full CapEx queue + DAO vote system.
