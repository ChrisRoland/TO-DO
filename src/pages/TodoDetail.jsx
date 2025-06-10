import { useParams } from '@tanstack/react-router';

export default function TodoDetail() {
  const { todoId } = useParams();
  return <div className="p-4">Details for todo #{todoId}</div>;
}