export const UNINSTALL_REASONS = [
	'better_alternative',
	'too_many_notifications',
	'bugs',
	'missing_features',
	'too_complicated',
	'privacy_concerns',
	'stopped_using_twitch',
	'other',
] as const;

export type UninstallReason = (typeof UNINSTALL_REASONS)[number];

export const UNINSTALL_REASON_LABELS: Record<UninstallReason, string> = {
	better_alternative: 'Found a better alternative',
	too_many_notifications: 'Too many or unwanted notifications',
	bugs: "Didn't work as expected (bugs)",
	missing_features: 'Missing features I need',
	too_complicated: 'Too complicated to use',
	privacy_concerns: 'Privacy concerns',
	stopped_using_twitch: 'No longer use Twitch',
	other: 'Other',
};

export interface Feedback {
	reasons: UninstallReason[];
	/** Only meaningful when `reasons` includes 'missing_features'. */
	missingFeatureDetails?: string;
	/** Free-text elaboration, independent of which reasons were picked. */
	comment?: string;
	manifestVersion: string;
	operatingSystem: string;
	extensionID: string;
	browserName: string;
}
