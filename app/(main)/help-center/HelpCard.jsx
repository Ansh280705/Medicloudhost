import { Card, CardContent } from "@/components/ui/card";

export default function HelpCard({ category, title, description }) {
  return (
    <Card className="rounded-2xl border shadow-sm hover:shadow-md transition">
      <CardContent className="p-6 space-y-2">
        <p className="text-xs text-muted-foreground">{category}</p>
        <h3 className="text-base font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
