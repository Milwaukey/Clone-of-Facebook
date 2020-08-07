import {writable} from 'svelte/store'

export let mongoData = writable(
    {
        "profileImage" : '',
        "unReadMessages":[],
        "notifications":[],
        "friends":[],
        "friendRequests":[]
    }
)


export let posts = writable([])

