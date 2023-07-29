<script lang='ts'>
import type { IPAddress } from "$lib/types/db";
import { Button } from "flowbite-svelte";
import { createEventDispatcher } from 'svelte';
export let ipAddressData: IPAddress; 
const dispatch = createEventDispatcher();

async function forceUpdate() {
		const response = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ text: "force update" }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			console.log(response.statusText);
            dispatch('message', {
      response: response.statusText
    });
		}
	}

</script>

{#if ipAddressData}
	<div class="text-center">
		<p class="font-thin dark:text-white">Current IP Address:</p>
		<h1
			class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
		>
			{ipAddressData.ipAddress}
		</h1>
		<p
			class="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
		>
			Last Updated: {ipAddressData.lastUpdated}
		</p>
	</div>
		{/if}

        <div class="text-center"><Button color="blue" on:click={() => (forceUpdate())}>Force Update 			<svg
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
        </svg></Button></div>