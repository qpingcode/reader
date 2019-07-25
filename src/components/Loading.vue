<template>
    <div class="loading-container">
        <svg class="loading" width="8rem" height="8rem" viewBox="0 0 44 44">
            <circle class="path" cx="22" cy="22" r="20" fill="none" stroke-width="4"></circle>
        </svg>
    </div>
</template>

<script>
    export default {
        name: 'Loading',
        props: ['show'],
    };
</script>

<style lang="scss">
    .loading-container{

        .color-dark & .loading .path{
            stroke:#888;
        }
        width: 100vw;
        height: 100vh;
        .loading {
            -webkit-animation: rotate 2s linear infinite;
            animation: rotate 2s linear infinite;
            z-index: 99999;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
            width: 50px;
            height: 50px;

            .path {
                stroke: #333;
                stroke-linecap: round;
                -webkit-animation: dash 1.5s ease-in-out infinite;
                animation: dash 1.5s ease-in-out infinite;
            }

            @keyframes rotate{
                100% {
                    -webkit-transform: rotate(360deg);
                    transform: rotate(360deg);
                }
            }

            @keyframes dash {
                0% {
                    stroke-dasharray: 1, 150;
                    stroke-dashoffset: 0;
                }
                50% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -35;
                }
                100% {
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -124;
                }
            }
        }
    }
</style>
