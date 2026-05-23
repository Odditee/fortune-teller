#!/usr/bin/env python3
"""Stellar Oracle backend — holds API key securely, proxies AI requests."""
import json, os, sys, time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

DEEPSEEK_KEY = 'sk-127484eb7cba4aac895a05c14e6d233c'
DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions'
PORT = 8888
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')

# Simple rate limiter — max 30 requests per minute total
_requests = []

def rate_limit_ok():
    now = time.time()
    global _requests
    _requests = [t for t in _requests if now - t < 60]
    if len(_requests) >= 30:
        return False
    _requests.append(now)
    return True


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def do_POST(self):
        if self.path == '/api/reading':
            if not rate_limit_ok():
                self._json_reply(429, {'error': 'Too many requests. Please wait.'})
                return
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = json.loads(self.rfile.read(length))
            except (json.JSONDecodeError, ValueError):
                self._json_reply(400, {'error': 'Invalid JSON'})
                return

            prompt = body.get('prompt', '')
            if not prompt:
                self._json_reply(400, {'error': 'Missing prompt'})
                return

            try:
                req = Request(DEEPSEEK_URL, data=json.dumps({
                    'model': 'deepseek-chat',
                    'max_tokens': 1200,
                    'temperature': 0.8,
                    'messages': [
                        {'role': 'system', 'content': '你是资深塔罗解读师，精通78张牌的含义与典故。解读神秘深刻，温暖有力。始终用中文，用"你"称呼用户。'},
                        {'role': 'user', 'content': prompt},
                    ],
                }).encode('utf-8'), headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {DEEPSEEK_KEY}',
                })
                resp = urlopen(req, timeout=45)
                data = json.loads(resp.read())
                content = data['choices'][0]['message']['content']
                self._json_reply(200, {'content': content})
            except HTTPError as e:
                err = json.loads(e.read().decode('utf-8')) if e.fp else {}
                self._json_reply(e.code, {'error': err.get('error', {}).get('message', f'API Error {e.code}')})
            except URLError as e:
                self._json_reply(502, {'error': f'Cannot reach AI service: {e.reason}'})
            except Exception as e:
                self._json_reply(500, {'error': str(e)})
        else:
            self._json_reply(404, {'error': 'Not found'})

    def _json_reply(self, status, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, fmt, *args):
        # Suppress static file log noise
        if 'api/reading' in str(args):
            super().log_message(fmt, *args)


if __name__ == '__main__':
    print(f'\n  Stellar Oracle backend on http://localhost:{PORT}\n')
    HTTPServer(('', PORT), Handler).serve_forever()
