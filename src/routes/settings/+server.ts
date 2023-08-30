import { db } from '$lib/server/database';
import { json } from '@sveltejs/kit';
import { getIpProviders } from '$lib/server/api.js';

const ACTIONS = {
	UPDATE_IP_PROVIDER_STATUS: 'updateIpProviderStatus',
	AUTOMATIC_IP_REFRESH_TOGGLE: 'automaticIpRefreshToggle',
	MANUAL_IP_REFRESH_TOGGLE: 'manualIpRefreshToggle',
	UPDATE_IP_REFRESH_INTERVAL: 'updateIpRefreshInterval'
};

export async function POST({ request }: { request: Request }) {
	const payload = await request.json();

	switch (payload.action) {
		case ACTIONS.UPDATE_IP_PROVIDER_STATUS:
			return handleUpdateIpProviderStatus(payload);
		case ACTIONS.AUTOMATIC_IP_REFRESH_TOGGLE:
			return handleAutomaticIpRefreshToggle(payload);
		case ACTIONS.MANUAL_IP_REFRESH_TOGGLE:
			return handleManualIpRefreshToggle(payload);
		case ACTIONS.UPDATE_IP_REFRESH_INTERVAL:
			return handleUpdateIpRefreshInterval(payload);
		default:
			return json({
				status: 400,
				body: {
					error: 'Invalid action'
				}
			});
	}
}

async function handleUpdateIpProviderStatus(payload) {
	const { id, active } = payload;
	const ipProvider = await getIpProviders(id);

	if (!ipProvider) {
		return json({
			status: 404,
			body: {
				error: 'IpProvider not found'
			}
		});
	}

	const newStatus = active ? 1 : 0;
	await db('IpProviders').where('id', id).update({ active: newStatus });

	return json({
		status: 200,
		body: {
			success: true,
			message: 'IpProvider status updated successfully'
		}
	});
}

async function handleAutomaticIpRefreshToggle(payload) {
	const { automaticIpRefresh } = payload;
	const newValue = automaticIpRefresh ? 'true' : 'false';
	await db('Settings').where('name', 'automatic_ip_refresh').update({ value: newValue });

	return json({
		status: 200,
		body: {
			success: true,
			message: 'Automatic IP Refresh status updated successfully'
		}
	});
}

async function handleManualIpRefreshToggle(payload) {
	return json({
		status: 200,
		body: {
			success: true,
			message: 'Automatic IP Refresh status updated successfully'
		}
	});
}

async function handleUpdateIpRefreshInterval(payload) {
	const { interval } = payload;
	await db('Settings').where('name', 'ip_update_interval').update({ value: interval });
	return json({ success: true, message: 'IP refresh interval updated successfully' });
}
