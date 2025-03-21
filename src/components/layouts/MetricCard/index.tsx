import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
}

export const MetricCard = ({ title, value,  isPositive }: MetricCardProps) => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="px-3 ">
        <h4 className="text-gray-600 text-sm font-urbanist mb-2">{title}</h4>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-gray-700 font-urbanist">
            {value}
          </p>
          <span
            className={`text-sm font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {/* {isPositive ? "+" : "-"} */}
            {/* {change}% */}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
