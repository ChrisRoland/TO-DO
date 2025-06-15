import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../api/todo";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Archived() {
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
        Failed to load archived tasks.
      </p>
    );

  const archived = todos.filter((t) => t.archived === true);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Archived Tasks</h1>
      {archived.length === 0 ? (
        <p>No archived tasks.</p>
      ) : (
        <ul className="space-y-2 text-[19px]">
          {archived.map((t) => (
            <li
              key={t.id}
              className="p-2 border border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Link to={`/todos/${t.id}`} className="font-medium">
                {t.name}{" "}
              </Link>
              <span
                className={`ml-1 text-sm sm:text-xs ${t.priority === "HIGH" ? "text-red-500 font-semibold" : "text-yellow-500 font-semibold"}`}
              >
                Priority: ({t.priority})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
