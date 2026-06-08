import type { Meta, StoryObj } from "@storybook/react";
import { AuroraField } from "../components/aurora-field";

const meta = {
  title: "Components/Aurora Field",
  component: AuroraField
} satisfies Meta<typeof AuroraField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="story-stage">
      <AuroraField />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className="story-grid">
      <div className="story-stage"><AuroraField intensity="low" /></div>
      <div className="story-stage"><AuroraField intensity="high" /></div>
    </div>
  )
};
