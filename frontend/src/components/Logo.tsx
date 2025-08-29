export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative inline-block">
        <span className="block w-5 h-5 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </span>
      <span className="font-medium">HD</span>
    </div>
  );
}
