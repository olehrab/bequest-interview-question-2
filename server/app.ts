import express from "express";
import cors from "cors";
import { ec } from "elliptic";

const PORT = 8080;
const app = express();
const database = { data: "Hello World" };
const ecCurve = "secp256k1";
const privateKey = ec.keyFromPrivate(process.env.PRIVATE_KEY as string, ecCurve);
const publicKey = privateKey.getPublic(ecCurve);

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  const signature = privateKey.sign(database.data);
  res.json({ data: database.data, signature: signature.toDER("hex") });
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  const signature = privateKey.sign(database.data);
  res.json({ data: database.data, signature: signature.toDER("hex") });
});

app.get("/original", (req, res) => {
  res.json(database.data);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
