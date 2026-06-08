import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Sync channel"
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="story-row">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Unavailable"
  }
};

export const ExampleUsage: Story = {
  render: () => (
    <div className="story-row">
      <Button>Open room</Button>
      <Button variant="outline">Print frame</Button>
    </div>
  )
};
