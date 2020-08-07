<script>

import {jData} from './functionality.js'
import {mongoData} from './mongoData.js'
import {posts} from './mongoData.js'
import PostsContainer from './PostsContainer.svelte'
import Nav from './Nav.svelte'
import Contacts from './Contacts.svelte'
import ChatContainer from './ChatContainer.svelte'
import VideoContainer from './VideoContainer.svelte'
import Profile from './Profile.svelte'

let OldPosts;
let newPostsStyle = 'none';
let countPostReload = 0;

async function getData(){

	// check if the jwt token exsist in localstorage
	if(!localStorage.jwt){
		window.location.href = "http://localhost/login"
	}

	// Fecth data by parsing the jwt-token
	let connection = await fetch("getData", {

			headers : {
				"Content-Type":  "application/json",
				"Authentication": localStorage.jwt
			}

        })
	let data = await connection.json()

	// Show facebook page with right information - if correct token.
	if(data.error){
		console.log('Could not verify data')
		window.location.href = "http://localhost/login"
	}

	// Set data to be == to mongoData STORE
	$mongoData = data[0]

}

async function getPosts(){
	
	// check if the jwt token exsist in localstorage
	if(!localStorage.jwt){
		window.location.href = "http://localhost/login"
	}

	// Fecth data by parsing the jwt-token
	let connection = await fetch("getPosts", {

			headers : {
				"Content-Type":  "application/json",
				"Authentication": localStorage.jwt
			}

        })
	let data = await connection.json()

	// Show facebook page with right information - if correct token.
	if(data.error){
		console.log('Could not verify data')
		window.location.href = "http://localhost/login"
	}



	if(countPostReload == 0 ){

		$posts = data
		OldPosts = data
		
		countPostReload ++
		console.log(countPostReload)

	}else{

		if( OldPosts.length < data.length ){

			newPostsStyle = 'block'
			OldPosts = data

		}


	}


}


function showNewPosts(){

	newPostsStyle = 'none';
	document.querySelector('#postsContainer').scrollTo(0, 0);
	$posts = OldPosts;

}

getPosts();
getData();


setInterval(function(){
	getPosts();
	getData();
},10000)



</script>
 

<!-- ########################################## -->

<main>
    <Nav />

    <PostsContainer/>
	<VideoContainer/>
	<Profile/>

	{#if $jData.pageShown != 'profile'}
		<Contacts/>
	{/if}

	<ChatContainer />


	<div id="newPostNotification" class="newPosts" on:click={showNewPosts} style="display: {newPostsStyle}"><i class="fas fa-bullhorn"></i> You got new posts!</div>

</main>

<!-- ########################################## -->


<style>
.newPosts {
	position: absolute;
    bottom: 0;
    right: 50%;
    padding: 10px;
    background: #1572E5;
    cursor: pointer;
    color: white;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 2px;
}
</style>

