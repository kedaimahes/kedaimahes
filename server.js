const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  let requestPath = decodeURIComponent(
    new URL(req.url, `http://${req.headers.host}`).pathname
  );

  if (requestPath === "/") {
    requestPath = "/index.html";
  }

  const filePath = path.resolve(ROOT, "." + requestPath);

  // Cegah akses keluar dari folder aplikasi
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403, {
      "Content-Type": "text/plain; charset=utf-8"
    });
    return res.end("403 - Akses ditolak");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      return res.end("404 - Halaman tidak ditemukan");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      mimeTypes[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Website berjalan pada port ${PORT}`);
});
