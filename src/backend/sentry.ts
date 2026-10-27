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
	})
}

/** Отправляет в Sentry ошибку, на которую API ответил 500. */
export function reportError(error: unknown) {
	Sentry.captureException(error)
}
