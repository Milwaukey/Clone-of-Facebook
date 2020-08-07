<script>
    import {jData} from './functionality.js'
    import ProfileImage from './ProfileImage.svelte'
    import {mongoData} from './mongoData.js'
    import {posts} from './mongoData.js'
    import Post from './Post.svelte'

    let newPostContainerShow = 'none';
    let postMessage;
    let image;


    function createNewPost(){

        newPostContainerShow = 'flex';

    }

    function closeCreateNewPost(){

        newPostContainerShow = 'none';
        document.querySelector('.newPostContainer form').reset()
    }


    async function addNewPost(event){
        
        let frmAddNewPost = new FormData()
        frmAddNewPost.append('postMessage', postMessage)
        frmAddNewPost.append('image', image.files[0])
  
        // FETCH
        let connection = await fetch('posts', {

            method : 'POST',
            body : frmAddNewPost,
            headers : {
                "Authentication": localStorage.jwt
            }

        })

        let response = await connection.json()

        // RECIEVE POSTS & ADD TO POSTS STORE
        $posts = response
        
        closeCreateNewPost()
    }

</script>


<!-- ########################################## -->

<section id="postsContainer" style="display: {$jData.pageShown == 'posts' ? 'block': 'none'}">
    
    
    <!-- NEW POST -->
    <div class="createNewPost">
         <!-- <img class="profileImage" src="images/userImages/{$mongoData.profileImage}" alt="profile"> -->
         <img class="profileImage" src="http://localhost:5000/images/userImages/{$mongoData.profileImage}" alt="profile">
         <!-- <input type="text" class="writePost" placeholder="What is on your mind, {$mongoData.firstName}?"> -->
         <div type="text" class="writePost" on:click={createNewPost}>What is on your mind, {$mongoData.firstName}?</div>
        <hr>
        <div class="createNewPostElements">
            <div class="interactiveButtons"><i class="far fa-images"></i> <p class="newPostText">Photo/Video</p></div>
            <div class="interactiveButtons"><i class="fas fa-user-tag"></i> <p class="newPostText">Tag Friends</p></div>
            <div class="interactiveButtons"><i class="fas fa-smile"></i> <p class="newPostText">Feeling / Activity</p></div>
        </div>
    </div>



    <div class="newPostContainer" style="display: {newPostContainerShow};">
        <form on:submit|preventDefault="{addNewPost}">
            <div class="newPostHeader">
                <h3>Create Post</h3>
                <div class="closeBtn" on:click={closeCreateNewPost}><i class="fas fa-times"></i></div>
            </div>
            <hr>
            <div class="newPostMiddle">
                <ProfileImage profileImage={$mongoData.profileImage} />

                <div>
                    <h5>{$mongoData.firstName} {$mongoData.lastName}</h5>
                    <div class="friendsIcon"><i class="fas fa-user-friends"></i> Friends</div>
                </div>
            </div>
            <div class="newPostBody">
                <textarea name="postMessage" type="text" bind:value="{postMessage}" placeholder="Message..."></textarea>
            </div>

            <div class="newPostBottom">
                <div class="uploadStuff"> 
                    <input style="display:none;" id="uploadImage" type="file" name="image" bind:this={image}>
                    <label for="uploadImage">Add image to post</label>
                    <i class="far fa-images"></i>
                </div>
                <button>SEND</button>
            </div>
        </form>
    </div>
    <div id="openTransparentBackground" style="display: {newPostContainerShow}" on:click={closeCreateNewPost}></div>


    <div class="postsWrapper">
        <!-- FRIENDS POSTS  -->

        {#each $posts.reverse() as post}

            <Post post={post}/>

        {/each}


    </div>



</section>

<!-- ########################################## -->


<style>


#postsContainer {
    position: fixed;
    z-index: -1;
    top: 4rem;
    width: 100%;
    height: calc(100% - 4rem);
    overflow-y: scroll;
    padding: 25px;
}

