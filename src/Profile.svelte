<script>
    import {onMount} from 'svelte'

    import {jData} from './functionality.js'
    import {mongoData} from './mongoData.js'


    $: friendsCount = $mongoData.friends.length;
    $: firstName = $mongoData.firstName
    $: lastName = $mongoData.lastName

    let editProfile = 'none';

    function openEditProfile(){

        editProfile = 'flex';

    }

    function closeEditProfile(){

        editProfile = 'none';
    }


    async function updateProfileInfo(){

        let frmEditProfile = new FormData()
        frmEditProfile.append('firstName', firstName)
        frmEditProfile.append('lastName', lastName)

        let connection = await fetch('/users/'+$mongoData._id, {

            method : 'POST',
            body : frmEditProfile,
            headers : {
				"Authentication": localStorage.jwt
            }

        })
        let response = await connection.json()

        // console.log(response.userObject)
        // console.log(response.token)
        
        // localStorage.removeItem("jwt");
        localStorage.jwt = response.token
        
        $mongoData = response.userObject;

        // UPDATE MONGODATA WITH NEW PROFILE INFORMATION 

        closeEditProfile()

    }
    


</script>


<section style="display: {$jData.pageShown == 'profile' ? 'block': 'none'}">

<div class="profileSectionOne">
    <div class="profileHeader">
        <div class="coverPhoto"></div>
        <div class="profileImageBig">
            <!-- <img src="images/userImages/{$mongoData.profileImage}" alt="profile"> -->
            <img src="http://localhost:5000/images/userImages/{$mongoData.profileImage}" alt="profile">
        </div>
        <h1 class="profileName">{$mongoData.firstName} {$mongoData.lastName}</h1>
        <hr>
        <div class="profileMenu">
            <div class="{$jData.pageShown == 'profile' ? 'active' : '' }">Timeline</div>
            <div >About</div>
            <div >Friends <span>{friendsCount}</span></div>
            <div >Photos</div>
            <div >Videos</div>
            <div on:click={openEditProfile} ><i class="fas fa-pen"></i> Edit Profile</div>
        </div>
    </div>

</div>


    <div class="editProfileContainer" style="display: {editProfile};">
        <form id="frmEditProfile" on:submit|preventDefault="{updateProfileInfo}">

            <div class="newProfileHeader">
                <h3>Create Post</h3>
                <div class="closeBtn" on:click={closeEditProfile}><i class="fas fa-times"></i></div>
            </div>
            <hr>

            <div class="newProfileMiddle">

            <img src="http://localhost:5000/images/userImages/{$mongoData.profileImage}" alt="">

            <div>
                <h4>First name:</h4>
                <input name="firstName" type="text" value="{firstName}" on:input={e => firstName = e.target.value}>
            </div>

            <div>
                <h4>Last name:</h4>
                <input name="lastName" type="text" value="{lastName}" on:input={e => lastName = e.target.value}>
            </div>

            <div>
                <h4>Email:</h4>
                <input name="email" type="text" value="{$mongoData.email}" disabled>
            </div>

                <label class="profileImage" for="profileImage">Upload New Profile</label>
                <input id="profileImage" style="display:none;" name="profileImage" type="file">
            </div>

            <div class="newProfileBottom">
                <button>SEND</button>
            </div>
        </form>

    </div>
    <div id="openTransparentBackground" style="display: {editProfile}" on:click={closeEditProfile}></div>


</section>


<style>

section {
        padding-top: 65px;
}

.profileSectionOne {
    width: 100%;
    background: white;
    height: 480px;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
}

.profileHeader {
    max-width: 1000px;
    margin: 0 auto;
}

.coverPhoto {
    height: 300px;
    background: grey;
}

.profileImageBig {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: -155px;
    background: black;
    border: 5px solid white;
}

.profileImageBig img {
    object-fit: cover;
    height: 100%;
    border-radius: 50%;
    width: 100%;
}

.profileName {
    text-align: center;
    margin-top: 15px;
    margin-bottom: 25px;
}

.profileMenu {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    justify-content: center;
    align-items: center;
    text-align: center;
    /* padding: 15px; */
    grid-gap: 15px;
            height: 64px;
}

.profileMenu div:last-child {
    display: grid;
    grid-template-columns: 1fr 4fr;
    background: #e9e9e9;
    padding: 10px 15px;
    border-radius: 10px;
    font-weight: 700;
        height: 50px;
}

.profileMenu div {
    border-bottom: 3px solid transparent;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #616266;
    cursor: pointer;
    font-weight: 700;
}

.profileMenu div span {
    margin-left: 5px;
    font-weight: 100;
    font-size: 15px;
}

.profileMenu div:hover {
    height: 50px;
    border-radius: 10px;
    background: #e9e9e9;
}


.profileMenu div.active {
    color: #0C90F3;
    border-bottom: 3px solid #0C90F3;
    pointer-events: none;
}

#openTransparentBackground {
    width: 100vw;
    height: 100vh;
    background: #ffffff96;
    top: 0;
    z-index: 12;
    left: 0;
    position: fixed;
}

/* .editProfileContainer {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background: #ffffffba;
    top: 0;
    z-index: 12;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
} */


input {
        background: transparent;
        padding: 0px 0rem; 
        border-bottom: 1px solid #c7c7c7;
        border-radius: 0px;
}

input:focus {
    border-bottom: 3px solid #0C90F3;
}

.editProfileContainer form {
    margin: 35px;
    max-width: 500px;
    min-height: 500px;
    background: white;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    border-radius: 10px;

    top: 0;
    z-index: 13;
    position: fixed;
    margin-top: 180px;
    left: 50%;
    transform: translateX(-50%);
}

.editProfileContainer .newProfileHeader {
        padding: 25px 25px 10px 25px;
    display: grid;
    grid-template-columns: 20fr 2fr;
    text-align: center;
    align-items: center;
}

.editProfileContainer .newProfileMiddle {
    padding: 15px;
    display: grid;  
    grid-gap: 25px;
}

.editProfileContainer .newProfileMiddle img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin: 0 auto;
}

.editProfileContainer .newProfileMiddle .profileImage {
    border: 1px solid #c7c7c7;
    padding: 10px;
    font-size: 12px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
}

.editProfileContainer .newProfileBottom {
        margin: 15px;
}


.editProfileContainer form button {
    margin-top: 10px;
    width: 100%;
    height: 40px;
    border: none;
    color: #f9f9f9;
    background: #1B76F2;
    border-radius: 5px;
    cursor: pointer;
}

.editProfileContainer .closeBtn {
    cursor: pointer;
    width: 30px;
    height: 30px;
    background: #F1F2F5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>