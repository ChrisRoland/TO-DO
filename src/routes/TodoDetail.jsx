// import React from 'react';
// import { useParams, useNavigate } from '@tanstack/react-router';
// import { useQuery } from '@tanstack/react-query';
// import { fetchTodo } from '../api/todo';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardContent } from '@/components/ui/card';

// export default function TodoDetail() {
//   const { todoId } = useParams();
//   const navigate = useNavigate();
  
//   // TanStack Query v5 syntax - use object form
//   const { data: todo, isLoading, isError } = useQuery({
//     queryKey: ['todo', todoId],
//     queryFn: () => fetchTodo(todoId),
//   });

//   if (isLoading) return <div>Loading todo…</div>;
//   if (isError)   return <div>Couldn't fetch todo.</div>;

//   return (
//     <Card className="max-w-md mx-auto">
//       <CardHeader>
//         <h2 className="text-xl font-semibold">{todo.title}</h2>
//       </CardHeader>
//       <CardContent>
//         <p><strong>ID:</strong> {todo.id}</p>
//         <p><strong>User:</strong> {todo.userId}</p>
//         <p><strong>Status:</strong> {todo.completed ? '✅ Yes' : '❌ No'}</p>
//       </CardContent>
//       <div className="p-4">
//         <Button onClick={() => navigate({ to: '/' })}>Back</Button>
//       </div>
//     </Card>
//   );
// }

import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchTodo } from '../api/todo';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

export default function TodoDetail() {
  const navigate = useNavigate();
  
  // Use the route parameter directly
  const { todoId } = useParams({ from: '/todos/$todoId' });
  
  const { data: todo, isLoading, isError, error } = useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => fetchTodo(todoId),
    enabled: !!todoId,
  });

  if (!todoId) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <p>Invalid todo ID</p>
          <Button onClick={() => navigate({ to: '/' })} className="mt-4">
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
          <p>Loading todo…</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <p>Error loading todo: {error?.message || 'Unknown error'}</p>
          <Button onClick={() => navigate({ to: '/' })} className="mt-4">
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!todo) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <p>Todo not found</p>
          <Button onClick={() => navigate({ to: '/' })} className="mt-4">
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <div className="p-4">
        <Button onClick={() => navigate({ to: '/' })} className="px-2"><ChevronLeft className="w-3" /></Button>
      </div>
      <CardHeader>
        <h2 className="text-xl font-semibold">{todo.title}</h2>
      </CardHeader>
      <CardContent>
        <p><strong>ID:</strong> {todo.id}</p>
        <p><strong>User:</strong> {todo.userId}</p>
        <p><strong>Status:</strong> {todo.completed ? '✅ Completed' : '❌ Incomplete'}</p>
      </CardContent>
    </Card>
  );
}