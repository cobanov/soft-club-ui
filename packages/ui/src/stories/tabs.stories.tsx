import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="arrivals">
      <TabsList aria-label="Soft Club view">
        <TabsTrigger value="arrivals">Room</TabsTrigger>
        <TabsTrigger value="departures">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="arrivals">Green glass room is operating normally.</TabsContent>
      <TabsContent value="departures">Blurred image archive is spaced every 12 frames.</TabsContent>
    </Tabs>
  )
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="open">
      <TabsList aria-label="Session state">
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger disabled value="closed">
          Closed
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open">Main glass layer is open.</TabsContent>
    </Tabs>
  )
};

export const ExampleUsage: Story = Default;
