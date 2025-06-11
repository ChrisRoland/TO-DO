// import { useParams } from '@tanstack/react-router';

// export default function Important() {
//   const { todoId } = useParams();
//   return <div className="p-4">Important for todo #{todoId}</div>;
// }

export default function Important() {
  // Remove useParams since this route doesn't have parameters
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Important Tasks</h1>
      <p>This is the important tasks page.</p>
      {/* Add your important tasks logic here */}
    </div>
  );
}