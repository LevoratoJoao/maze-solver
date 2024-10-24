import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, 'public')))

// app.use(express.static(path.join(__dirname, 'views')));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});