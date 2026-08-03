/**
 * Firefox (MV2) only exposes `browserAction`, not `action` — and its `browserAction`
 * has no `setBadgeTextColor`. This wraps both so callers don't need to branch.
 */
export async function setBadge(text: string, color: string, textColor?: string) {
	const action = browser.action ?? browser.browserAction;

	await action.setBadgeText({ text });
	await action.setBadgeBackgroundColor({ color });

	if (textColor && 'setBadgeTextColor' in action) {
		await action.setBadgeTextColor({ color: textColor });
	}
}
