import type { StreamerId } from '@/stores/user-settings.store';

import {
	DEFAULT_NOTIFICATION_SETTINGS,
	DEFAULT_STORAGE,
	STORAGE_VERSION,
	type AuthState,
	type Sort,
	type StorageSchema,
	type StreamerNotifications,
} from './storage.service';

interface StorageSchemaV1 {
	auth: AuthState;

	userSettings: {
		autoOpen: boolean;
		enableAllNotifications: boolean;
		sort: Sort;
		theme: 'light' | 'dark';
	};

	streamerNotifications: Record<StreamerId, boolean>;

	notifiedStreams: Record<StreamerId, string>;
}

function migrateV1toV2(storage: StorageSchemaV1): StorageSchema {
	const notifications: Record<StreamerId, StreamerNotifications> = {};

	for (const [streamerId, enabled] of Object.entries(storage.streamerNotifications)) {
		notifications[streamerId] = {
			...structuredClone(DEFAULT_NOTIFICATION_SETTINGS),

			live: {
				enabled,
				autoOpen: storage.userSettings.autoOpen,
			},
		};
	}

	return {
		version: STORAGE_VERSION,

		auth: storage.auth,

		userSettings: {
			sort: storage.userSettings.sort,
			theme: storage.userSettings.theme,
			notifications,
		},

		runtime: {
			previousStreams: {},
		},
	};
}

export function migrateStorage(storage: unknown): StorageSchema {
	if (!storage) {
		return structuredClone(DEFAULT_STORAGE);
	}

	if (typeof storage !== 'object') {
		return structuredClone(DEFAULT_STORAGE);
	}

	if (!('version' in storage)) {
		return migrateV1toV2(storage as StorageSchemaV1);
	}

	switch (storage.version) {
		case STORAGE_VERSION:
			return storage as StorageSchema;

		default:
			console.warn('Unknown storage version. Resetting storage.');

			return structuredClone(DEFAULT_STORAGE);
	}
}
