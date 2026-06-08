import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../components/dropdown-menu";

const meta = {
  title: "Components/Dropdown Menu",
  component: DropdownMenu
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>SC / Deck</DropdownMenuLabel>
        <DropdownMenuItem>Refresh status</DropdownMenuItem>
        <DropdownMenuItem>Print frame</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Archive plate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export const Disabled: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Refresh status</DropdownMenuItem>
        <DropdownMenuItem disabled>Force close</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export const ExampleUsage: Story = Default;
