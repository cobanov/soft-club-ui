import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../components/badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Local"
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="story-row">
      <Badge>Blue</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="warning">Amber</Badge>
      <Badge variant="danger">Red</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  )
};

export const ExampleUsage: Story = {
  render: () => (
    <div className="story-row">
      <Badge variant="green">On time</Badge>
      <Badge variant="neutral">Track 2</Badge>
    </div>
  )
};
