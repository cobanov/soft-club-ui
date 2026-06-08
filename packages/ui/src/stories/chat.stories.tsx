import type { Meta, StoryObj } from "@storybook/react";
import { ChatBubble } from "../components/chat-bubble";
import { ChatDock } from "../components/chat-dock";
import { PromptBox } from "../components/prompt-box";

const meta = {
  title: "Components/Chat Dock",
  component: ChatDock
} satisfies Meta<typeof ChatDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ChatDock className="story-card">
      <ChatBubble meta="system / 03:35">Glass pass armed.</ChatBubble>
      <ChatBubble meta="operator" tone="user">Freeze frame B2.</ChatBubble>
      <PromptBox defaultValue="sync the green shelf glow" />
    </ChatDock>
  )
};

export const BubbleVariants: Story = {
  render: () => (
    <div className="story-stack">
      <ChatBubble tone="system">System bubble</ChatBubble>
      <ChatBubble tone="user">User bubble</ChatBubble>
      <ChatBubble tone="signal">Signal bubble</ChatBubble>
    </div>
  )
};
