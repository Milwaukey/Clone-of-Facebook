<script>
import {posts} from './mongoData.js'
import {mongoData} from './mongoData.js'
import ProfileImage from './ProfileImage.svelte'

export let singleComment = {};
export let PostID;

$: likes = singleComment.likes

async function likeComment(){

    let connection = await fetch("/likeComment/"+PostID+"/"+singleComment._id, {

        method : 'POST',
        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()

    $posts = response

    likes ++

}

async function unlikeComment(){

    let connection = await fetch("unlikeComment/"+PostID+"/"+singleComment._id, {

        method : 'POST',
        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()

    likes -1

    $posts = response

}

async function deleteComment(){

    let connection = await fetch("deleteComment/"+PostID+"/"+singleComment._id, {

        method : 'POST',
        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()
    console.log(response)
    $posts = response

}

</script>
    
<!-- ############################################# -->
    
<div class="singleComment">

<ProfileImage profileImage={singleComment.author.profileImage}/>

<div class="commentBox">
    <h4>{singleComment.author.firstName} {singleComment.author.lastName}</h4>
    <p>{singleComment.comment}</p>

    <!-- <div>LIKE</div> -->



    {#if singleComment.likedBy.includes($mongoData._id)}
        <div on:click={unlikeComment} class="unlikeComment">Unlike</div>
    {:else}
        <div on:click={likeComment} class="likeComment">Like</div>
    {/if}



    <div class="likeCount" style="display : {likes == 0 ? 'none' : 'flex'}">
        <img src="http://localhost:5000/images/assets/likeIcon.svg" alt="">
         {likes}
    </div>
</div>

{#if singleComment.author._id == $mongoData._id}
    <div on:click={deleteComment}><i class="far fa-trash-alt"></i></div>
{/if}

</div>
    
<!-- ############################################# -->
     
<style>
.singleComment {
    display: grid;
    grid-template-columns: 40px 30fr 1fr;
    grid-gap: 10px;

    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
}

.commentBox {
    background: #e9e9e9;
    padding: 10px;
    font-size: 14px;
    position: relative;
    border-radius: 10px;
}

.likeComment, .unlikeComment {
    bottom: -16px;
    font-size: 12px;
    cursor: pointer;
    position: absolute;
    bottom: -16px;
}

.likeCount {
    position: absolute;
    background: white;
    right: 10px;
    padding: 5px 10px 5px 5px;
    box-sizing: border-box;

    display: flex;
    justify-content: center;
    align-items: center;

    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    border-radius: 16px;
}

.likeCount img{
    width: 14px;
    height: 14px;
    object-fit: cover;
    margin-right: 5px;
}

i {
    position: absolute;
    right: 3px;
    bottom: 0;
    color: #d5d5d5;
    cursor: pointer;
}

</style>