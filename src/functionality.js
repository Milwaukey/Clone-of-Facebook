import {writable} from 'svelte/store'

export let jData = writable(
    {
        "pageShown":"posts"
    }
)