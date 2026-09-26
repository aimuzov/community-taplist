# Деплой

[English version](deploy.md)

## Docker Compose

```bash
cp .env.example .env   # заполнить, включая ORIGIN
docker compose up -d --build
```

Образ собирается под `linux/amd64`. Стадия сборки идёт нативно на хосте, поэтому на Apple Silicon
это быстро; под платформу сервера собирается только финальный образ.

Контейнер ограничен 160 МБ памяти (`mem_limit`), куча Node -- 96 МБ. Приложению этого хватает, и
оно не отнимет память у соседних сервисов на маленьком VPS.

## За reverse proxy

По умолчанию compose публикует порт 3000 (можно поменять через `PORT` в окружении шелла). Если
reverse proxy крутится в Docker на том же хосте, лучше не публиковать порт, а связать контейнеры
общей сетью. Настройки конкретного сервера кладите в `docker-compose.override.yml` рядом с
`docker-compose.yml` -- compose подхватывает его сам, а git игнорирует:

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
docker network create edge   # один раз
docker compose up -d --build
```

Пример для Caddy (контейнер прокси тоже должен быть в сети `edge`):

```caddyfile
taplist.example.com {
	reverse_proxy taplist:3000
}
```

Укажите в `.env` публичный URL в `ORIGIN`, например `ORIGIN=https://taplist.example.com`: за
прокси adapter-node сам не знает публичные протокол и хост.

## Телевизоры

Откройте `https://<host>/tv/1` и `https://<host>/tv/2` в браузерах телевизоров в полноэкранном
режиме. Вёрстка рассчитана на 1920×1080 и масштабируется под 1280×720. Страницы перезагружаются
каждые `PUBLIC_DATA_UPDATE_INTERVAL` миллисекунд.
