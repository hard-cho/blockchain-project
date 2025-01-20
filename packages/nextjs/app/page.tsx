"use client";

import ApproveTrade from "../components/ApproveTrade";
import InitialDispute from "../components/InitialDispute";
import InitialTrade from "../components/InitialTrade";
import SettleDispute from "../components/SettleDispute";

export default function Home() {
  return (
    <div>
      <InitialTrade />
      <ApproveTrade />
      <InitialDispute />
      <SettleDispute />
    </div>
  );
}
