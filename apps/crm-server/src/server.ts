import app from "./app";
import { config } from "./config/env-config/config";

const PORT = config.PORT || 3001;
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer()


