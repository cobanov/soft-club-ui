import type { Meta, StoryObj } from "@storybook/react";
import { MockConsole } from "../components/mock-console";

const meta = {
  title: "Components/Mock Console",
  component: MockConsole
} satisfies Meta<typeof MockConsole>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExampleUsage: Story = {
  args: {
    filename: "glass-pass.ts",
    status: "SYNCED"
  }
};
