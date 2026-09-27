# Deployment

[Русская версия](deploy.ru.md)

## Docker Compose

```bash
cp .env.example .env   # fill it in, including ORIGIN
docker compose up -d --build
```

The image is built for `linux/amd64`. The build stage runs natively on the host, so building on
Apple Silicon is fast; only the final image targets the server platform.

The container is limited to 160 MB of memory (`mem_limit`) and the Node heap to 96 MB, which is
enough for the app and keeps it from starving other services on a small VPS.

## Behind a reverse proxy

By default compose publishes port 3000 (override it with `PORT` in the shell environment). When a
reverse proxy runs in Docker on the same host, it is cleaner to skip publishing the port and
connect the containers through a shared network. Put host-specific settings into
`docker-compose.override.yml` next to `docker-compose.yml` -- compose picks it up automatically and
git ignores it:

```yaml
services:
  taplist:
    ports: !reset []
    networks:
      - edge

networks:
  edge:
    external: true
```

```bash
docker network create edge   # once
docker compose up -d --build
```

Caddy example (the proxy container must also be in the `edge` network):

```caddyfile
taplist.example.com {
	reverse_proxy taplist:3000
}
```

Set `ORIGIN` in `.env` to the public URL, e.g. `ORIGIN=https://taplist.example.com`: behind a
proxy adapter-node cannot tell the public protocol and host on its own.

## TV setup

Open `https://<host>` in the TV browser in full-screen mode and pick a screen with the remote,
RETURN brings you back. The layout is designed for 1920×1080 and scales down for 1280×720.
The board fetches fresh data every `PUBLIC_DATA_UPDATE_INTERVAL` milliseconds and reloads
itself once after a new deploy.

The client bundle targets Chromium 68 (LG webOS 5). Older TVs still show the board, but without
remote navigation and live updates.
