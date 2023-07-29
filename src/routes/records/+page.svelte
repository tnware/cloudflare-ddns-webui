<script lang="ts">
	/** @type {import('./$types').LayoutData} */
	//export let data: {};
	import { page } from '$app/stores';
	import RecordsCounter from './RecordsCounter.svelte';
	import RecordsList from './RecordsList.svelte';
	import CurrentIpHeader from './CurrentIPHeader.svelte';
	import type { IPAddress, Record } from '$lib/types/db';
	import RecordsListMinimal from './RecordsListMinimal.svelte';
	let ipAddressData: IPAddress = $page.data.ipAddress;
	let records: Record[] = $page.data.records;
	let enabledCount = $page.data.enabled_count;
	let totalCount = $page.data.total_count;
</script>

<CurrentIpHeader {ipAddressData} />

<main class="">
	<div class="flex justify-between items-center mb-4 p-4">
		<h5 class="text-3xl font-bold leading-none text-gray-900 dark:text-white">DNS Records</h5>
	</div>

	<RecordsCounter {enabledCount} {totalCount} />

	<RecordsListMinimal {records} />
</main>
