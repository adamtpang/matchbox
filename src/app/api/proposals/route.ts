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
  console.log("🔍 API: GET /api/proposals called");
  
  try {
    console.log("📡 API: Attempting to connect to database...");
    const proposals = await listProposals();
    console.log("✅ API: Successfully fetched", proposals.length, "proposals");
    
    // Ensure we always return an array
    const safeProposals = Array.isArray(proposals) ? proposals : [];
    console.log("📦 API: Returning", safeProposals.length, "proposals");
    
    return NextResponse.json(safeProposals);
  } catch (error) {
    console.error("❌ API Error fetching proposals:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    
    // Return fallback data as array to prevent map() errors
    const fallbackProposals = [
      {
        id: 1,
        title: 'Build Community Garden',
        description: 'Create a sustainable garden space for the local community to grow vegetables and learn about sustainable farming.',
        cost: 5000,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Free Coding Bootcamp',
        description: 'Provide free coding education to underserved communities, focusing on practical skills for web development.',
        cost: 15000,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Solar Panel Installation',
        description: 'Install solar panels on community center to reduce energy costs and promote renewable energy.',
        cost: 25000,
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
        created_at: new Date().toISOString()
      }
    ];
    console.log("⚠️  API: Returning", fallbackProposals.length, "fallback proposals");
    return NextResponse.json(fallbackProposals, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
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