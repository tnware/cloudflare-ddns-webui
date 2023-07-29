<script lang="ts">
	import type { Record, IPAddress } from '$lib/types/db';
	import { page } from '$app/stores';
	import RecordsCounter from '../RecordsCounter.svelte';
	import RecordsList from '../RecordsList.svelte';
	import CurrentIpHeader from '../CurrentIPHeader.svelte';
	import RecordsListMinimal from '../RecordsListMinimal.svelte';
	let ipAddressData: IPAddress = $page.data.ipAddress;
	let enabledCount: number = $page.data.enabled_count;
	let totalCount: number = $page.data.total_count;
	let records: Record[] = $page.data.records;
</script>

<CurrentIpHeader {ipAddressData} />

<main class="">
	<div class="flex justify-between items-center mb-4 p-4">
		<h5 class="text-3xl font-bold leading-none text-gray-900 dark:text-white">DNS Records</h5>
	</div>

	<RecordsCounter {enabledCount} {totalCount} />

	<RecordsListMinimal {records} />
</main>
