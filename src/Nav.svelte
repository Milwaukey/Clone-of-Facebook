<script>

import NotificationIndicator from './NotificationIndicator.svelte'
import {jData} from './functionality.js'
import {mongoData} from './mongoData.js'
import ProfileImage from './ProfileImage.svelte'


// // Variable is reaktive, so it will update if the data change
$: messageCount = $mongoData.unReadMessages.length
$: notificationCount = $mongoData.notifications.length
$: friendRequests = $mongoData.friendRequests.length


const showPage = nameofPageToShow => {
    $jData.pageShown = nameofPageToShow
    // window.history.pushState("object or string", "Title", "/"+ nameofPageToShow);

    boxSittings = 'none';
}




let txtSearch = "";
let ajUsers = []
let myFriends = []


let boxSearchResultsDisplay = "none";
let boxAllNotifications = "none";
let boxAllMessages = "none";
let boxSittings = "none";

function showSearchResults() {
    boxSearchResultsDisplay = "grid";
}

function hideSearchResults(){
    boxSearchResultsDisplay = "none";
}

function toggleAllNotifications() {

    if( boxAllNotifications == "none" ){
        boxAllNotifications = "block";
    }else if(boxAllNotifications = "block"){
        boxAllNotifications = "none"
    }
}

function toggleAllMessages() {

    if( boxAllMessages == "none" ){
        boxAllMessages = "block";
    }else if(boxAllMessages = "block"){
        boxAllMessages = "none"
    }
}

function toggleSittings() {

    if( boxSittings == "none" ){
        boxSittings = "block";
    }else if(boxSittings = "block"){
        boxSittings = "none"
    }
}


// Async - because it will take time to get the data
async function getUsers(){
    myFriends = []
    ajUsers = []

    for(let i = 0; $mongoData.friends.length > i; i++){  let friendId = $mongoData.friends[i]._id; myFriends.push( friendId ) }

    // AWAIT So it wont go though before it has the data - because it will take time
    let connection = await fetch("http://localhost/users?searchFor="+txtSearch, {
        headers : {
                        "Content-Type":  "application/json",
                        "Authentication": localStorage.jwt
                    }
    }); 
    let data = await connection.json()
    ajUsers = data;

    if( txtSearch == '' || ajUsers.length == 0){ hideSearchResults() }else{ showSearchResults() }
    
 }


 async function logout(){

    let connection = await fetch("http://localhost/logout", {
        headers : {
                        "Content-Type":  "application/json",
                        "Authentication": localStorage.jwt
                    }
    });

    let data = await connection.json()

    if(data.status == 1 ){
        localStorage.removeItem("jwt");
        window.location.href = "http://localhost/login"
    }

 }



 async function sendFriendRequest(jUser){

    let connection = await fetch("http://localhost/sendFriendRequest/", {

        method : 'POST',
        body : JSON.stringify(jUser),
        headers : {
                        "Content-Type":  "application/json",
                        "Authentication": localStorage.jwt
                    }
    });

    let data = await connection.text()

    console.log(data)

}

async function acceptFriend(newFriendUserId){

    let connection = await fetch("http://localhost/acceptFriend/"+newFriendUserId, {

        method : 'POST',
        headers : {
                        "Content-Type":  "application/json",
                        "Authentication": localStorage.jwt
                    }
    });

    let data = await connection.json()

    toggleAllNotifications();
     let result = $mongoData.friendRequests.filter(user => user._id !== newFriendUserId)
    $mongoData.friendRequests = result

}


async function denyFriendRequest(newFriendUserId){

let connection = await fetch("http://localhost/denyFriendRequest/"+newFriendUserId, {

        method : 'POST',
        headers : {
                        "Content-Type":  "application/json",
                        "Authentication": localStorage.jwt
                    }
    });

    let data = await connection.text()

    console.log(data)
    toggleAllNotifications();
    let result = $mongoData.friendRequests.filter(user => user._id !== newFriendUserId)
    $mongoData.friendRequests = result

}


</script>


<!-- ############################################################################################################################## -->
<!-- ############################################################################################################################## -->

