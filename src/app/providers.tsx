"use client";
import { WagmiProvider, http } from "wagmi";
import { base } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID;

const config = getDefaultConfig({
  appName: "NS Crowdfund",
  projectId: projectId || "placeholder-id", // Use placeholder instead of demo
  chains: [base],
  transports: { [base.id]: http() },
  ssr: true, // Add SSR support
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  if (!projectId) {
    console.warn("WalletConnect project ID not configured. Some wallet features may not work properly.");
  }

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