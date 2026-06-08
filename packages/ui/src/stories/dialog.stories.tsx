import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open soft channel</DialogTitle>
          <DialogDescription>
            Route the session through the green glass layer after the signal settles.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Hold</Button>
          <Button>Open</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export const ExampleUsage: Story = Default;
