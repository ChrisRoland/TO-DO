import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { addTodo } from "../api/todo";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateTodoModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      onClose();
      form.reset();
    },
    onError: (error) => {
      console.error("Error adding todo:", error);
      // I may add toast notif here in the future
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      status: "TODO",
      priority: "LOW",
    },
    onSubmit: async ({ value }) => {
      if (value.name.trim()) {
        addTodoMutation.mutate(value);
      }
    },
  });

  // Reset again form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
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
                  <Label htmlFor="create-name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="create-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter todo name..."
                    disabled={addTodoMutation.isPending}
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
                  <Label htmlFor="create-description">Description</Label>
                  <Input
                    id="create-description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter description..."
                    disabled={addTodoMutation.isPending}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div>
                  <Label htmlFor="create-status">Status</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    disabled={addTodoMutation.isPending}
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
            <form.Field name="priority">
              {(field) => (
                <div>
                  <Label htmlFor="create-priority">Priority</Label>
                  <Select
                    id="create-priority"
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    disabled={addTodoMutation.isPending}
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="max-sm:mt-2 max-sm:font-semibold"
              disabled={addTodoMutation.isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || addTodoMutation.isPending}
                  className="max-sm:font-semibold"
                >
                  {addTodoMutation.isPending ? "Adding..." : "Add Todo"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
