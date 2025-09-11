"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Topbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-2xl font-bold">NS Crowdfund</h1>
      <ConnectButton />
    </div>
  );
}