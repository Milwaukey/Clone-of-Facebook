<script>
    import ProfileImage from './ProfileImage.svelte';
    import {jData} from './functionality.js'

</script>


<!-- ########################################## -->

<section id="postsContainer" style="display: {$jData.pageShown == 'videos' ? 'block': 'none'}">
    
    <div class="postsWrapper">
            <div class="eachIndividualPost">
                <div class="individualPostHeader">
                    <ProfileImage profileImage="Riotgames.png"/>
                    <div class="personInfo">
                        <h5>RIOT GAMES</h5>
                        <p>4 Hours ago</p>
                    </div>
                </div>
                <div class="individualPostBody">

                    <!-- <iframe title="" width="100%" height="300px" src="https://www.youtube.com/embed/sVZpHFXcFJw?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->

                </div>

                <div class="individualPostReaction">
                <div class="likesCount"><i class="far fa-thumbs-up"></i>89 Likes</div>
                <div class="commentsCount">100 Comments</div>
                </div>
                <hr>
                <div class="individualPostReaction">
                        <div class="interactiveButtons"><i class="far fa-thumbs-up"></i> <p class="newPostText">Like</p></div>
                        <div class="interactiveButtons"><i class="far fa-comment"></i> <p class="newPostText">Comment</p></div>
                </div>
                <hr>
                <div class="individualPostComments"></div>
            </div>








            <div class="eachIndividualPost">
                <div class="individualPostHeader">
                    <ProfileImage profileImage="chrisBrown.jpg"/>
                    <div class="personInfo">
                        <h5>Chris Brown</h5>
                        <p>1 Hour ago</p>
                    </div>
                </div>
                <div class="individualPostBody">

                    <!-- <iframe title="" width="100%" height="300px" src="https://www.youtube.com/embed/j3CaHeakZF4?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
                </div>

                <div class="individualPostReaction">
                <div class="likesCount"><i class="far fa-thumbs-up"></i>900+ Likes</div>
                <div class="commentsCount">931 Comments</div>
                </div>
                <hr>
                <div class="individualPostReaction">
                        <div class="interactiveButtons"><i class="far fa-thumbs-up"></i> <p class="newPostText">Like</p></div>
                        <div class="interactiveButtons"><i class="far fa-comment"></i> <p class="newPostText">Comment</p></div>
                </div>
                <hr>
                <div class="individualPostComments"></div>
            </div>








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


.eachIndividualPost  hr {
    margin-bottom: 8px
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

div .interactiveButtons:hover {
    background: #e9e9e9;
}


/******** EACH INDIVIAL POST ************** */

.eachIndividualPost {
    padding: 15px;
    background: white;
    box-shadow: 0 1px 7px rgba(155, 155, 155, 0.12), 0 1px 2px rgba(155, 155, 155, 0.12);
    border-radius: 8px;
}

.eachIndividualPost  .individualPostHeader {
        display: grid;
    grid-template-columns: 60px 1fr;
}

.eachIndividualPost  .individualPostHeader .personInfo p {
    font-size: 13px;
}

.eachIndividualPost .individualPostBody {
    margin: 15px;
}

.eachIndividualPost .individualPostReaction {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 15px;
}

div.commentsCount{
    text-align: right;
    margin-right: 10px;
}

div.likesCount .fa-thumbs-up {color:#1572E5}

div.likesCount {
    text-align: left;
    margin-left: 10px;
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