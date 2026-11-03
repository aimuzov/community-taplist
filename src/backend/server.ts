/**
 * API таплиста: список кранов для табло и его сохранение из редактора.
 *
 * Node запускает файл сам, без сборки. Пароль редактора проверяет Caddy
 * (basic_auth на /editor и PUT /api/items), сюда приходят уже разрешённые запросы.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { HttpError, readJson as readJsonBody } from '@aimuzov/infra-node-kit/http.js'

import { initSentry, reportError } from '#backend/sentry.ts'
import { itemsGet, itemsPut } from '#backend/store.ts'
import { isItemList } from '#shared/types.ts'

const PORT = Number(process.env.PORT || 8787)

// Редактор шлёт весь список вместе с обложками в data URL.
export const BODY_LIMIT = 16 * 1024 * 1024

type Reply = [status: number, body: unknown]

export { HttpError }

export function readJson(request: AsyncIterable<Buffer>, limit = BODY_LIMIT): Promise<unknown> {
	return readJsonBody(request, {
		limit,
		tooLargeMessage: 'Список больше 16 МБ: уменьшите обложки',
		invalidJsonMessage: 'Тело запроса не JSON',
	})
}

const routes: Record<string, (request: IncomingMessage) => Promise<Reply>> = {
	'GET /api/items': async () => [200, { items: await itemsGet() }],

	'PUT /api/items': async (request) => {
		const items = await readJson(request)

		if (!isItemList(items)) throw new HttpError(400, 'Ожидается список кранов')

		await itemsPut(items)

		// Список с обложками весит мегабайты, а редактор и так знает, что отправил.
		return [200, { ok: true }]
	},

	'GET /api/health': async () => [200, { ok: true }],
}

async function handle(request: IncomingMessage, response: ServerResponse) {
	const { pathname } = new URL(request.url ?? '/', 'http://localhost')
	const route = routes[`${request.method} ${pathname}`]

	let status: number
	let body: unknown

	try {
		;[status, body] = route ? await route(request) : [404, { error: 'Нет такой ручки' }]
	} catch (error) {
		if (!(error instanceof HttpError)) {
			console.error(error)
			reportError(error)
		}

		status = error instanceof HttpError ? error.status : 500
		body = { error: (error as Error).message }
	}

	response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
	response.end(JSON.stringify(body))
}

// Тесты импортируют readJson, сервер поднимается только при запуске файла.
if (import.meta.main) {
	initSentry()
	createServer(handle).listen(PORT, () => console.log(`api: http://localhost:${PORT}`))
}