div.postsWrapper {
    display: grid;
    grid-gap: 25px;
    max-width: 40rem;
    /* height: 100%; */
    margin: 0 auto;
    margin-top: 35px;
}

div.createNewPost {
    margin: 0 auto;
    max-width: 40rem;
    display: grid;
    grid-template-columns: 35px 1fr;
    grid-gap: 10px;
    padding: 15px;
    justify-content: center;
    align-items: center;
    background: white;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    border-radius: 8px;
}

.profileImage {
    object-fit: cover;
    width: 35px;
    height: 35px;
    border-radius: 50%;
}

div.createNewPost .writePost {
    border-radius: 30px;
    background: #e9e9e9;
        height: 35px;
    padding: 10px 10px 10px 15px;
    color: rgb(160, 160, 160);
    cursor: pointer;
}

div.createNewPost .writePost::placeholder {
    color: #9b9b9b;
}


div.createNewPost .createNewPostElements {
    grid-column: 1/3;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
}

div .interactiveButtons {
    text-align: center;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    color: #9b9b9b;
    display: flex;
    justify-content: center;
}

.newPostText {
    display: none;
}

div.createNewPost .createNewPostElements div .fa-images {color:#43B45C}
div.createNewPost .createNewPostElements div .fa-user-tag {color:#1572E5}
div.createNewPost .createNewPostElements div .fa-smile {color:#EBB025}

div .interactiveButtons:hover {
    background: #e9e9e9;
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

.newPostContainer form {
    margin: 35px;
    max-width: 500px;
    height: 500px;
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

.newPostContainer .newPostHeader {
        padding: 25px 25px 10px 25px;
    display: grid;
    grid-template-columns: 20fr 2fr;
    text-align: center;
    align-items: center;
}

.newPostContainer .newPostMiddle {
    display: grid;
    grid-template-columns: 2fr 10fr;
    align-items: center;
    padding: 10px;
    margin: 10px 0 10px 0;
}

.newPostContainer .newPostMiddle .friendsIcon {
    background: #ededed;
    width: 94px;
    display: grid;
    grid-template-columns: 2fr 5fr;
    padding: 7px;
    font-size: 11px;
    align-items: center;
    border-radius: 3px;
    grid-gap: 5px;
}

.newPostContainer .newPostMiddle .friendsIcon i {
    margin: 0 auto;
}

.newPostContainer .newPostBody {
    padding: 0 20px;
}

.newPostContainer .newPostBody textarea {
    resize: none;
    outline: none;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    border: none;
    height: 210px;
    font-size: 18px;
    font-weight: 100;
}

.newPostContainer .newPostBottom {
        margin: 15px;
}

.newPostContainer .newPostBottom .uploadStuff {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #c7c7c7;
    display: grid;
    grid-template-columns: 5fr 1fr;
    align-items: center;
    font-size: 12px;
    font-weight: 800;
    padding-left: 20px;
    cursor: pointer;
}

.newPostContainer .newPostBottom .uploadStuff i{ 
    margin: 0 auto;
    color: #41B35C;
    font-size: 22px;
}


.newPostContainer form button {
    margin-top: 10px;
    width: 100%;
    height: 40px;
    border: none;
    color: #f9f9f9;
    background: #1B76F2;
    border-radius: 5px;
    cursor: pointer;
}

.newPostContainer .closeBtn {
    cursor: pointer;
    width: 30px;
    height: 30px;
    background: #F1F2F5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: grey;
}


/* ############################################################################################################################################## */
/* ############################################## MEDIA QUERIES ################################################################################# */

    @media only screen and (min-width: 580px) {

        .newPostText {
            display: block;
            margin-left: 5px;
        }

    }

    @media only screen and (min-width: 1024px) {
       
        #postsContainer {
            width: calc(100% - 420px);
            height: calc(100% - 4rem);
        }


    }


</style>