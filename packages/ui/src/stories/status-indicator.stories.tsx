import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "../components/status-indicator";

const meta = {
  title: "Components/Status Indicator",
  component: StatusIndicator
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="story-row">
      <StatusIndicator tone="green" />
      <StatusIndicator tone="blue" />
      <StatusIndicator tone="warning" />
      <StatusIndicator tone="danger" />
      <StatusIndicator tone="neutral" />
    </div>
  )
};
