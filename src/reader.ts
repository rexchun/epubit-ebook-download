import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT: Number = 8002;

app.use("/books", express.static("./books/"));
app.use("/reader", express.static("./reader/dist/"));
app.get("/reader/book/:id", (req, res) => {
    res.sendFile(path.join(process.cwd(), "/reader/dist/index.html"));
});
app.get("/api/books", (req, res) => {
    const books = fs
        .readdirSync("./books", {
            encoding: "utf8"
        })
        .filter(b => fs.statSync(path.join("books", b)).isDirectory())
        .map(b => ({
            id: b,
            name: b
        }));
    res.json(books);
});

app.listen(PORT, () => {
    console.log(`访问 http://localhost:${PORT}/reader 阅读电子书`);
});
