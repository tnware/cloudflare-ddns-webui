<script lang="ts">
	import type { PageData } from './$types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toggle,
		P
	} from 'flowbite-svelte';
	import { Select, Label, Input } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	let intervals = [
		{ value: '* * * * *', name: '1 minute' },
		{ value: '*/5 * * * *', name: '5 minutes' },
		{ value: '*/10 * * * *', name: '10 minutes' },
		{ value: '*/15 * * * *', name: '15 minutes' },
		{ value: '*/30 * * * *', name: '30 minutes' }
	];
	import type { IpProviders, Settings } from '$lib/types/db';
	export let data: PageData;
	let ipProviders: IpProviders[] = data.ipProviders;
	let ipUpdateInterval_setting: Settings = data.ipUpdateInterval_setting;

	async function updateIpUpdateInterval() {
		const response = await fetch('/settings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				interval: ipUpdateInterval_setting.value,
				action: 'updateIpRefreshInterval'
			})
		});

		if (response.ok) {
			console.log('IpUpdateInterval value updated successfully');
		} else {
			console.error('Failed to update IpUpdateInterval value');
		}
	}

	async function toggleStatus(ipProvider: IpProviders) {
		const payload = {
			id: ipProvider.id,
			active: !ipProvider.active,
			action: 'updateIpProviderStatus'
		};

		const response = await fetch('/settings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (response.ok) {
			console.log(`Toggle clicked for ${ipProvider.name}. Updated status: ${ipProvider.active}`);
			invalidateAll();
		} else {
			console.error('Failed to update IpProvider status');
		}
	}

	function validateCronFormat(value: string) {
		// Regex pattern for cron job format (e.g., */5 * * * *)
		const cronPattern = /^(\*(\/\d+)?|\d+(-\d+)?)(\s+(\*(\/\d+)?|\d+(-\d+)?)){4}$/;
		const isValid = cronPattern.test(value);
		return isValid ? 'green' : 'red';
	}

	$: ipProviders = data.ipProviders;
</script>

<P size="4xl" weight="semibold">Public IP Settings</P>
<div class="p-4 dark:bg-gray-900 rounded">
	<Table>
		<TableHead>
			<TableHeadCell>Property</TableHeadCell>
			<TableHeadCell>Value</TableHeadCell>
		</TableHead>
		<TableBody>
			<TableBodyRow class="divide-x dark:divide-gray-700">
				<TableBodyCell><Label for="radio1">IP Address Refreshing</Label></TableBodyCell>
				<TableBodyCell
					><Label for="radio2"><Toggle class="ml-4" checked={true}>Enabled</Toggle></Label
					></TableBodyCell
				>
			</TableBodyRow>
			<TableBodyRow class="divide-x dark:divide-gray-700">
				<TableBodyCell><Label for="radio1">Interval</Label></TableBodyCell>
				<TableBodyCell>
					<Label>Select interval</Label>
					<Select
						class="mt-2"
						items={intervals}
						bind:value={ipUpdateInterval_setting.value}
						on:change={() => updateIpUpdateInterval()}
					/>
					<Label for="cron-input">Cron Format</Label>
					<Input
						color={validateCronFormat(ipUpdateInterval_setting.value)}
						id="cron-input"
						type={'text'}
						bind:value={ipUpdateInterval_setting.value}
						on:input={updateIpUpdateInterval}
					/>
					<!-- {validateCronFormat(ipUpdateInterval_setting.value)} -->
				</TableBodyCell>
			</TableBodyRow>
			{#each ipProviders as ipProvider}
				<TableBodyRow class="divide-x dark:divide-gray-700">
					<TableBodyCell>{ipProvider.name}</TableBodyCell>
					<TableBodyCell>
						<Toggle
							class="ml-4"
							checked={ipProvider.active === 1}
							on:click={() => toggleStatus(ipProvider)}
						>
							{ipProvider.active === 1 ? 'Enabled' : 'Disabled'}
						</Toggle>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<P size="4xl" weight="semibold">Cloudflare Settings</P>
<div class="p-4 dark:bg-gray-900 rounded">
	<Table>
		<TableHead>
			<TableHeadCell>Property</TableHeadCell>
			<TableHeadCell>Value</TableHeadCell>
		</TableHead>
		<TableBody>
			<TableBodyRow class="divide-x dark:divide-gray-700">
				<TableBodyCell>Cloudflare E-Mail</TableBodyCell>
				<TableBodyCell
					><Input
						id="cloudflare-email-address"
						type={'text'}
						placeholder="E-Mail Address"
					/></TableBodyCell
				>
			</TableBodyRow>
			<TableBodyRow class="divide-x dark:divide-gray-700">
				<TableBodyCell>Cloudflare API Key</TableBodyCell>
				<TableBodyCell>
					<Input id="cloudflare-api-key" type={'password'} placeholder="API Key" /></TableBodyCell
				>
			</TableBodyRow>
			<TableBodyRow class="divide-x dark:divide-gray-700">
				<TableBodyCell>Cloudflare Zone ID</TableBodyCell>
				<TableBodyCell>
					<Input
						id="cloudflare-zone-id"
						type={'text'}
						bind:value={ipUpdateInterval_setting.value}
					/>
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</div>
