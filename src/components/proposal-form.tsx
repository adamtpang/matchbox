"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useNSMember } from "@/hooks/useNSMember";

export function ProposalForm() {
  const { address, isConnected } = useAccount();
  const { isMember, isLoading: memberLoading } = useNSMember();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cost: "",
    image: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cost: parseFloat(formData.cost),
          wallet: address,
          image: formData.image || undefined
        })
      });

      if (response.ok) {
        alert("Proposal submitted successfully!");
        setFormData({ title: "", description: "", cost: "", image: "" });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to submit proposal"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Submit a Proposal</h2>
        <p className="text-gray-600">Connect your wallet to submit a proposal</p>
      </div>
    );
  }

  if (memberLoading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Submit a Proposal</h2>
        <p className="text-gray-600">Checking NS membership...</p>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h2 className="text-xl font-semibold mb-4">Submit a Proposal</h2>
        <p className="text-red-600 mb-2">NS membership required</p>
        <p className="text-sm text-gray-600">
          You need to hold an NS Admit NFT to submit proposals. 
          For demo purposes, this check is simulated.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Submit a Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., Professional Drum Kit for Music Room"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-md h-24"
            placeholder="Describe why this purchase would benefit the Network State..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Cost (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min="1"
            max="50000"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="500.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
}