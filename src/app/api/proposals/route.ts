import { NextResponse } from "next/server";
import { z } from "zod";
import { createProposal, listProposals } from "@/lib/db";

const CreateProposalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cost: z.number().positive("Cost must be positive").max(50_000, "Cost cannot exceed $50,000"),
  image: z.string().url().optional(),
  wallet: z.string().optional()
});

export async function GET() {
  try {
    const proposals = await listProposals();
    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateProposalSchema.parse(body);
    const result = await createProposal(data);
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating proposal:", error);
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
  }
}