<nav on:click={hideSearchResults}>
  <div class="navC1">
    <!-- <div class="logo"><img src="images/assets/logo.svg"  alt="logo"></div> -->
    <div class="logo"><img src="http://localhost:5000/images/assets/logo.svg"  alt="logo"></div>
    <div class="searchContainer">
    <form role="search" class="search-form">
		<input type="search" name="q" class="search-text" placeholder="Search..." autocomplete="off" bind:value="{txtSearch}" on:input="{getUsers}" on:focus="{getUsers}">
    </form>

    <div style="display: {boxSearchResultsDisplay}" class="searchResultsContainer">
        {#each ajUsers as jUser }
            <div class="eachResult">
                <ProfileImage profileImage="{jUser.profileImage}"/>
                <div class="eachResultWrapper">
                    {jUser.firstName} {jUser.lastName}

                    {#if !myFriends.includes(jUser._id.toString()) && $mongoData._id != jUser._id  }
                        <div class="addFriend" on:click={sendFriendRequest(jUser)}> <i class="fas fa-user-plus"></i></div>
                    {/if}

                </div>
            </div>
        {/each }
    </div>
  </div>
  </div> 
  <div class="navC2">
    <div class="{$jData.pageShown == 'posts' ? 'active' : '' }" on:click={ ()=>{ showPage('posts')}}><i class="fas fa-house-user"></i></div>
    <div class="{$jData.pageShown == 'page' ? 'active' : '' }" on:click={ ()=>{ showPage('page')}}><i class="far fa-flag"></i></div>
    <div class="{$jData.pageShown == 'videos' ? 'active' : '' }" on:click={ ()=>{ showPage('videos')}}><i class="far fa-play-circle"></i></div>
    <div><i class="fas fa-shopping-basket"></i></div>
    <div><i class="fas fa-users"></i></div>
  </div>
  <div class="navC3">
        <div class="navC3_profile {$jData.pageShown == 'profile' ? 'profileActive' : ''}" on:click={ ()=>{ showPage('profile')}}><div class="profileImage">
            <!-- <img src="/images/userImages/{$mongoData.profileImage}" alt="profile"> -->
            <img src="http://localhost:5000/images/userImages/{$mongoData.profileImage}" alt="profile">
        </div><p>{$mongoData.firstName}</p></div>

    <div class="navC3icons">
        <div><i class="fas fa-plus"></i></div>
        <div on:click="{toggleAllMessages}"><i class="fas fa-comment"></i> <NotificationIndicator count={messageCount}/> </div>
        <div on:click="{toggleAllNotifications}"><i class="fas fa-bell"></i> <NotificationIndicator count={ notificationCount == 0 ? friendRequests : notificationCount } />   </div>
        <div on:click="{toggleSittings}"><i class="fas fa-sort-down"></i></div>
    </div>


    <div class="allNotifications" style="display: {boxAllNotifications}">
        <h2>Notifications</h2>

        {#each $mongoData.friendRequests as newFriend }
            <div class="friendRequest">
            
            <div class="friendRequestBoxOne">
                <img src="http://localhost:5000/images/userImages/{newFriend.profileImage}" alt="">
            </div>

            <div class="friendRequestBoxTwo">
                 <div class="newFriendRequestInfo">New FriendRequest from:</div>
                {newFriend.firstName} {newFriend.lastName}<br/>

                <div class="friendRequestIcons">
                    <p on:click={acceptFriend(newFriend._id)}><i class="far fa-check-circle"></i></p>
                    <p on:click={denyFriendRequest(newFriend._id)}><i class="far fa-times-circle"></i></p>
                </div>
            </div>


            


            </div>
        {/each}
    </div>

    <div class="allNotifications" style="display: {boxAllMessages}">
        <h2>Messages</h2>
    </div>

    <div class="sittings" style="display: {boxSittings}">
        <div class="seeYourProfileBox" on:click={ ()=>{ showPage('profile')}}>
            <!-- <div class="viewMyProfileImage"><img src="/images/userImages/{$mongoData.profileImage}" alt="profile"></div> -->
            <div class="viewMyProfileImage"><img src="http://localhost:5000/images/userImages/{$mongoData.profileImage}" alt="profile"></div>
            <div>
                <h4>{$mongoData.firstName} {$mongoData.lastName}</h4>
                <p>See your profile</p>
            </div>
        </div>
        <hr>
        <div class="logout" on:click={logout}>
            <div class="logout_icon"><i class="fas fa-sign-out-alt"></i></div>
            Log out
        </div>
    </div>

  </div>

</nav> 


<!-- ############################################################################################################################## -->
<!-- ############################################################################################################################## -->


<style>

    nav {
        display: grid;
        grid-template-columns: 1fr 8fr 4fr;
        grid-gap: 15px;
        height: 4rem;
        width: 100%;
        color: black;
        background: white;
        padding: 0px 0.5rem;
        justify-content: center;
        align-items: center;
        position: fixed;
        z-index: 1;
        box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    }

    /* ************ COPONENT 1 - SEARCH  ************/

    nav div.navC1 {
        display: grid;
        grid-template-columns: 45px 1fr;
    }

    .navC1 .logo {
        width: 45px;
        cursor: pointer;
        height: 45px;
        margin: 0 auto;
    }

    nav div.navC1 .searchContainer {
        align-items: center;
        display: flex;
    }

    nav .navC1 form {
        margin-left: 10px;
        position: fixed;
        z-index: 2;
        max-width: 300px;
    }

    nav form i {
        position: absolute;
        top: 8px;
        left: 11px;
    }

    nav form input {
        height: 35px;
    }

    nav div.searchContainer {
        position: relative;
    }

    input.search-text {
        color: #222;
        position: relative;
        z-index: 5;
        transition: z-index 0.8s, width 0.5s, background-color 0.3s ease, border 0.3s;
        height: 45px;
        width: 0;
        margin: 0;
        padding: 5px 20px 5px 40px;
        font-size: 16px;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 30px;
        border: 1px solid transparent;
        background: url('/images/assets/search-solid.svg')
            no-repeat left 9px center transparent;
        background-size: 21px;
    }

    input.search-text:focus {
        z-index: 3;
        width: 275px;
        background-color: #e9e9e9;
        outline: none;
        cursor: auto;
        padding-right: 20px;
    }


    input.search-text::-webkit-search-cancel-button {
        cursor: pointer;
    }

    nav div.searchResultsContainer {
        position: absolute;
        /* width: 100%; */
        width: 300px;
        background: white;
        color: #333;
        border: 1px solid #999;
        border: none;
        padding: 50px 1rem 10px 1rem;
        top: 0;
        z-index: 1;

        display: grid;
        grid-gap: 10px;
        border-radius: 5px;
        max-height: 25rem;
        overflow-y: scroll;
    }

    nav div.searchResultsContainer .eachResult {
            background: transparent;
            padding: 10px;
            cursor: pointer;

            display: grid;
            grid-template-columns: 1fr 6fr;
            justify-content: center;
            align-items: center;
                grid-gap: 10px;
    }

    nav div.searchResultsContainer .eachResult .eachResultWrapper {
        display: grid;
        grid-template-columns: 7fr 1fr;
    }

    nav div.searchResultsContainer .eachResult:hover {
        background: #f2f2f2;
        border-radius: 5px;
    }

    .addFriend {
        position: relative;
        z-index: 2;
    }

    /* ************ COPONENT 2 - MIDDLE MENU  ************/

    nav div.navC2 {
        display: none;
    }

    /* ************ COPONENT 3 - PROFILE; MESSENGER ect.  ************/


    nav div.navC3 {
        grid-column: 3/4;
        display: grid;
        grid-template-columns: 1fr;

    }

    nav div.navC3_profile {
        display: none;
    }

    nav div.navC3icons {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        justify-content: flex-end;
        text-align: center;
        align-items: center;
        max-width: 200px;
        margin: 0 auto;
        grid-gap: 5px;
    }

    nav div.navC3icons div {
        position: relative;
        margin: 0 auto;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: #e9e9e9;
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .navC3 .navC3icons div:hover {
        background: #dad8d8;
    }


    .navC3 .navC3icons div:last-of-type i {
        margin-top: -7px;
    }

    .profileImage {
        width: 30px;
        height: 30px;
        background: black;
        border-radius: 50%;
        margin: 0 auto;
        overflow: hidden;
    }

    .profileImage img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }



    /********** NOTIFICATIONS *******/ 

    .allNotifications {
        display: none;
        position: absolute;
        background: #fff;
        width: 20rem;
        height: 50rem;
        top: 55px;
        right: 25px;
        padding: 20px;
        box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
        border-radius: 8px;
        overflow: hidden;
        overflow-y: scroll;
    }

    .friendRequest {
        position: relative;
        padding: 10px;
        background: #e9e9e9;
        border-radius: 5px;
        height: 100px;

        display: grid;
        grid-template-columns: 1fr 3fr;
    }

    .friendRequest p {
        letter-spacing: 1px;
        font-weight: 500;
        margin-top: 10px;
    }

    .friendRequest img {
        object-fit: cover;
        height: 60px;
        width: 60px;
        border-radius: 50%;
    }

    .friendRequest .friendRequestBoxTwo, .friendRequest .friendRequestBoxOne {
        padding: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .friendRequest .newFriendRequestInfo {
        font-size: 13px;
    }

    .friendRequest .friendRequestIcons {
        display: flex;
        flex-direction: row;
        font-size: 25px;
        position: absolute;
        right: 0;
        bottom: 5px;
    }

    .friendRequest .friendRequestIcons p {
        padding: 0;
        margin: 0;
            margin-right: 10px;
    }

    .friendRequest .friendRequestIcons p:first-of-type {
        color: #1572E5;
    }
  
    .friendRequest .friendRequestIcons p:last-of-type {
        color: #c1c1c1;
    }


    /********** SITTINGS *********/  
 
    .sittings {
        display: none;
        position: absolute;
        background: #fff;
        width: 20rem;
        /* min-height: 8rem; */
        top: 55px;
        right: 25px;
        padding: 20px;
        box-shadow: 2px 1px 7px rgba(155, 155, 155, 0.12), 1px 1px 2px rgba(155, 155, 155, 0.12);
        border-radius: 8px;
        overflow: hidden;
        overflow-y: scroll;
    }


    .seeYourProfileBox, .logout {
        display: grid;
        grid-template-columns: 1fr 6fr;
        justify-content: center;
        align-items: center;
        grid-gap: 15px;
        margin-bottom: 15px;
        padding: 8px;
    }

    .logout {
        margin-top: 15px;
    }

    .seeYourProfileBox .viewMyProfileImage {
        width: 45px;
        height: 45px;
        background: black;
        border-radius: 50%;
        margin: 0 auto;
        overflow: hidden;
    }
       .seeYourProfileBox .viewMyProfileImage img{
           object-fit: cover;
           height: 100%;
           width: 100%;
       }

    .seeYourProfileBox div h4 {
        letter-spacing: 0.5px;
    }

    .seeYourProfileBox div p {
        font-size: 14px;
    }

    .seeYourProfileBox:hover, .logout:hover {
        background: #f2f2f2;
        border-radius: 5px;
    }

    .logout_icon {
        width: 35px;
        height: 35px;
        background: #E5E6EB;
        border-radius: 50%;
        margin: 0 auto;

        display: flex;
        justify-content: center;
        align-items: center;
        color: #58616A;
    }






/* ############################################################################################################################################## */
/* ############################################## MEDIA QUERIES ################################################################################# */




    @media only screen and (min-width: 768px) {

        nav {
            grid-template-columns: 10fr 10fr 4fr;
        }

        input.search-text {
            width: 275px;
            background-color: #e9e9e9;
        }

    }




    @media only screen and (min-width: 1024px) {

    nav {
        grid-template-columns: 10fr 20fr 10fr;
        grid-gap: 0.2rem;
    }

    .navC1 {
        display: grid;
        grid-template-columns: 1fr 5fr;
        justify-content: center;
        align-items: center;
    }

    nav .navC1 form {
        position: relative;
        z-index: 2;
    }

    nav form i {
        position: absolute;
        top: 8px;
        left: 11px;
    }

    nav form input {
        height: 35px;
    }


    nav div.navC2 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        margin: 0 auto;
        grid-gap: 5px;
        cursor: pointer;
        height: 100%;
        align-items: center;
        font-size: 22px
    }

    .navC2 div {
        border-bottom: 3px solid transparent;
        height: 100%;
        display: flex;
        align-items: center;
        width: 100px;
            width: 70px;
        justify-content: center;
        color: #616266;
    }

    .navC2 div:hover {
        height: 50px;
        border-radius: 10px;
        background: #e9e9e9;
    }


    .navC2 div.active {
        color: #0C90F3;
        border-bottom: 3px solid #0C90F3;
        pointer-events: none;
    }

    nav div.navC3 {
        display: grid;
        grid-template-columns: 3fr 3fr;
        grid-gap: 15px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .navC3 .navC3_profile {
        display: grid;
        grid-template-columns: 1fr 3fr;
            grid-gap: 5px;
        padding: 5px 12px 5px 5px;
    }

    .profileActive {
        background: #e9f3fe;
        border-radius: 30px;
        padding-right: 12px;
        color: #3379ea;
        font-weight: 700;
    }

    .navC3 .navC3_profile:hover {
        background: #e9e9e9;
        border-radius: 30px;
    }

    .navC3 .navC3_profile p {
        align-self: center;
        /* padding-left: 5px; */

    }

    }


        
    @media only screen and (min-width: 1200px) {
        
        .navC2 div {
            width: 100px;
        }
    }


</style>



