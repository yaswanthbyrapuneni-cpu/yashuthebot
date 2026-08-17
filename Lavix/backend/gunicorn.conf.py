bind = "0.0.0.0:5000"

# Try-on requests block on Vertex AI for up to VERTEX_TIMEOUT (90s), then still
# have to decode and base64-encode the result. The timeout hierarchy must give
# each layer headroom over the one below it:
#
#   Vertex request 90s  <  gunicorn worker 150s  <  nginx proxy_read 180s
#
# These used to both be 120s, so a slow-but-successful Vertex call was killed by
# gunicorn while encoding its response. nginx then returned an HTML error page,
# which the frontend tried to JSON.parse -- surfacing as
# "Unexpected token '<', "<html> <h"... is not valid JSON".
timeout = 150
graceful_timeout = 30

# gthread rather than sync: a try-on worker spends almost all its time blocked
# on network I/O waiting for Vertex. With sync workers only 2 try-ons could be
# in flight at once and a third customer would queue behind them.
worker_class = "gthread"
workers = 2
threads = 4

keepalive = 5
max_requests = 500
max_requests_jitter = 50
accesslog = "-"
errorlog = "-"
loglevel = "info"
