#!/usr/bin/env python3
"""
Simple HTTP server for hosting LemonDocs
"""
import http.server
import socketserver
import sys

PORT = 8000  # Default port

# Use command line argument for port if provided
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"Invalid port: {sys.argv[1]}, using default port 8000")

HANDLER = http.server.SimpleHTTPRequestHandler

# Set CORS headers to allow all origins
class CORSHTTPRequestHandler(HANDLER):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
    print(f"Serving LemonDocs at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()