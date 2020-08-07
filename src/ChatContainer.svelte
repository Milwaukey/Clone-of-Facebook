<script>
    // import Active from './Active.svelte';
    import NotificationIndicator from './NotificationIndicator.svelte';
    import {mongoData} from './mongoData.js'
    import ProfileImage from './ProfileImage.svelte'
    import Chat from './Chat.svelte'
    import {aChats} from './chatData.js'
    import {aMinimizedChats} from './chatData.js'

    import ChatMinimized from './ChatMinimized.svelte'

    let messageCount = $mongoData.unReadMessages.length

</script>



<!-- ########################################## -->

<section>
    {#each $aMinimizedChats.reverse() as chatMinimized}

        <ChatMinimized userObjectMinimizedChat={chatMinimized}/>

    {/each}
</section>




<div id="chatWindowContainer">
    {#each $aChats as chat}
        <Chat user={chat} />
    {/each}
</div>

<!-- ########################################## -->


<style>



section{
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 5rem;
    max-height: 60vh;
    padding: 10px;
    display: grid;
    grid-gap: 10px;
}

#chatWindowContainer {
    position: fixed;
    bottom: 0;
    right: 100px;
    grid-gap: 15px;
    display: flex;
    flex-direction: row-reverse;
}


</style>