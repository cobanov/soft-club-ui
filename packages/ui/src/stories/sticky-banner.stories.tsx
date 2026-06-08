import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import { StickyBanner } from "../components/sticky-banner";

const meta = {
  title: "Components/Sticky Banner",
  component: StickyBanner
} satisfies Meta<typeof StickyBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StickyBanner action={<Button size="sm">Open deck</Button>}>
      SC-133G04 / soft channel updated / noise 04%
    </StickyBanner>
  )
};
