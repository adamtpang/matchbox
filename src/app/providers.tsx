"use client";
import { WagmiProvider, http } from "wagmi";
import { base } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

// Only warn once in development about missing project ID
if (typeof window === 'undefined' && !projectId) {
  console.warn(
    "⚠️  WalletConnect project ID not configured. " +
    "Get a free project ID from https://cloud.walletconnect.com for production use."
  );
}

const config = getDefaultConfig({
  appName: "NS Crowdfund",
  projectId: projectId || "placeholder-id",
  chains: [base],
  transports: { [base.id]: http() },
  ssr: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}