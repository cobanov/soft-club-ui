import type { Meta, StoryObj } from "@storybook/react";
import { SignalMarquee } from "../components/signal-marquee";

const meta = {
  title: "Components/Signal Marquee",
  component: SignalMarquee
} satisfies Meta<typeof SignalMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExampleUsage: Story = {
  args: {
    items: ["SC-133G04", "ROOM A3", "NOISE 04", "GLASS PASS"]
  }
};
