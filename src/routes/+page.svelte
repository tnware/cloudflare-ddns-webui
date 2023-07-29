<script lang="ts">
	import { page } from '$app/stores';
	import type { IPAddress } from '$lib/types/db';
	import { Button } from 'flowbite-svelte';
	import CurrentIpInfo from './CurrentIPInfo.svelte';
	import { invalidateAll } from '$app/navigation';
	let ipAddressData: IPAddress = $page.data.ipAddress;
	let enabledCount = $page.data.enabled_count;

	function forceUpdateRefresh() {
		console.log("Reacting to dispatch");
		invalidateAll()
		ipAddressData = $page.data.ipAddress;
	}
	$: ipAddressData = $page.data.ipAddress;
</script>


<CurrentIpInfo {ipAddressData} on:message={forceUpdateRefresh}></CurrentIpInfo>

<main class="dark:text-white">
	<div class=" dark:text-white py-10">
		<div class="container mx-auto">
			<h1 class="text-4xl font-bold mb-4">Cloudflare Dynamic DNS Update Status</h1>
			<div class="grid grid-cols-3 gap-4">
				<div class="col-span-3 md:col-span-1">
					<div class="bg-green-600 p-4 rounded-lg text-center">
						<h2 class="text-lg font-medium">IP Address Refreshing</h2>
						<p class="text-sm">Enabled (5min)</p>
					</div>
				</div>
				<div class="col-span-3 md:col-span-1">
					<div class="bg-blue-600 p-4 rounded-lg text-center">
						<h2 class="text-lg font-medium">Records Assigned</h2>
						<p class="text-sm">{enabledCount} Record(s)</p>
					</div>
				</div>
				<div class="col-span-3 md:col-span-1">
					<div class="bg-purple-600 p-4 rounded-lg text-center">
						{#if ipAddressData}
							<h2 class="text-lg font-medium">{ipAddressData.ipAddress}</h2>
							<p class="text-sm">{ipAddressData.lastUpdated}</p>
						{:else}
							<p>Reading IP Address Data</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
