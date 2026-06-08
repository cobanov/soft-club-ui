import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/card";

const meta = {
  title: "Components/Card",
  component: Card
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="story-card">
      <CardHeader>
        <CardTitle>Room A3</CardTitle>
        <CardDescription>Green glass layer opens at 03:35.</CardDescription>
      </CardHeader>
      <CardContent>Audio bus and blurred image plate are synchronized.</CardContent>
      <CardFooter>
        <Button size="sm">Sync</Button>
      </CardFooter>
    </Card>
  )
};

export const ExampleUsage: Story = {
  render: () => (
    <Card className="story-card">
      <CardHeader>
        <CardTitle>Soft console</CardTitle>
      </CardHeader>
      <CardContent>
        The card keeps the border and glass quiet so the content reads like a
        late-night technical surface, not a dashboard block.
      </CardContent>
    </Card>
  )
};
