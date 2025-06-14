export default function NotFound() {
  return (
    <div className="not-found space-y-4 font-semibold flex flex-col items-center justify-center h-screen bg-red-100 dark:bg-red-950 text-gray-800 dark:text-gray-200">
      <h1 className="text-6xl">404</h1>
      <p> Oops! 🫢 It seems like you're lost.</p>
        <p className="text-lg">We couldn't find that page.</p>
    </div>
  )
}