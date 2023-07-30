<script lang="ts">
	import { page } from '$app/stores';
	import type RecordItem from './records/RecordItem.svelte';
	import type { IPAddress } from '$lib/types/db';
	import { Button } from 'flowbite-svelte';
	import CurrentIpInfo from './DashboardHeader.svelte';
	import { invalidateAll } from '$app/navigation';
	import RecordsListMinimal from './records/RecordsListMinimal.svelte';
	import DashboardHeader from './DashboardHeader.svelte';
	import RecordItemMinimal from './records/RecordItemMinimal.svelte';
	import DashboardRecordItem from './DashboardRecordItem.svelte';
	import DashboardRecordDetail from './DashboardRecordDetail.svelte';
	let ipAddressData: IPAddress = $page.data.ipAddress;
	let enabledCount = $page.data.enabled_count;
	let records = $page.data.records;
	let selectedRecord = null;
	function clickRecord(record) {
		selectedRecord = record;
	}
	function forceUpdateRefresh() {
		console.log('Reacting to dispatch');
		invalidateAll();
		ipAddressData = $page.data.ipAddress;
	}
	$: ipAddressData = $page.data.ipAddress;
</script>

<DashboardHeader {ipAddressData} on:message={forceUpdateRefresh} />

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
