// Code to meet exam requirement
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchTodos } from "../api/todo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchIcon,
  CheckCheckIcon,
  BadgeXIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  RefreshCcw,
} from "lucide-react";
import CreateTodoModal from "@/components/CreateTodoModal";
import UpdateTodoModal from "@/components/UpdateTodoModal";
import DeleteTodoModal from "@/components/DeleteTodoModal";

export default function TodoList() {
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // States
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const perPage = 10;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedTodoForUpdate, setSelectedTodoForUpdate] = useState(null);
  const [selectedTodoForDelete, setSelectedTodoForDelete] = useState(null);

  // This are Filtering and pagination logic
  const filtered = useMemo(
    () =>
      todos
        .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
        .filter((t) =>
          status === "complete"
            ? t.status === "DONE"
            : status === "incomplete"
              ? t.status !== "DONE"
              : true
        ),
    [todos, search, status]
  );

  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page]
  );

  // Event handlers
  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  const openUpdateModal = (todo) => {
    setSelectedTodoForUpdate(todo);
    setShowUpdateModal(true);
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

  if (isLoading)
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </div>
    );

  if (isError)
    return (
      <div className="animate-bounce max-w-md mx-auto bg-red-100 dark:bg-red-950 text-red-500">
        Failed to load todos.
      </div>
    );

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-2 mb-4 relative">
        <Input
          placeholder="Search todos…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="dark:bg-gray-300/30 dark:border-gray-500"
        />
        <SearchIcon className="size-7 text-gray-500 absolute top-1 right-1 max-sm:hidden" />

        {/* Filter buttons */}
        {["all", "complete", "incomplete"].map((f) => (
          <Button
            key={f}
            variant={status === f ? "default" : "outline"}
            onClick={() => {
              setStatus(f);
              setPage(1);
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}

        {/* Add Todo button */}
        <Button
          variant="default"
          onClick={openCreateModal}
          className="bg-blue-600 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-700 hover:bg-blue-800 sm:ml-auto"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Todo
        </Button>
      </div>

      {/* Todo List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map((todo) => (
          <Card
            key={todo.id}
            className="hover:scale-[1.02] hover:shadow-lg dark:shadow-white dark:hover:shadow transition duration-200 relative group"
          >
            {/* Edit & Del buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <EditIcon className="h-4 w-4 text-blue-600" />
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
                <TrashIcon className="h-4 w-4 text-red-600" />
              </Button>
            </div>

            <Link to={`/todos/${todo.id}`} className="text-lg font-medium">
              <CardHeader className="pr-16">{todo.name}</CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-400">
                {/* {todo.description && (
                  <div className="mb-2 text-sm">
                    {todo.description}
                  </div>
                )} */}
                Status:{" "}
                <span
                  className={`inline-flex items-center flex-row gap-1 ${todo.status === "DONE" ? "text-green-500" : "text-orange-500"}`}
                >
                  {todo.status === "DONE" ? (
                    <>
                      Completed{" "}
                      <CheckCheckIcon className="inline w-4 h-4 text-green-500" />
                    </>
                  ) : todo.status === "IN_PROGRESS" ? (
                    <>
                      In Progress{" "}
                      <RefreshCcw className="inline w-4 h-4 text-yellow-500 animate-spin" />
                    </>
                  ) : (
                    <>
                      Todo{" "}
                      <BadgeXIcon className="inline w-3 h-3 text-orange-500" />
                    </>
                  )}
                </span>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Incase of No results show this message */}
      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No todos found</p>
          {search && (
            <p className="text-sm mt-2">
              Try adjusting your search term or filters
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-6 mb-2 text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage(1)}
              disabled={page === 1}
              variant="ghost"
              size="sm"
              className="px-2"
              title="Go to first page"
            >
              <span className="hidden sm:inline">««</span>
              <span className="sm:hidden">‹‹</span>
            </Button>

            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              variant="ghost"
              size="sm"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1 px-2">
              <span>{page}</span>
              <span>/</span>
              <span>{pageCount}</span>
            </div>

            <Button
              onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
              disabled={page === pageCount}
              variant="ghost"
              size="sm"
            >
              Next
            </Button>

            <Button
              onClick={() => setPage(pageCount)}
              disabled={page === pageCount}
              variant="ghost"
              size="sm"
              className="px-2"
              title="Go to last page"
            >
              <span className="hidden sm:inline">»»</span>
              <span className="sm:hidden">››</span>
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTodoModal isOpen={showCreateModal} onClose={closeCreateModal} />

      <UpdateTodoModal
        isOpen={showUpdateModal}
        onClose={closeUpdateModal}
        todo={selectedTodoForUpdate}
      />

      <DeleteTodoModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        todo={selectedTodoForDelete}
      />
    </div>
  );
}

// CODE FOR MY PREFFERED UI
// Please ignore, I plan to use it later.

// import React, { useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchTodos, fetchTodo } from "../api/todo";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { SearchIcon, ChevronLeft, CheckCheckIcon } from "lucide-react";
// import ErrorComponent from "./ErrorComponent";

// export default function TodoList() {
//   const {
//     data: todos = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["todos"],
//     queryFn: fetchTodos,
//   });

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("all");
//   const [selectedTodoId, setSelectedTodoId] = useState(null);
//   const perPage = 10;

//   // Fetch selected todo details
//   const {
//     data: selectedTodo,
//     isLoading: isLoadingTodo,
//     isError: isErrorTodo,
//   } = useQuery({
//     queryKey: ["todo", selectedTodoId],
//     queryFn: () => fetchTodo(selectedTodoId),
//     enabled: !!selectedTodoId,
//   });

//   // apply search + status filter
//   const filtered = useMemo(
//     () =>
//       todos
//         .filter((t) => t.todo.toLowerCase().includes(search.toLowerCase()))
//         .filter((t) =>
//           status === "complete"
//             ? t.completed
//             : status === "incomplete"
//               ? !t.completed
//               : true
//         ),
//     [todos, search, status]
//   );

//   const pageCount = Math.ceil(filtered.length / perPage);
//   const paginated = useMemo(
//     () => filtered.slice((page - 1) * perPage, page * perPage),
//     [filtered, page]
//   );

//   if (isLoading)
//     return (
//       <div className="flex flex-col space-y-3">
//         <Skeleton className="h-[125px] w-full rounded-xl" />
//         <Skeleton className="h-[125px] w-full rounded-xl" />
//         <Skeleton className="h-[125px] w-full rounded-xl" />
//         <Skeleton className="h-[125px] w-full rounded-xl" />
//         <Skeleton className="h-[125px] w-full rounded-xl" />
//         <Skeleton className="h-[125px] w-full rounded-xl" />
//       </div>
//     );
//   if (isError)
//     return <div className="animate-bounce">Failed to load todos.</div>;

//   return (
//     <div className="flex gap-6 h-full">
//       <div
//         className={`${selectedTodoId ? "w-1/2" : "w-full"} transition-all duration-300`}
//       >
//         <div className="flex flex-wrap gap-2 mb-4 relative">
//           <Input
//             placeholder="Search todos…"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             className="dark:bg-gray-300/30 dark:border-gray-500"
//           />
//           <SearchIcon className="size-7 text-gray-500 dark:text-gray-400 absolute top-1 right-2 pointer-events-none" />
//           {["all", "complete", "incomplete"].map((f) => (
//             <Button
//               key={f}
//               variant={status === f ? "default" : "outline"}
//               onClick={() => {
//                 setStatus(f);
//                 setPage(1);
//               }}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//             </Button>
//           ))}
//         </div>

//         {/* list */}
//         <div className="space-y-2">
//           {paginated.map((todo) => (
//             <Card
//               key={todo.id}
//               className={`cursor-pointer hover:scale-[1.02] hover:shadow-lg dark:shadow-white dark:hover:shadow transition duration-200 ${
//                 selectedTodoId === todo.id
//                   ? "ring-2 ring-lime-900 shadow-none"
//                   : ""
//               }`}
//               onClick={() => setSelectedTodoId(todo.id)}
//             >
//               <CardHeader>
//                 <div className="text-lg font-medium">{todo.todo}</div>
//               </CardHeader>
// <CardContent className=" text-gray-600 dark:text-gray-400">
//   Todo: {todo.todo} <br />
//   Status:
//   <span
//     className={`${todo.completed ? "text-green-500" : "text-orange-500"}`}
//   >{" "}
//     {todo.completed ? (
//       <>
//         completed <CheckCheckIcon className="inline w-4 h-4" />
//       </>
//     ) : (
//       " Incomplete"
//     )}
//   </span>
// </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* pagination */}
// <div className="flex items-center justify-between mt-6 mb-2 text-sm text-gray-600 dark:text-gray-400">
//   <div>
//     Showing {(page - 1) * perPage + 1} to{" "}
//     {Math.min(page * perPage, filtered.length)} of {filtered.length}
//   </div>

//   <div className="flex items-center gap-2">
//     <Button
//       onClick={() => setPage(1)}
//       disabled={page === 1}
//       variant="ghost"
//       size="sm"
//       className="px-2"
//     >
//       <span className="hidden sm:inline">««</span>
//       <span className="sm:hidden">‹‹</span>
//     </Button>

//     <Button
//       onClick={() => setPage((p) => Math.max(p - 1, 1))}
//       disabled={page === 1}
//       variant="ghost"
//       size="sm"
//     >
//       Previous
//     </Button>

//     <div className="flex items-center gap-1 px-2">
//       <span>{page}</span>
//       <span>/</span>
//       <span>{pageCount}</span>
//     </div>

//     <Button
//       onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
//       disabled={page === pageCount}
//       variant="ghost"
//       size="sm"
//     >
//       Next
//     </Button>

//     <Button
//       onClick={() => setPage(pageCount)}
//       disabled={page === pageCount}
//       variant="ghost"
//       size="sm"
//       className="px-2"
//     >
//       <span className="hidden sm:inline">»»</span>
//       <span className="sm:hidden">››</span>
//     </Button>
//   </div>
// </div>
//       </div>

//       {selectedTodoId && (
//         <div className="w-1/2 pl-4 border-l border-gray-200 dark:border-gray-700">
//           <div className="sticky top-0">
// <div className="flex items-center mb-4">
//   <Button
//     onClick={() => setSelectedTodoId(null)}
//     variant="ghost"
//     size="sm"
//     className="p-2"
//   >
//     <ChevronLeft className="w-4 h-4" />
//   </Button>
//   <h3 className="text-lg font-semibold ml-2">Todo Details</h3>
// </div>

//             {isLoadingTodo ? (
// <Card>
//   <CardContent className="p-6">
//     <Skeleton className="h-6 w-3/4 mb-4" />
//     <Skeleton className="h-4 w-1/2 mb-2" />
//     <Skeleton className="h-4 w-1/3 mb-2" />
//     <Skeleton className="h-4 w-1/4" />
//   </CardContent>
// </Card>
//             ) : isErrorTodo ? (
//               <Card>
//                 <CardContent className="p-6">
//                   <p className="text-red-500">Error loading todo details</p>
//                 </CardContent>
//               </Card>
//             ) : selectedTodo ? (
// <Card>
//   <CardHeader>
//     <h2 className="text-xl font-semibold">
//       {selectedTodo.title}
//     </h2>
//   </CardHeader>
//   <CardContent>
//     <div className="space-y-3">
//       <p>
//         <strong>ID:</strong> {selectedTodo.id}
//       </p>
//       <p>
//         <strong>User:</strong> {selectedTodo.userId}
//       </p>
//       <p>
//         <strong>Status:</strong>{" "}
//         {selectedTodo.completed
//           ? " Completed"
//           : " Incomplete"}
//       </p>
//       {selectedTodo.todo && (
//         <div>
//           <strong>Description:</strong>
//           <p className="mt-1 text-gray-600 dark:text-gray-300">
//             {selectedTodo.todo}
//           </p>
//         </div>
//       )}
//     </div>
//   </CardContent>
// </Card>
//             ) : null}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
