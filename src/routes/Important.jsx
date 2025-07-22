import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../api/todo";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Important() {
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading) {
    return (
      <Card className="">
        <CardContent className="p-6 space-y-2">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-6 w-4/4" />
          <Skeleton className="h-6 w-4/4" />
          <Skeleton className="h-6 w-4/4" />
          <Skeleton className="h-6 w-4/4" />
        </CardContent>
      </Card>
    );
  }

  if (isError)
    return (
      <p className="animate-bounce max-w-md mx-auto bg-red-100 dark:bg-red-950 text-red-500">
        Failed to load important tasks.
      </p>
    );

  const highPriority = todos.filter((todo) => todo.priority === "HIGH");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Important Tasks</h1>
      {highPriority.length === 0 ? (
        <p>No high-priority tasks.</p>
      ) : (
        <ul className="space-y-2 text-[19px]">
          {highPriority.map((todo) => (
            <li
              key={todo.id}
              className="p-2 border border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Link to={`/app/todos/${todo.id}`} className="font-medium">
                {todo.name}
              </Link>
              <span
                className={`ml-2 text-sm sm:text-xs ${todo.status === "DONE" ? "text-green-500/85 max-sm:text-green-500 font-semibold" : todo.status === "IN_PROGRESS" ? "text-yellow-500/85 max-sm:text-yellow-500 font-semibold" : "text-orange-500/85 max-sm:text-orange-500 font-semibold"}`}
              >
                Status:{" "}
                {todo.status === "DONE"
                  ? " Completed"
                  : todo.status === "IN_PROGRESS"
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
