import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassPanel,
  GlassPanelBody,
  GlassPanelHeader,
  GlassPanelKicker,
  GlassPanelTitle
} from "../components/glass-panel";
import { TokenStream } from "../components/token-stream";

const meta = {
  title: "Components/Glass Panel",
  component: GlassPanel
} satisfies Meta<typeof GlassPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <GlassPanel className="story-card">
      <GlassPanelHeader>
        <GlassPanelKicker>SC / PANEL</GlassPanelKicker>
        <GlassPanelTitle>Green glass surface</GlassPanelTitle>
      </GlassPanelHeader>
      <GlassPanelBody>
        <TokenStream />
      </GlassPanelBody>
    </GlassPanel>
  )
};
