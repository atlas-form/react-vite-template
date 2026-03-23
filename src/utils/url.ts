const BASE_URLS: Record<string, string> = {
	api: import.meta.env.VITE_API_URL,
	auth: import.meta.env.VITE_AUTH_URL,
	file: import.meta.env.VITE_FILE_URL,
};

export type UrlGroup = keyof typeof BASE_URLS;

/**
 * 解析 URL，支持命名前缀组，或完整原始地址
 * @param url - 接口路径或完整 URL
 * @param group - 前缀分组："api" | "auth" | "file"
 * @returns 完整可用的请求 URL
 */
export function resolveUrl(url: string, group: UrlGroup = "api"): string {
	const isAbsolute = /^https?:\/\//.test(url);

	if (isAbsolute) return url;

	const base = BASE_URLS[group];
	if (base === undefined) {
		throw new Error(`[resolveUrl] Unknown URL group: '${group}'`);
	}

	return base + url;
}
