# Serves the generated site the way GitHub Pages does, so tests and `pnpm preview` (and Lighthouse
# runs against it) see production behaviour:
# - plain files, <path>/index.html, and /404.html (status 404) for any missing path;
# - `Cache-Control: max-age=600` on every file, plus Last-Modified (answers 304 when unchanged);
# - gzip for text files when the browser accepts it.
# Not reproduced: HTTP/2 and the CDN edge, so real pages load faster than here.
# Usage: python3 tests/e2e/pages_server.py <directory> [port]
import gzip, http.server, os, sys
from pathlib import Path

root = sys.argv[1]
port = int(sys.argv[2]) if len(sys.argv) > 2 else 4322
COMPRESSIBLE = ('text/', 'application/javascript', 'application/json', 'application/xml', 'image/svg+xml')


class GitHubPagesHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=root, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'max-age=600')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            if not self.path.split('?')[0].endswith('/'):
                return super().send_head()  # the base class redirects /dir to /dir/
            path = os.path.join(path, 'index.html')
            if not os.path.isfile(path):
                return self.send_error(404)  # GitHub Pages never lists a folder
        wants_gzip = 'gzip' in self.headers.get('Accept-Encoding', '')
        if not (wants_gzip and os.path.isfile(path) and self.guess_type(path).startswith(COMPRESSIBLE)):
            return super().send_head()
        modified = int(os.path.getmtime(path))
        if self.headers.get('If-Modified-Since') == self.date_time_string(modified):
            self.send_response(304)
            self.end_headers()
            return None
        body = gzip.compress(Path(path).read_bytes())
        content_type = self.guess_type(path)
        self.send_response(200)
        self.send_header('Content-Type', f'{content_type}; charset=utf-8' if content_type.startswith('text/') else content_type)
        self.send_header('Content-Encoding', 'gzip')
        self.send_header('Vary', 'Accept-Encoding')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Last-Modified', self.date_time_string(modified))
        self.end_headers()
        return _Body(body)

    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        body = Path(root, '404.html').read_bytes()
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)


class _Body:
    """A file-like object over bytes, the shape send_head must return."""

    def __init__(self, data):
        self.data = data

    def read(self, *_):
        data, self.data = self.data, b''
        return data

    def close(self):
        pass


http.server.ThreadingHTTPServer(('127.0.0.1', port), GitHubPagesHandler).serve_forever()
