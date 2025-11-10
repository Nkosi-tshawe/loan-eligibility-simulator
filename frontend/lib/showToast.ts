import React from "react";
import { toast } from "sonner";

export default function showToast({
  data,
  title,
  position = "bottom-right",
}: {
  data: unknown;
  title: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) {
  if (process.env.NEXT_ENV === "development") {
    toast('Dev Mode:' + title, {
      description: React.createElement(
        "pre",
        {
          className:
            "bg-code text-gray-500 mt-2 w-[320px] overflow-x-auto rounded-md p-4",
        },
        React.createElement("code", null, JSON.stringify(data, null, 2))
      ),
      position: position,
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    });
  }
}
