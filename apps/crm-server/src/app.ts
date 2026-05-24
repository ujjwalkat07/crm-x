import express,{Express} from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRoutes } from "./services/auth-services/auth-routes";

dotenv.config();

const app: Express = express();
const allowedOrigins = ["http://localhost:3000"]

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use("/api/auth", authRoutes);


app.get("/", (_req, res) => {
  res.send("`Hello this is ukcode07!`");
});

export default app;
