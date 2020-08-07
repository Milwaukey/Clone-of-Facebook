<script>

export let status = 0;

</script>


<!-- ########################################## -->

<div class="activeSign" style="display: {status == 1 ? 'block' : 'none' }"></div>

<!-- ########################################## -->


<style>


.activeSign {
	position: absolute;
    width: 15px;
    height: 15px;
    background: green;
	bottom: -2px;
    right: -2px;
    border-radius: 50%;
    border: 2px solid #F1F2F5;
}



</style>