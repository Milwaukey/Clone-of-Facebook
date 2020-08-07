<script>
     import Active from './Active.svelte';

     export let profileImage = 'defaultProfileImage.jpg'
     export let status = 0
</script>

 
<!-- ########################################## -->


<div class="profileImage">
    <Active status={status}/>
    <!-- <img src="images/userImages/{profileImage}" alt="profile"> -->
    <img src="http://localhost:5000/images/userImages/{profileImage}" alt="profile">
 </div>


<!-- ########################################## -->


<style>

.profileImage {
    width: 35px;
    height: 35px;
    background: black;
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
}

.profileImage img {
    object-fit: cover;
    width: 35px;
    height: 35px;
    border-radius: 50%;
}

</style> 