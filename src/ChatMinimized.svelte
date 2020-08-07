<script>
    import {aChats} from './chatData.js'
    import {aMinimizedChats} from './chatData.js'
    import Active from './Active.svelte';




    export let userObjectMinimizedChat;

    console.log(userObjectMinimizedChat)

    let closeMiniChatStyle = 'none'

    function openChat(userObj){

        // IF THER IS CHAT WINDOWS MINIMZED - CHECK IF THE ONE YOU CLICKED IS IN THE MINIMIZE ARRAY 
		if($aMinimizedChats.some(user => user._id === userObj._id)){
				
			// console.log('Clicked user is in the MINIMIZE ARRAY array')
			$aChats = [ ... $aChats, userObj]

			let result = $aMinimizedChats.filter(user => user._id !== userObj._id)
			$aMinimizedChats = result

		}else{
            console.log('open chat, else part')
        }

    }

    function closeChat(userObj){

        // IF THER IS CHAT WINDOWS MINIMZED - CHECK IF THE ONE YOU CLICKED IS IN THE MINIMIZE ARRAY 
		if($aMinimizedChats.some(user => user._id === userObj._id)){
				
			let result = $aMinimizedChats.filter(user => user._id !== userObj._id)
			$aMinimizedChats = result

		}else{
            console.log('open chat, else part')
        }

    }

    function onMouseoverMinimizedChat(){
        closeMiniChatStyle = 'flex';
    }
    function onMouseleaveMinimizedChat(){
        closeMiniChatStyle = 'none';
        
    }

</script>
    
<!-- ############################################# -->
    
<div on:mouseover={onMouseoverMinimizedChat} on:mouseleave={onMouseleaveMinimizedChat} class="addNewChat"> 
    <div on:click={closeChat(userObjectMinimizedChat)} class="closeMinimizedChat" style="display: {closeMiniChatStyle}"><i class="fas fa-times"></i></div>
    <Active status={userObjectMinimizedChat.status}/>
    <img on:click={openChat(userObjectMinimizedChat)} src="http://localhost:5000/images/userImages/{userObjectMinimizedChat.profileImage}" alt="">
</div>
    
<!-- ############################################# -->
    
<style>

.addNewChat {
    position: relative;
}


 .addNewChat {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    cursor: pointer;
}

.addNewChat img {
    object-fit: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}


.addNewChat .closeMinimizedChat {
    width: 18px;
    height: 18px;
    background: #f9f9f9;
    position: absolute;
    border-radius: 50%;
    top: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    color: #c2c0c0;
}

.addNewChat .closeMinimizedChat {
    font-size: 11px;
}



</style>