import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../components/input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "Track 04"
  }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Signal locked"
  }
};

export const ExampleUsage: Story = {
  render: () => (
    <label className="story-field">
      <span>System code</span>
      <Input defaultValue="SC-133G04" />
    </label>
  )
};
