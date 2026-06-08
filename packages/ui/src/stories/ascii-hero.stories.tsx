import type { Meta, StoryObj } from "@storybook/react";
import { AsciiHero } from "../components/ascii-hero";

const meta = {
  title: "Components/Ascii Hero",
  component: AsciiHero
} satisfies Meta<typeof AsciiHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExampleUsage: Story = {
  args: {
    label: "SC / POSTER FIELD",
    title: "green room system",
    subtitle: "ASCII frame for a late-90s technical hero surface."
  }
};
