"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { PledgeButton } from "./pledge-button";
import type { Proposal } from "@/lib/db";

export function ProposalList() {
  const { isConnected } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/proposals");
      const data = await response.json();
      setProposals(data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading proposals...</div>;
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No proposals yet. Be the first to submit one!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Proposals</h2>
      <div className="grid gap-6">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{proposal.title}</h3>
                <p className="text-gray-600 mb-4">{proposal.description}</p>
                {proposal.image && (
                  <img 
                    src={proposal.image} 
                    alt={proposal.title}
                    className="w-full max-w-md h-48 object-cover rounded-md mb-4"
                  />
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${proposal.cost.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Requested • {new Date(proposal.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {isConnected && (
                <PledgeButton 
                  proposalId={proposal.id}
                  requestedAmount={proposal.cost}
                  onPledgeComplete={fetchProposals}
                />
              )}
            </div>
            
            <div className="mt-4 bg-gray-100 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-2">
                Progress: $0 raised + NS matching
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: "0%"}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}