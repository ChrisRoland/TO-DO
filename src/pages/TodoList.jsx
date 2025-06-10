import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchTodos } from '../api/todo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function TodoList() {
  const { data: todos = [], isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const perPage = 10;

  // apply search + status filter
  const filtered = useMemo(
    () =>
      todos
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
        .filter(t =>
          status === 'complete' ? t.completed
          : status === 'incomplete' ? !t.completed
          : true
        ),
    [todos, search, status]
  );

  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page]
  );

  if (isLoading) return <div>Loading todos…</div>;
  if (isError)   return <div>Failed to load.</div>;

  return (
    <div>
      {/* search + filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Input
          placeholder="Search todos…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        {['all','complete','incomplete'].map(f => (
          <Button
            key={f}
            variant={status===f ? 'default' : 'outline'}
            onClick={() => { setStatus(f); setPage(1); }}
          >
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </Button>
        ))}
      </div>

      {/* list */}
      <div className="space-y-2">
        {paginated.map(todo => (
          <Card key={todo.id}>
            <CardHeader>
              <Link to={`/todos/${todo.id}`} className="text-lg font-medium">
                {todo.title}
              </Link>
            </CardHeader>
            <CardContent>
              Status: {todo.completed ? '✅ Completed' : '❌ Incomplete'}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <Button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1}>
          Prev
        </Button>
        {Array.from({ length: pageCount }, (_, i) => i+1).map(num => (
          <Button
            key={num}
            variant={num===page ? 'default' : 'outline'}
            onClick={() => setPage(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          onClick={() => setPage(p => Math.min(p+1,pageCount))}
          disabled={page===pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}