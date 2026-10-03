const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "tasks.json");
const FILES = {
    "/": ["index.html", "text/html"],
    "/index.html": ["index.html", "text/html"],
    "/style.css": ["style.css", "text/css"],
    "/script.js": ["script.js", "text/javascript"],
};

http.createServer((req, res) => {
    const url = req.url.split("?")[0];

    if (url === "/api/tasks") {
        if (req.method === "GET") {
            fs.readFile(DATA_FILE, "utf8", (err, data) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(err ? "null" : data);
            });
        } else if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk;
                if (body.length > 1e6) req.destroy();
            });
            req.on("end", () => {
                try {
                    JSON.parse(body);
                } catch {
                    res.writeHead(400);
                    return res.end("Bad JSON");
                }
                fs.writeFile(DATA_FILE, body, err => {
                    res.writeHead(err ? 500 : 200);
                    res.end(err ? "Error" : "OK");
                });
            });
        } else {
            res.writeHead(405);
            res.end();
        }
        return;
    }

    const file = FILES[url];
    if (!file) {
        res.writeHead(404);
        return res.end("Not found");
    }
    fs.readFile(path.join(__dirname, file[0]), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end("Error reading file");
        }
        res.writeHead(200, { "Content-Type": file[1] });
        res.end(data);
    });
}).listen(PORT, "127.0.0.1", () => {
    console.log("Running at http://localhost:" + PORT);
});