import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../api/todo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";

export default function DeleteTodoModal({ isOpen, onClose, todo }) {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error deleting todo:", error);
      // I may add toast notif here in the future
    }
  });

  const handleDelete = () => {
    if (todo) {
      deleteTodoMutation.mutate(todo.id);
    }
  };

  if (!todo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangleIcon className="h-5 w-5" />
            Delete Todo
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-base mb-2">
            Are you sure you want to delete <strong>"{todo.name}"</strong>?
          </p>
          {todo.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Description: {todo.description}
            </p>
          )}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="max-sm:mt-2 max-sm:font-semibold"
            disabled={deleteTodoMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteTodoMutation.isPending}
            className="bg-red-600 hover:bg-red-700 max-sm:font-semibold"
          >
            {deleteTodoMutation.isPending ? "Deleting..." : "Delete Todo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}