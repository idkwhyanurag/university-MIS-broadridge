export default function ErrorState({
  title = "Something went wrong",
  message = "Unable to load the requested data.",
  onRetry,
}) {
  return (
    <div className="error-state">
      <div className="error-state-icon">!</div>

      <h3>{title}</h3>

      <p>{message}</p>

      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}