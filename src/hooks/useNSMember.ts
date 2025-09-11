"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export function useNSMember() {
  const { address, isConnected } = useAccount();
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setIsMember(false);
      setIsLoading(false);
      return;
    }

    // For demo purposes, simulate member check
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Demo: any connected wallet is considered a member
      setIsMember(true);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isConnected, address]);

  return { isMember, isLoading };
}