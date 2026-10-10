import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <Badge tone="yellow">Learn Amharic, one word at a time</Badge>
      <h1 className="text-5xl font-semibold">Ready to grow your word garden?</h1>
      <Card className="flex flex-col gap-4">
        <p className="font-ethiopic text-6xl">ሰላም</p>
        <p className="text-[var(--muted)]">selam · hello</p>
        <div className="flex flex-wrap gap-3">
          <Button>Play</Button>
          <Button variant="soft">Hint</Button>
          <Button variant="outline">See progress</Button>
        </div>
      </Card>
    </main>
  );
}