#!/usr/bin/env python3
"""
Quick Start Server for AGIR Project
Serve files locally with live reload support
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    os.chdir(Path(__file__).parent)
    
    print("\n" + "="*60)
    print("🚀 AGIR V2 - Local Development Server")
    print("="*60)
    print(f"\n📍 URL: http://localhost:{PORT}")
    print(f"🎯 Vote Page: http://localhost:{PORT}/index.html")
    print(f"📊 Admin Panel: http://localhost:{PORT}/admin.html")
    print("\n⚠️  IMPORTANT: Configure Firebase BEFORE launching!")
    print("   → Edit firebase-init.js with your Firebase config")
    print("   → Read FIREBASE_SETUP.md for complete guide\n")
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✓ Server running on http://localhost:{PORT}/")
        print("  Press Ctrl+C to stop\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped")
            sys.exit(0)

if __name__ == "__main__":
    main()
