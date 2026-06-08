import type { Meta, StoryObj } from "@storybook/react";
import { TokenStream } from "../components/token-stream";

const meta = {
  title: "Components/Token Stream",
  component: TokenStream
} satisfies Meta<typeof TokenStream>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  args: {
    tokens: ["SC", "/", "A3", " ", "noise", " ", "04", "%"]
  }
};
