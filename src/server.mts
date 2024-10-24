import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, 'views')));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});