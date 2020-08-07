<script>

    import ProfileImage from './ProfileImage.svelte'
    import {aChats} from './chatData.js'
    import {aMinimizedChats} from './chatData.js'
    import {myChats} from './chatData.js'


    export let user;
    let chatMessage;


    function closeChat(userID){

        let result = $aChats.filter(user => user._id !== userID)
        $aChats = result

    }

    function miniMizeChatWindow(userObj){

        if( $aMinimizedChats.length == 0 ){
		
        $aMinimizedChats = [ ... $aMinimizedChats, userObj]
        
        let result = $aChats.filter(user => user._id !== userObj._id)
        $aChats = result

        }else{

            // CHECK IF THE ID IS ALREADY IN THEY ARRAY
            if($aMinimizedChats.some(user => user._id !== userObj._id)){
    
                $aMinimizedChats = [ ... $aMinimizedChats, userObj]
                let result = $aChats.filter(user => user._id !== userObj._id)
                $aChats = result

            }

        }
        
    }



async function getMyChat(){

    let connection = await fetch("chats", {

        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()

    $myChats = response[0]

}
getMyChat()

setInterval(function(){
    getMyChat()

},500)


async function sendMessage(conversationUserID){
    let friendID = conversationUserID

    let frmSendMessage = new FormData()
    frmSendMessage.append('chatMessage', chatMessage)

    let connection = await fetch("/addChatMessage/"+friendID, {

        method : 'POST',
        body : frmSendMessage,
        headers : {
            "Authentication": localStorage.jwt
        }
    })

    let response = await connection.json()
    document.querySelector('.individualChatWindow form').reset()

    $myChats = response[0]

    // console.log(response)
}


</script>

<!-- ############################################# -->
    
<div class="individualChatWindow">
    <div class="individualChatWindowHeader">
        <ProfileImage profileImage={user.profileImage} />
        <h5>{user.firstName} {user.lastName}</h5>
        <div>
            <!-- <i class="far fa-window-minimize"></i> -->
            <div on:click={miniMizeChatWindow(user)} class="minimizeChatWindow"></div>
            <div class="closeChatWindow" on:click={closeChat(user._id)}><i class="fas fa-times"></i></div>
        </div>
    </div>
    <div id="scroller" class="individualChatWindowMessages">


        {#each $myChats.chats as singleChat}
            {#if singleChat._id == user._id}

                {#each singleChat.chatsMessages.reverse() as singleMessage}

                    {#if singleMessage.isMeTheSender == true }
                        <div class="messageFromMe"> {singleMessage.message} </div>

                    {:else if singleMessage.isMeTheSender == false}
                        <div class="messageFromFriend"> {singleMessage.message} </div>
                    {/if}
                

                {/each} 

            {/if}
        {/each }

    <div id="anchor"></div>

    </div>
    <div class="invidualChatWindowInput">
    <form on:submit|preventDefault="{sendMessage(user._id)}">
        <input name="chatMessage" bind:value="{chatMessage}" type="text" placeholder="Your Message here ...">
        <button><i class="fas fa-paper-plane"></i></button>
    </form>
    </div>
</div>
    
<!-- ############################################# -->
    
<style>

#scroller * {
    overflow-anchor: none;
}
/* #anchor {
    overflow-anchor: auto;
    height: 1px;
}  */

.individualChatWindow {
    width: 300px;
    height: 350px;
    background: white;
    display: grid;
    grid-template-rows: 3fr 15fr 2fr;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 7px rgba(155, 155, 155, 0.12);
    border-radius: 8px 8px 0 0;
    margin-left: 10px;
}

.individualChatWindowHeader {
    display: grid;
    grid-template-columns: 1fr 3fr 2fr;
    justify-content: center;
    grid-gap: 10px;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    align-items: center;
}

.individualChatWindowHeader div {
    display: flex;
    justify-content: center;
}

.individualChatWindowMessages {
    padding: 15px;
    display: flex;
    /* overflow: hidden; */
    /* flex-direction: column; */
    overflow-y: scroll;
    overflow:auto;
    flex-direction: column-reverse;


}

.invidualChatWindowInput {

    padding: 15px;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
}

.invidualChatWindowInput form {
        display: grid;
    grid-template-columns: 4fr 1fr;
}

.invidualChatWindowInput form button {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #1B76F2;
    font-size: 20px;
}


input {
    padding: 10px;
}

.messageFromMe {
    margin-bottom: 5px;
    margin-bottom: 5px;
    color: white;
    min-width: 20px;
    padding: 5px 10px;
    background: #1572E5;
    text-align: right;
    border-radius: 25px;
}
.messageFromFriend {
    margin-bottom: 5px;
    /* color: white; */
    min-width: 20px;
    padding: 5px 10px;
    /* background: #1572E5; */
    text-align: left;
    border-radius: 25px;
}

.closeChatWindow {
    cursor: pointer;
}

.minimizeChatWindow {
    width: 15px;
    margin-right: 15px;
    height: 3px;
    background: black;
    border-radius: 20%;
    margin-top: 7px;
    cursor: pointer;
}
</style>

