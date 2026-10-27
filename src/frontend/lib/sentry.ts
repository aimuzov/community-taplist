import { init } from '@sentry/browser'

/**
 * Ошибки табло и редактора в Sentry. Только ошибки: трейсинг и replay в браузере включаются
 * отдельными интеграциями, их здесь нет.
 *
 * Модуль грузится отдельным чанком из base.astro и только в production-сборке с DSN.
 */
export function initSentry(dsn: string) {
	init({
		dsn,
		environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
		release: `community-taplist@${import.meta.env.APP_VERSION}`,
		// Сессия ушла бы в Sentry на каждый заход, а нужны только ошибки.
		integrations: (defaults) => defaults.filter(({ name }) => name !== 'BrowserSession'),
	})
}
