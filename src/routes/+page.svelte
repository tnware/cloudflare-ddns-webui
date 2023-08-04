<script lang="ts">
	import { page } from '$app/stores';
	import type { IPAddress, Settings } from '$lib/types/db';
	import { Badge, Button } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	import DashboardRecordItem from './DashboardRecordItem.svelte';
	import DashboardRecordDetail from './DashboardRecordDetail.svelte';
	import { onDestroy } from 'svelte';
	let ipAddressData: IPAddress = $page.data.ipAddress;
	let records = $page.data.records;
	let automaticRefresh_setting: Settings = $page.data.automaticRefresh_setting;
	let autoRefreshEnabled = automaticRefresh_setting.value === 'true' ? true : false;
	let selectedRecord = null;

	function refreshData() {
		invalidateAll();
		ipAddressData = $page.data.ipAddress;
	}

	function clickRecord(record) {
		selectedRecord = record;
	}
	async function forceUpdate() {
		const response = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ text: 'force update' }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			console.log(response); // Log the entire response
			refreshData();
		}
	}
	let currentTime = new Date();
	const intervalId = setInterval(() => {
		currentTime = new Date();
		let timeUntilNextUpdate = new Date(ipAddressData.nextUpdate) - currentTime;

		if (timeUntilNextUpdate <= 0) {
			refreshData();
		}
	}, 1000);

	onDestroy(() => {
		clearInterval(intervalId);
	});

	$: timeUntilNextUpdate = new Date(ipAddressData.nextUpdate) - currentTime;
	$: formattedTimeUntilNextUpdate = new Date(timeUntilNextUpdate).toISOString().substr(11, 8);
	$: ipAddressData = $page.data.ipAddress;
	$: records = $page.data.records;
</script>

{#if ipAddressData}
	<div class="p-4">
		<div class="sm:flex sm:items-center sm:justify-between">
			<div class="text-center sm:text-left">
				<h1 class="text-2xl font-bold text-white sm:text-3xl">{ipAddressData.ipAddress}</h1>
				{#if autoRefreshEnabled}
					<Badge large color="green">Automatic Refresh {formattedTimeUntilNextUpdate}</Badge>
				{:else}
					<Badge large color="red">Automatic Refresh Disabled</Badge>
				{/if}
				<p class="mt-1.5 text-sm text-gray-400">Current Time: {currentTime}</p>
				<p class="mt-1.5 text-sm text-gray-400">Last Updated: {ipAddressData.lastUpdated}</p>
				<p class="mt-1.5 text-sm text-gray-400">Next Update: {ipAddressData.nextUpdate}</p>
			</div>

			<div class="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
				<div class="text-center">
					<Button color="yellow" on:click={() => forceUpdate()}
						>Force Update <svg
							class="w-3.5 h-3.5 ml-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 5h12m0 0L9 1m4 4L9 9"
							/>
						</svg></Button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
	<div class="rounded-lg bg-neutral-800 p-2">
		<div class="bg-neutral-800 text-white p-2 rounded-t-lg">Active Records</div>
		{#if records && records.length > 0}
			{#each records as record}
				<div class="py-1" on:click={() => clickRecord(record)}>
					<DashboardRecordItem {record} />
				</div>
			{/each}
		{:else}
			<section class="max-w-lg px-4 py-12 mx-auto">
				<h2 class="mt-2 text-lg font-medium text-center text-neutral-400">
					This is where you’ll manage your records.
				</h2>
				<p class="mt-1 text-center text-neutral-500">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maxime maiores consectetur
					necessitatibus animi ea veniam optio eos! Id animi et excepturi earum aliquid deleniti.
				</p>
				<div
					class="flex flex-col items-center justify-center mt-4 space-y-1 md:flex-row md:space-y-0 md:space-x-1 text-neutral-300"
				>
					<button
						class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-yellow-600 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-opacity-80"
					>
						Manage Records
					</button>
					<button
						class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-yellow-800 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-opacity-80"
					>
						Manage Zones
					</button>
				</div>
			</section>
		{/if}
	</div>
	<div class="rounded-lg lg:col-span-2 p-2">
		{#if selectedRecord}
			<DashboardRecordDetail {selectedRecord} />
		{:else}
			<section class="max-w-lg px-4 py-12 mx-auto">
				<h2 class="mt-2 text-lg font-medium text-center text-neutral-400">
					Select a record to view in detail.
				</h2>
				<p class="mt-1 text-center text-neutral-500">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maxime maiores consectetur
					necessitatibus animi ea veniam optio eos! Id animi et excepturi earum aliquid deleniti.
				</p>
				<div
					class="flex flex-col items-center justify-center mt-4 space-y-1 md:flex-row md:space-y-0 md:space-x-1 text-neutral-300"
				>
					<button
						class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-yellow-600 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-opacity-80"
					>
						Manage Records
					</button>
					<button
						class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-yellow-800 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-opacity-80"
					>
						Manage Zones
					</button>
				</div>
			</section>
		{/if}
	</div>
</div>
