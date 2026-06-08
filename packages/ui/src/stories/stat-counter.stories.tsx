import type { Meta, StoryObj } from "@storybook/react";
import { StatCounter } from "../components/stat-counter";

const meta = {
  title: "Components/Stat Counter",
  component: StatCounter,
  args: {
    suffix: "%",
    value: 94
  }
} satisfies Meta<typeof StatCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExampleUsage: Story = {
  render: () => (
    <div className="story-row">
      <StatCounter value={133} />
      <StatCounter prefix="-" suffix=" dB" value={3} />
    </div>
  )
};
