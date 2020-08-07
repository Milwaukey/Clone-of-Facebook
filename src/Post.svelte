<script>
import {posts} from './mongoData.js'
import {mongoData} from './mongoData.js'

import ProfileImage from './ProfileImage.svelte'
import Comment from './Comment.svelte'


export let post = {};

let word;
let postID;
let postComment;
let showDeleteNav = 'none';
let hideShowAllComments = 'none';
let hideShowCommentsBtn = 'block';
let newCommenAddet = []
let inputAddComment;

async function unLike(singlePostID){
    word = 'unlike';
    postID = singlePostID;

    console.log(postID)
    
    // /likeUnlike/:word/:postID
    let connection = await fetch('likeUnlike/'+word+'/'+postID, {

        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()

    $posts = response

}


async function like(singlePostID){
    word = 'like';
    postID = singlePostID;
    
    // /likeUnlike/:word/:postID
    let connection = await fetch('likeUnlike/'+word+'/'+postID, {

        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()

    $posts = response
}

async function deletePost(singlePostID){
    postID = singlePostID

    // posts/:postid
    let connection = await fetch("posts/"+postID, {

        method : 'DELETE',
        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()

    $posts = response


}


function showDelete(){
    showDeleteNav = 'block';
}

function hideDelete(){
    showDeleteNav = 'none';
}


function showAllComments(){
hideShowCommentsBtn = 'none';
hideShowAllComments = 'grid';

}



async function addComment(singlePostID){
    newCommenAddet = [];
    postID = singlePostID;

    let frmAddNewComment = new FormData()
    frmAddNewComment.append('postComment', postComment)

    // console.log(postID)
    
    let connection = await fetch('/postComment/'+postID, {

        method : 'POST',
        body : frmAddNewComment,
        headers : {
            "Authentication": localStorage.jwt
        }

    })

    let response = await connection.json()
    
    let found = $posts.find(element => element._id == postID);

    found.comments.push(response)
    newCommenAddet.push(response)
    postComment = '';
    
}


function focusInputField(){
    inputAddComment.focus()
}



</script>
    
<!-- ############################################# -->
    
<div class="eachIndividualPost" on:mouseleave={hideDelete}>

{#if post.author.author_id == $mongoData._id}
    <div class="deletePost" on:mouseover="{showDelete}"><i class="fas fa-ellipsis-h"></i></div>

    <div class="deletePostNav" style="display: {showDeleteNav}">
        <div on:mouseover="{showDelete}" on:click={deletePost(post._id)} ><i class="far fa-trash-alt"></i> Delete post</div>
    </div>
{/if}

                <div class="individualPostHeader">
                    <ProfileImage profileImage="{post.author.profileImage}"/>
                    <div class="personInfo">
                        <h5>{post.author.firstName} {post.author.lastName}</h5>
                        <!-- <p>{post.created_at} Hours ago</p> -->
                    </div>
                </div>
                <div class="individualPostBody">

                {post.body}<br/>
                <br/>
                

                {#if post.image || ''}
                    <img src="http://localhost:5000/images/posts/{post.image}" alt="{post.message}">
                {/if}

                </div>
                <div class="individualPostReaction">
                <!-- <div class="likesCount"><img class="likeIcon" src="images/assets/likeIcon.svg" alt="likeicon">{post.likes}</div> -->
                    <div class="likesCount"> 
                        <img class="likeIcon" src="http://localhost:5000/images/assets/likeIcon.svg" alt="likeicon">
                        {post.likes}
                        </div>

                    <div class="commentsCount">{post.comments.length} Comments</div>
                </div>
                <hr>
                <div class="individualPostReaction">
                    	<!-- {#if post.liked == 1} -->
                    	{#if post.likedBy.includes($mongoData._id)}
                            <div on:click={unLike(post._id)} class="interactiveButtons active"><i class="fas fa-thumbs-up"></i> <p class="newPostText">Like</p></div>
                            
                        {:else}
                            <div on:click={like(post._id)} class="interactiveButtons"><i class="far fa-thumbs-up"></i> <p class="newPostText">Like</p></div>
                        {/if}
                            <div class="interactiveButtons" on:click={focusInputField}><i class="far fa-comment"></i> <p class="newPostText">Comment</p></div>
                </div>
                <hr>
                <div class="individualPostComments">
                
                {#if post.comments.length > 0}
                    <p on:click={showAllComments} style="display: {hideShowCommentsBtn}" class="viewComments">View Comments</p>
                    <div class="AllComments" style="display: {hideShowAllComments}">

                    {#each post.comments as comment}
                        <Comment singleComment={comment} PostID={post._id} />
                    {/each}


                    </div>
                {/if}
                

                {#if newCommenAddet.length != 0}
                <div class="AllComments">
                    {#each newCommenAddet as newComment}
                        <Comment singleComment={newComment} PostID={post._id} />
                    {/each}
                </div>
                {/if }
                
                
                <form class="frmAddComment" on:submit|preventDefault={addComment(post._id)}>
                    <img src="http://localhost:5000/images/userImages/{$mongoData.profileImage}" alt="">
                    <input bind:this={inputAddComment} class="inputAddComment" bind:value={postComment} name="postComment" type="text" placeholder="Write a comment ...">
                </form>
                
                </div>
            
</div>
    
<!-- ############################################# -->
    
<style>

.active {
    color: #1572E5!important;
}

.eachIndividualPost  hr {
    margin-bottom: 8px
}

.eachIndividualPost {
    position: relative;
    padding: 15px;
    background: white;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    border-radius: 8px;
}


.eachIndividualPost  .individualPostHeader {
        display: grid;
    grid-template-columns: 60px 1fr;
}

.eachIndividualPost .individualPostHeader .personInfo {
    display: flex;
    align-items: center;
}

.eachIndividualPost  .individualPostHeader .personInfo p {
    font-size: 13px;
}

.eachIndividualPost .individualPostBody {
    margin: 15px;
}

.eachIndividualPost .individualPostBody img {
    width: 100%;
}

.eachIndividualPost .individualPostReaction {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 15px;
    color: #7b7b7b
}

div.commentsCount{
    text-align: right;
    margin-right: 10px;
}

div.likesCount {
    text-align: left;
    display: flex;
    margin-left: 10px;
}

div.likesCount .likeIcon {
    width: 17px;
    margin-right: 5px;
    cursor: pointer;
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

div .interactiveButtons:hover {
    background: #e9e9e9;
}

.deletePost {
    width: 20px;
    position: absolute;
    right: 30px;
    cursor: pointer;
}

.deletePostNav {
    cursor: pointer;
    font-size: 15px;
    height: 55px;
    width: 250px;
    background: white;
    padding: 10px;
    position: absolute;
    right: 20px;
    top: 40px;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
}

.deletePostNav div {
    padding: 10px;
}

.deletePostNav div:hover{
    background: #f9f9f9;
    border-radius: 5px;

}






.viewComments {
    font-size: 12px;
    color: #9f9f9f;
    cursor: pointer;
}

.AllComments {
    display: grid;
    grid-gap: 10px;
    margin-top: 10px;
}

.frmAddComment {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.frmAddComment img {
    width: 35px;
    height: 35px;
    object-fit: cover;
    border-radius: 50%;
}

.frmAddComment input {
    border-radius: 30px;
    background: #e9e9e9;
    height: 35px;
    padding: 10px 10px 10px 15px;
    color: rgb(160, 160, 160);
    /* cursor: pointer; */
    margin-left: 5px;
    font-size: 13px;
}

.frmAddComment input:focus {
    color: black;
}



</style>