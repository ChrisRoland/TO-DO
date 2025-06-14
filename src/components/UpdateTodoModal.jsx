import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { updateTodo } from "../api/todo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateTodoModal({ isOpen, onClose, todo }) {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, ...data }) => updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onClose();
      form.reset();
    },
    onError: (error) => {
      console.error("Error updating todo:", error);
      // I may add toast notif here in the future
    },
  });

  const form = useForm({
    defaultValues: {
      name: todo?.name || "",
      description: todo?.description || "",
      status: todo?.status || "TODO",
    },
    onSubmit: async ({ value }) => {
      if (todo && value.name.trim()) {
        updateTodoMutation.mutate({ id: todo.id, ...value });
      }
    },
  });

  useEffect(() => {
    if (isOpen && todo) {
      form.reset({
        name: todo.name || "",
        description: todo.description || "",
        status: todo.status || "TODO",
      });
    }
  }, [isOpen, todo, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  if (!todo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Todo</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4 py-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value || !value.trim() ? "Name is required" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor="update-name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="update-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter todo name..."
                    disabled={updateTodoMutation.isPending}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div>
                  <Label htmlFor="update-description">Description</Label>
                  <Input
                    id="update-description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter description ..."
                    disabled={updateTodoMutation.isPending}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="priority">
              {(field) => (
                <div>
                  <Label htmlFor="update-priority">Priority</Label>
                  <Select
                    id="update-priority"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={updateTodoMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div>
                  <Label htmlFor="update-status">Status</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    disabled={updateTodoMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODO">Todo</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="archived">
              {(field) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="update-archived"
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    disabled={updateTodoMutation.isPending}
                  />
                  <Label htmlFor="update-archived">Archive</Label>
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="max-sm:mt-2 max-sm:font-semibold"
              disabled={updateTodoMutation.isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit]) => (
                <Button
                  type="submit"
                  className="max-sm:font-semibold"
                  disabled={!canSubmit || updateTodoMutation.isPending}
                >
                  {updateTodoMutation.isPending ? "Updating..." : "Update Todo"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
