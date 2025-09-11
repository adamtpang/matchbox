"use client";
import { useState } from "react";
import { parseUnits } from "viem";
import { useWriteContract, useAccount } from "wagmi";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const SAFE_ADDRESS = process.env.NEXT_PUBLIC_SAFE_ADDRESS || "0x1234567890123456789012345678901234567890"; // Demo address

const USDC_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ type: "bool" }]
  }
];

interface PledgeButtonProps {
  proposalId: number;
  requestedAmount: number;
  onPledgeComplete: () => void;
}

export function PledgeButton({ proposalId, requestedAmount, onPledgeComplete }: PledgeButtonProps) {
  const { address } = useAccount();
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handlePledge = async () => {
    if (!pledgeAmount || !address) return;
    
    const amount = parseFloat(pledgeAmount);
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Execute USDC transfer
      const result = await writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [SAFE_ADDRESS, parseUnits(amount.toString(), 6)]
      });

      // Wait for transaction and then record pledge
      // Note: In production, you'd wait for the transaction to be mined
      // and then call the API with the transaction hash
      
      alert(`Pledge of $${amount} submitted! Transaction will be verified shortly.`);
      setPledgeAmount("");
      onPledgeComplete();
    } catch (error) {
      console.error("Pledge error:", error);
      alert("Pledge failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetAmounts = [10, 25, 50, 100];

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-3">Make a Pledge</h4>
      
      <div className="flex gap-2 mb-3">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => setPledgeAmount(amount.toString())}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            ${amount}
          </button>
        ))}
      </div>
      
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="Custom amount"
          value={pledgeAmount}
          onChange={(e) => setPledgeAmount(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
          min="1"
          step="0.01"
        />
        <button
          onClick={handlePledge}
          disabled={!pledgeAmount || isPending || isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isPending || isSubmitting ? "Pledging..." : "Pledge USDC"}
        </button>
      </div>
      
      <div className="text-xs text-gray-500">
        Pledges are sent as USDC on Base to a multisig Safe.
        NS provides 1:1 matching up to the requested amount.
      </div>
    </div>
  );
}