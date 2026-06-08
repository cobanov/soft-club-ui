import type { Meta, StoryObj } from "@storybook/react";
import { BeforeAfter } from "../components/before-after";

const meta = {
  title: "Components/Before After",
  component: BeforeAfter
} satisfies Meta<typeof BeforeAfter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExampleUsage: Story = {
  args: {
    before: "Flat panel, no atmosphere.",
    after: "Cold glass, scan index, green phosphor."
  }
};
