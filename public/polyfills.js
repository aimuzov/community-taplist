// Браузер LG webOS 5 -- Chromium 68. Синтаксис сборка опускает сама, а этих API
// рантайма Svelte и SDK Sentry в нём нет. replaceAll Svelte зовёт со строкой
// или с /g-регуляркой.
//
// Файлом, а не инлайн-скриптом потому что is:inline скрипты Astro не хеширует
// для своей CSP. Инлайн-тело блокируется, а файл с того же origin проходит по 'self'.
if (typeof globalThis === 'undefined') window.globalThis = window

if (!window.queueMicrotask)
	window.queueMicrotask = function (callback) {
		Promise.resolve().then(callback)
	}

if (!String.prototype.replaceAll)
	String.prototype.replaceAll = function (pattern, replacement) {
		if (pattern instanceof RegExp) return this.replace(pattern, replacement)

		return this.split(pattern).join(replacement)
	}

// Эти два зовёт SDK Sentry: fromEntries при разборе событий, allSettled при отправке.
if (!Object.fromEntries)
	Object.fromEntries = function (entries) {
		var result = {}

		// defineProperty, а не присваивание: ключ __proto__ должен стать обычным полем.
		Array.from(entries).forEach(function (entry) {
			Object.defineProperty(result, entry[0], {
				value: entry[1],
				enumerable: true,
				writable: true,
				configurable: true,
			})
		})

		return result
	}

if (!Promise.allSettled)
	Promise.allSettled = function (promises) {
		var inputs

		// Как у настоящего allSettled: ошибка перебора -- отклонённый промис, а не исключение.
		try {
			inputs = Array.from(promises)
		} catch (error) {
			return Promise.reject(error)
		}

		return Promise.all(
			inputs.map(function (promise) {
				return Promise.resolve(promise).then(
					function (value) {
						return { status: 'fulfilled', value: value }
					},
					function (reason) {
						return { status: 'rejected', reason: reason }
					},
				)
			}),
		)
	}
