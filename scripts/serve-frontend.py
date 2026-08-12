#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "mis-frontend", "build")
ROOT = os.path.abspath(ROOT)
os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.translate_path(self.path.split("?", 1)[0])
        if (not os.path.exists(path) or os.path.isdir(path)) and not os.path.splitext(path)[1]:
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 3002), Handler)
    print("Serving", ROOT, "on http://127.0.0.1:3002", flush=True)
    server.serve_forever()
