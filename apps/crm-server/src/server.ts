import app from "./app";
import { config } from "./config/env-config/config";

const PORT = config.PORT || 3001;

// Only listen on a port locally. Vercel runs the app as a serverless function.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;