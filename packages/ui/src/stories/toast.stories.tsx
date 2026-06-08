import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from "../components/toast";

const meta = {
  title: "Components/Toast",
  component: Toast
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastExample() {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider swipeDirection="right">
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast onOpenChange={setOpen} open={open}>
        <ToastTitle>Soft channel synced</ToastTitle>
        <ToastDescription>Visual noise settled at 04%.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

export const Default: Story = {
  render: () => <ToastExample />
};

export const ExampleUsage: Story = Default;
