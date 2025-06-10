export default function ErrorComponent({ error }) {
  return (
    <div className="error-boundary p-4 text-center bg-red-50 border border-red-200 rounded">
      <h2 className="text-2xl text-red-800 font-bold">Something went wrong!</h2>
      <p className="text-red-600">* {error.message} *</p>
    </div>
  );
}