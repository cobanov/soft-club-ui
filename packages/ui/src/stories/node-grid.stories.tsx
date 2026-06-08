import type { Meta, StoryObj } from "@storybook/react";
import { NodeGrid } from "../components/node-grid";
import { StatusIndicator } from "../components/status-indicator";

const meta = {
  title: "Components/Node Grid",
  component: NodeGrid
} satisfies Meta<typeof NodeGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExampleUsage: Story = {
  render: () => (
    <NodeGrid>
      <div className="story-node-copy">
        <StatusIndicator /> B2 bus mapped
      </div>
    </NodeGrid>
  )
};
