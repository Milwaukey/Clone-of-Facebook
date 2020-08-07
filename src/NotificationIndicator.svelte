<script>

    import {aMinimizedChats} from './chatData.js'

    export let count
</script>

 
<!-- ########################################## -->

<div class="notificationSign" style="display : {count == 0 ? 'none' : 'flex'}" >{count}</div>

<!-- ########################################## -->


<style>


.notificationSign {
	position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    font-size: 10px;
	top: 0;
    right: -4px;
    border-radius: 50%;
    border: 2px solid #F1F2F5;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}



</style>