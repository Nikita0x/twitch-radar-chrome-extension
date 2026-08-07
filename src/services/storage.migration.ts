import type { StreamerId } from '@/stores/user-settings.store';

import {
	DEFAULT_NOTIFICATION_SETTINGS,
	DEFAULT_STORAGE,
	type AuthState,
	type Sort,
	type StorageSchema,
	type StreamerNotifications,
} from '@/services/storage.service';

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

// Pre-split shape: everything nested under a single "storage" key with a
// `version` field. Replaced by three independent top-level keys (see
// storage.service.ts) to fix a read-modify-write race between concurrent
// saves to different domains (e.g. background alarm vs. popup settings save).
interface StorageSchemaV2 extends StorageSchema {
	version: 2;
}

function migrateV1toV2(storage: StorageSchemaV1): StorageSchemaV2 {
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
		version: 2,

		auth: storage.auth,

		userSettings: {
			sort: storage.userSettings.sort,
			theme: storage.userSettings.theme,
			notifications,
			livePreviews: false,
		},

		runtime: {
			previousStreams: {},
			liveStreams: [],
			previewTick: 0,
		},
	};
}

/**
 * Splits the legacy single-blob "storage" value (v1, no `version` field; or
 * v2, `version: 2`) into the current { auth, userSettings, runtime } shape.
 */
export function migrateLegacyStorage(storage: unknown): StorageSchema {
	if (!storage || typeof storage !== 'object') {
		return structuredClone(DEFAULT_STORAGE);
	}

	if (!('version' in storage)) {
		return migrateV1toV2(storage as StorageSchemaV1);
	}

	switch (storage.version) {
		case 2:
			return storage as StorageSchemaV2;

		default:
			console.warn('Unknown storage version. Resetting storage.');

			return structuredClone(DEFAULT_STORAGE);
	}
}
