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
<div class="p-4 rounded">
	<div class=" bg-white dark:bg-neutral-800 w-full rounded-lg shadow-xl dark:text-white">
		<div class="p-4 border-b dark:border-neutral-600">
			<h2 class="text-2xl dark:text-white">Settings</h2>
			<p class="text-sm text-gray-500">fghfghgf</p>
		</div>
		<div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-gray-400">Automatic Updates</p>
				<p><Label for="radio2"><Toggle class="ml-4" checked={true}>Enabled</Toggle></Label></p>
			</div>
			<div
				class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-gray-400">Interval</p>
				<p>
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
				</p>
			</div>
			{#each ipProviders as ipProvider}
				<div
					class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
				>
					<p class="text-neutral-600 dark:text-gray-400">{ipProvider.name}:</p>
					<p>
						<Toggle
							class="ml-4"
							checked={ipProvider.active === 1}
							on:click={() => toggleStatus(ipProvider)}
						>
							{ipProvider.active === 1 ? 'Enabled' : 'Disabled'}
						</Toggle>
					</p>
				</div>
			{/each}
			<div
				class="md:grid md:grid-cols-2 hover:bg-gray-50 dark:hover:bg-neutral-700 md:space-y-0 space-y-1 p-4 border-b dark:border-neutral-600"
			>
				<p class="text-neutral-600 dark:text-gray-400">Debug Logging</p>
				<p><Toggle class="ml-4" checked={false}>Disabled</Toggle></p>
			</div>
		</div>
	</div>
</div>
