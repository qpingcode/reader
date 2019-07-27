<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'home',
        components: {
        }
    }
</script>


<style lang="scss">
    @import "assets/css/common.scss";
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
