// Только interface сливается с ImportMetaEnv из Vite, type объявить второй раз нельзя.
// oxlint-disable-next-line typescript/consistent-type-definitions
interface ImportMetaEnv {
	/** Метка сборки из astro.config.mjs. */
	readonly BUILD_VERSION: string
	/** Release version from package.json, shown in the editor. */
	readonly APP_VERSION: string
	/** Как часто табло забирает свежий список, в миллисекундах. */
	readonly PUBLIC_DATA_UPDATE_INTERVAL?: string
	/** DSN проекта community-taplist в Sentry. Без него SDK не грузится. */
	readonly PUBLIC_SENTRY_DSN?: string
	/** Окружение событий в Sentry, по умолчанию production. */
	readonly PUBLIC_SENTRY_ENVIRONMENT?: string
}
