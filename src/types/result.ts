export interface ApiError {
	readonly status: number;
	readonly message: string;
}

export type Result<T, E = ApiError> =
	| {
			readonly ok: true;
			readonly data: T;
	  }
	| {
			readonly ok: false;
			readonly error: E;
	  };

export async function request<T>(url: string, options?: RequestInit): Promise<Result<T>> {
	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			return {
				ok: false,
				error: {
					status: response.status,
					message: response.statusText,
				},
			};
		}

		const data = (await response.json()) as T;

		return {
			ok: true,
			data,
		};
	} catch (err) {
		return {
			ok: false,
			error: {
				status: 0,
				message: err instanceof Error ? err.message : String(err),
			},
		};
	}
}
