"use client";

import { useRouter } from "next/navigation";
import { farms, type Farm } from "@/src/data/dummyData";

export default function FarmsTable() {
  const router = useRouter();

  const statusColor: Record<Farm["status"], string> = {
    green: "bg-green-600",
    yellow: "bg-yellow-500",
    red: "bg-red-600",
  };

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            {["Gård", "Typ", "Region", "Areal (ha)", "Status", "Nästa deadline"].map(
              (col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                >
                  {col}
                  <span className="ml-1 text-[10px] text-gray-400">▲▼</span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {farms.map((farm) => (
            <tr
              key={farm.id}
              onClick={() => router.push(`/farm/${farm.id}`)}
              className="cursor-pointer border-b last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {farm.name}
              </td>
              <td className="px-4 py-3 capitalize">{farm.type}</td>
              <td className="px-4 py-3">{farm.region}</td>
              <td className="px-4 py-3">{farm.area}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${statusColor[farm.status]}`}
                  />
                  <span>
                    {farm.status === "green"
                      ? "Grön"
                      : farm.status === "yellow"
                      ? "Gul"
                      : "Röd"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">
                {farm.nextDeadline ?? "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
