import type { Meta, StoryObj } from "@storybook/react";
import { WordRoll } from "../components/word-roll";

const meta = {
  title: "Components/Word Roll",
  component: WordRoll
} satisfies Meta<typeof WordRoll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="story-row">
      <WordRoll index={0} />
      <WordRoll index={1} />
      <WordRoll index={2} />
      <WordRoll index={3} />
    </div>
  )
};
