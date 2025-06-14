import React, { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodo } from "../api/todo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, EditIcon, TrashIcon } from "lucide-react";
import UpdateTodoModal from "@/components/UpdateTodoModal";
import DeleteTodoModal from "@/components/DeleteTodoModal";

export default function TodoDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { todoId } = useParams({ from: "/todos/$todoId" });

  const {
    data: todo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => fetchTodo(todoId),
    enabled: !!todoId,
  });

  // States
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedTodoForUpdate, setSelectedTodoForUpdate] = useState(null);
  const [selectedTodoForDelete, setSelectedTodoForDelete] = useState(null);

  // E.H
  const openUpdateModal = (todo) => {
    setSelectedTodoForUpdate(todo);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
    closeUpdateModal();
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedTodoForUpdate(null);
  };

  const openDeleteModal = (todo) => {
    setSelectedTodoForDelete(todo);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTodoForDelete(null);
  };

  if (!todoId) {
    return (
      <Card className="max-w-md mx-auto bg-red-100 dark:bg-red-950 text-red-500">
        <CardContent className="p-6">
          <p className="text-center">* Invalid todo ID *</p>
          <Button onClick={() => navigate({ to: "/" })} className="mt-4">
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-4/4" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="max-w-md mx-auto bg-red-100 dark:bg-red-950 text-red-500">
        <CardContent className="p-6">
          <p className="text-center">
            * Error loading todo: {error?.message || "Unknown error"} *
          </p>
          <Button onClick={() => navigate({ to: "/" })} className="mt-4">
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!todo) {
    return (
      <Card className="max-w-md mx-auto bg-red-100 dark:bg-red-950 text-red-500">
        <CardContent className="p-6">
          <p className="text-center">Todo not found</p>
          <Button onClick={() => navigate({ to: "/" })} className="mt-4">
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="max-w-md mx-auto">
      <Card className="relative">
        <div className="flex items-center mt-4">
          <Button
            onClick={() => navigate({ to: "/" })}
            variant="ghost"
            size="sm"
            className="p-2 ml-5"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        {/* Edit & Del buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              openUpdateModal(todo);
            }}
            className="h-8 w-8 p-0 hover:bg-blue-100"
            title="Edit todo"
          >
            <EditIcon className="!h-5 !w-5 sm:!h-4 sm:!w-4 text-blue-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              openDeleteModal(todo);
            }}
            className="h-8 w-8 p-0 hover:bg-red-100"
            title="Delete todo"
          >
            <TrashIcon className="!h-5 !w-5 sm:!h-4 sm:!w-4 text-red-600" />
          </Button>
        </div>
        <h3 className=" w-full text-xl text-center font-semibold ml-2">
          Todo Details
        </h3>
        <CardHeader>
          <h2 className="text-lg font-semibold">{todo.name}</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`${todo.status === "DONE" ? "text-green-500" : "text-yellow-500"}`}
              >
                {todo.status === "DONE"
                  ? " Completed"
                  : todo.status === "IN_PROGRESS"
                    ? " In Progress"
                    : " Todo"}
              </span>
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              <span
                className={`${todo.priority === "HIGH" ? "text-red-500" : "text-yellow-500"}`}
              >
                {todo.priority}
              </span>
            </p>
            <p>
              <strong>Archived:</strong> {todo.archived ? "Yes" : "No"}
            </p>
            <p className="!my-5 text-center text-[16px] text-gray-600 dark:text-gray-300">
              <strong>Description: </strong> <br />
              {todo.description}
            </p>
            <div className="flex gap-4 justify-center text-sm text-center">
              <p>
                <strong>Created:</strong> {todo.createdAt.slice(0, 19)}
              </p>
              <p>
                <strong>Updated:</strong> {todo.updatedAt.slice(0, 19)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <UpdateTodoModal
        isOpen={showUpdateModal}
        onClose={() => {
          closeUpdateModal();
          handleUpdateSuccess();
          // window.location.reload();
        }}
        todo={selectedTodoForUpdate}
      />

      <DeleteTodoModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        todo={selectedTodoForDelete}
      />
    </main>
  );
}
