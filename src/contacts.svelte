<script >

import ProfileImage from './ProfileImage.svelte'
import {mongoData} from './mongoData.js'
import {aChats} from './chatData.js'
import {aMinimizedChats} from './chatData.js'

function showChatWindow(jContact){

	// let friendInChat = {"id": friendID, "firstName": friendFirstName,"lastName": friendLastName, "status": friendStatus,"profileImage": friendProfileImage};
	
	if( $aMinimizedChats.length == 0 ){
		
		if( $aChats.length == 0 ){

			let result = $aChats.filter(user => user._id !== jContact._id)
			$aChats = result
			$aChats = [ ... $aChats, jContact]
	
		}else{
			
			// CHECK IF THE ID IS ALREADY IN THEY ARRAY
			if($aChats.some(user => user._id !== jContact._id)){
				
				console.log($aChats.length)
				let result = $aChats.filter(user => user._id !== jContact._id)
				$aChats = result
				$aChats = [ ... $aChats, jContact]
	
			}
	
		}
		
	}
	else{

		// IF THER IS CHAT WINDOWS MINIMZED - CHECK IF THE ONE YOU CLICKED IS IN THE MINIMIZE ARRAY 
		if($aMinimizedChats.some(user => user._id === jContact._id)){
				
			// console.log('Clicked user is in the MINIMIZE ARRAY array')
			$aChats = [ ... $aChats, jContact]

			let result = $aMinimizedChats.filter(user => user._id !== jContact._id)
			$aMinimizedChats = result

		}else{

			// // IF NOT IN MINIMAZED - OPEN CHAT 
			$aChats = [ ... $aChats, jContact]
				
		}

	}
	
}

function toggleSittings() {
	
	if( contactSittings == "none" ){
		contactSittings = "block";
    }else if(contactSittings = "block"){
		contactSittings = "none"
    }
}
	
	
</script>

 
<!-- ########################################## -->


<div id="contactsContainer">

	<div class="contactsHeader">
		<h3>Contacts</h3>
		<div><i class="fas fa-search"></i></div>
		<div on:click="{toggleSittings}"><i class="fas fa-ellipsis-h"></i></div>
	</div>


	<div class="eachContactContainer">
		{#each $mongoData.friends as contact}
			<div class="eachContact" on:click="{showChatWindow(contact)}"> 
				<ProfileImage profileImage={contact.profileImage} status={contact.status}/>
				<div>{contact.firstName} {contact.lastName}</div>
			</div>
		{/each}
	</div>



</div>


<!-- ########################################## -->


<style>

div#contactsContainer {
	display: none;
	width: 420px;
	top: 4rem;
	position: fixed;
	z-index: -2;
    right: 0;
	height: calc(100% - 4rem );
	padding: 15px;
	overflow-y: scroll;
}

div#contactsContainer .contactsHeader {
	    display: grid;
	grid-template-columns: 5fr 1fr 1fr;
	margin-bottom: 25px;
	color: #777777;
}

div#contactsContainer .contactsHeader div {
	cursor: pointer;
	display: flex;
    justify-content: center;
    align-items: center;
}

div#contactsContainer .eachContactContainer {
	display: grid;
	grid-gap: 10px;
}

div.eachContact {
	padding: 5px;
	display: grid;
	grid-template-columns: 1fr 10fr;
	grid-gap: 15px;
	align-items: center;
	cursor: pointer;
}

div .eachContact:hover {
	background: #e9e9e9;
    border-radius: 5px;
}




/* ############################################################################################################################################## */
/* ############################################## MEDIA QUERIES ################################################################################# */

    @media only screen and (min-width: 1024px) {

		div#contactsContainer {
			display: block;
			width: 420px;
		}
	}



</style>