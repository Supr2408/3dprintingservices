function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-cyan-200">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500/40 border-t-neon" />
      <span className="text-sm">{label}...</span>
    </div>
  );
}

export default LoadingSpinner;
