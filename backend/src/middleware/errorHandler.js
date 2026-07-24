export function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.originalUrl} —`, err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal server error",
      status,
    },
  });
}
