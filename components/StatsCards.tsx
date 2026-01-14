import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards({
  total,
  green,
  yellow,
  red,
}: {
  total: number;
  green: number;
  yellow: number;
  red: number;
}) {
  const risk = yellow + red;
  const items = [
    { label: "Totalt antal gårdar", value: total },
    { label: "Gröna gårdar", value: green },
    { label: "Gula gårdar", value: yellow },
    { label: "Röda gårdar", value: red },
    { label: "Gårdar i risk", value: risk },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs text-gray-500">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
