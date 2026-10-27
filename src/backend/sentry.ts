/**
 * Ошибки API в Sentry. Без `SENTRY_DSN` SDK не включается, поэтому локально и в тестах
 * ничего никуда не уходит.
 */

import { readFileSync } from 'node:fs'
import * as Sentry from '@sentry/node'

const { name, version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

export function initSentry() {
	const dsn = process.env.SENTRY_DSN

	if (!dsn) return

	Sentry.init({
		dsn,
		environment: process.env.SENTRY_ENVIRONMENT || 'production',
		// Без tracesSampleRate трейсинг выключен: таплисту хватает ошибок.
		release: `${name}@${version}`,
		// Явно, а не по умолчанию: дефолты v11 собирают пользователя, куки, заголовки и тела.
		dataCollection: {
			userInfo: false,
			cookies: false,
			httpHeaders: false,
			httpBodies: [],
			urlQueryParams: false,
			genAI: { inputs: false, outputs: false },
			stackFrameVariables: false,
		},
		// Сессии не нужны, только ошибки: ни на каждый запрос, ни на весь процесс.
		integrations: (defaults) => [
			...defaults.filter(({ name }) => name !== 'Http' && name !== 'ProcessSession'),
			Sentry.httpIntegration({ sessions: false }),
		],
	})
}

/** Отправляет в Sentry ошибку, на которую API ответил 500. */
export function reportError(error: unknown) {
	Sentry.captureException(error)
}
