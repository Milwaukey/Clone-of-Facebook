import {writable} from 'svelte/store'

export let aChats = writable([])

export let aMinimizedChats = writable([])

export let myChats = writable({
    "chats":[]
})