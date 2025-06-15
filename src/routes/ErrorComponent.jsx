import React from 'react';

export default function ErrorComponent({ error, reset }) {
  return (
    <main className="bg-red-200 p-8">
      <h1 className="text-center text-3xl font-bold mb-4 text-red-600">
        Something went wrong
      </h1>
      <pre className="whitespace-pre-wrap bg-red-900 p-4 rounded animate-pulse">
        * {error?.message || 'An unknown error occurred'} *
      </pre>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
      >
        Try again
      </button>
    </main>
  );
}