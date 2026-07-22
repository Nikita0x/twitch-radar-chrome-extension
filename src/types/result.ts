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

export function ok<T>(data: T): Result<T> {
	return { ok: true, data };
}

export function err<E = ApiError>(error: E): Result<never, E> {
	return { ok: false, error };
}

export interface Response<T> {
	data: T;
	pagination: {
		cursor?: string;
	};
}

export async function request<ResponseType>(
	url: string,
	options?: RequestInit
): Promise<Result<ResponseType>> {
	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			return err({
				status: response.status,
				message: response.statusText,
			});
		}

		const data = (await response.json()) as ResponseType;

		return ok(data);
	} catch (error) {
		return err({
			status: 0,
			message: error instanceof Error ? error.message : String(error),
		});
	}
}
