import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../components/textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "Operator note"
  }
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Maintenance window closed."
  }
};

export const ExampleUsage: Story = {
  render: () => (
    <label className="story-field">
      <span>Session note</span>
      <Textarea defaultValue="Fogged lens pass active. Keep the green shelf glow low." />
    </label>
  )
};
