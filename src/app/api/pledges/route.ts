import { NextResponse } from "next/server";
import { z } from "zod";
import { createPledge, verifyPledge } from "@/lib/db";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const CreatePledgeSchema = z.object({
  proposal_id: z.number().positive(),
  wallet: z.string().startsWith("0x"),
  amount: z.number().positive(),
  tx_hash: z.string().startsWith("0x")
});

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const client = createPublicClient({
  chain: base,
  transport: http()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreatePledgeSchema.parse(body);
    
    // Verify the transaction on-chain
    const receipt = await client.getTransactionReceipt({
      hash: data.tx_hash as `0x${string}`
    });
    
    if (!receipt.status) {
      return NextResponse.json({ error: "Transaction failed" }, { status: 400 });
    }
    
    // Check if transaction is a USDC transfer to our Safe
    const usdcTransferLog = receipt.logs.find(log => 
      log.address.toLowerCase() === USDC_ADDRESS.toLowerCase() &&
      log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" // Transfer topic
    );
    
    if (!usdcTransferLog) {
      return NextResponse.json({ error: "No USDC transfer found in transaction" }, { status: 400 });
    }
    
    // Create the pledge
    const result = await createPledge(data);
    
    // Mark as verified since we confirmed the transaction
    await verifyPledge(data.tx_hash);
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating pledge:", error);
    return NextResponse.json({ error: "Failed to create pledge" }, { status: 500 });
  }
}