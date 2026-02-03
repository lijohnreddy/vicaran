"use client";

import { Button } from "@/components/ui/button";

export function StartChattingButton() {
  const handleStartChat = () => {
    window.location.href = "/chat";
  };

  return <Button onClick={handleStartChat}>Start Chatting</Button>;
}
