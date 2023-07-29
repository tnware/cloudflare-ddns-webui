<script lang="ts">
	import { Heading, Secondary } from 'flowbite-svelte';
	import type { IPAddress } from '$lib/types/db';
	export let ipAddressData: IPAddress;
</script>

{#if ipAddressData}
	<div class="text-end">
		<p class="font-thin dark:text-white">Current IP Address:</p>
		<Heading tag="h2" customSize="text-4xl font-extrabold">{ipAddressData.ipAddress}</Heading>
		<Secondary class="ml-2">Last Updated: {ipAddressData.lastUpdated}</Secondary>
	</div>
{:else}
	<p>Reading IP Address Data</p>
{/if}
