FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# rembg lazily downloads u2net (~176MB) on its first call, inside the container,
# and every rebuild wipes it. That put ~115s of model download in front of the
# first try-on after each deploy -- measured at 130s against a 150s worker
# timeout, so a slow network turns the first customer's request into a killed
# worker and an HTML error page. Fetch it at build time so it ships in the layer.
RUN python -c "from rembg import new_session; new_session('u2net')"

COPY . .

RUN mkdir -p static/uploads

EXPOSE 5000

CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
