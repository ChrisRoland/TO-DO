import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../api/todo";
import { Link } from "@tanstack/react-router";

export default function Important() {
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading) return <p>Loading important tasks…</p>;
  if (isError) return <p>Failed to load important tasks.</p>;

  const highPriority = todos.filter((t) => t.priority === "HIGH");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Important Tasks</h1>
      {highPriority.length === 0 ? (
        <p>No high-priority tasks.</p>
      ) : (
        <ul className="space-y-2 max-sm:text-[19px]">
          {highPriority.map((t) => (
            <li
              key={t.id}
              className="p-2 border border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Link to={`/todos/${t.id}`} className="font-medium">
                {t.name}
              </Link>
              <span
                className={`ml-2 text-sm sm:text-xs ${t.status === "DONE" ? "text-green-500/85 max-sm:text-green-500 font-semibold" : "text-yellow-500/85 max-sm:text-yellow-500 font-semibold"}`}
              >
                Status:{" "}
                {t.status === "DONE"
                  ? " Completed"
                  : t.status === "IN_PROGRESS"
                    ? " In Progress"
                    : " Todo"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
