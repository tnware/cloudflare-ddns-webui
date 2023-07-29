<script lang="ts">
	import type { Record } from '$lib/types/db';
	export let records: Record[];
	import RecordItemMinimal from './RecordItemMinimal.svelte';
</script>

<div class="p-8 mx-auto flex flex-col space-y-4">
	<!-- Border gradient -->
	{#each records as record}
		<RecordItemMinimal {record} />
	{/each}
</div>
