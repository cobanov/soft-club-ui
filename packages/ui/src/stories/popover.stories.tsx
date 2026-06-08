import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";

const meta = {
  title: "Components/Popover",
  component: Popover
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Track note</Button>
      </PopoverTrigger>
      <PopoverContent>
        The glass pass keeps blur in the image layer while text remains readable.
      </PopoverContent>
    </Popover>
  )
};

export const ExampleUsage: Story = Default;
