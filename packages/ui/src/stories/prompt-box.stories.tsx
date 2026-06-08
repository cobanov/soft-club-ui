import type { Meta, StoryObj } from "@storybook/react";
import { PromptBox } from "../components/prompt-box";

const meta = {
  title: "Components/Prompt Box",
  component: PromptBox,
  args: {
    defaultValue: "render a soft cyber room with cold glass"
  }
} satisfies Meta<typeof PromptBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExampleUsage: Story = {
  render: () => <PromptBox placeholder="Describe the glass pass..." />
};
