function ErrorBanner({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-100">
      {message}
    </div>
  );
}

export default ErrorBanner;
