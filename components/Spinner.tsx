export default function Spinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      {message && <p className="text-zinc-400">{message}</p>}
    </div>
  );
}
