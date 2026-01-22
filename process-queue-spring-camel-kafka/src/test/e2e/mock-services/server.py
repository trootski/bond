#!/usr/bin/env python3
"""
Mock HTTP server that simulates slow external services.
Configurable delay via RESPONSE_DELAY_SECONDS environment variable.
"""

import json
import os
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

DELAY_SECONDS = float(os.environ.get('RESPONSE_DELAY_SECONDS', '0'))
PORT = int(os.environ.get('PORT', '8080'))


class MockHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[MOCK] {self.address_string()} - {format % args}")

    def _apply_delay(self):
        if DELAY_SECONDS > 0:
            print(f"[MOCK] Applying {DELAY_SECONDS}s delay...")
            time.sleep(DELAY_SECONDS)
            print(f"[MOCK] Delay complete")

    def _send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_GET(self):
        """Handle GET requests - used for movie metadata enrichment"""
        print(f"[MOCK] GET {self.path}")

        # Health check endpoint - no delay
        if self.path == '/health':
            self._send_json_response(200, {"status": "healthy"})
            return

        self._apply_delay()

        # Extract movie title from path (e.g., /api/v1/movies/Goldfinger)
        parts = self.path.rstrip('/').split('/')
        title = parts[-1] if parts else 'Unknown'

        response = {
            "title": title,
            "year": 1964,
            "director": "Guy Hamilton",
            "runtime": "110 min",
            "imdbRating": "7.7"
        }
        self._send_json_response(200, response)

    def do_PUT(self):
        """Handle PUT requests - used for persisting movie data"""
        print(f"[MOCK] PUT {self.path}")
        self._apply_delay()

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b'{}'

        print(f"[MOCK] Received body: {body.decode()}")

        self._send_json_response(200, {"status": "saved"})

    def do_POST(self):
        """Handle POST requests"""
        print(f"[MOCK] POST {self.path}")
        self._apply_delay()
        self._send_json_response(200, {"status": "ok"})


if __name__ == '__main__':
    print(f"[MOCK] Starting mock server on port {PORT} with {DELAY_SECONDS}s delay")
    server = HTTPServer(('0.0.0.0', PORT), MockHandler)
    server.serve_forever()
