<script lang="ts">
	import '../app.postcss';
	import { DarkMode } from 'flowbite-svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<NavBar />
<div class="p-4 dark:bg-neutral-900 min-h-screen">
	<div class="max-w-[1600px] mx-auto">
		<slot />
		<div class="text-end p-2"><DarkMode /></div>
	</div>
</div>
