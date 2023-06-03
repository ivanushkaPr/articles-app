<template>
  <div class="layout">
    <span class="layout__preloader"></span>
  </div>
</template>

<script>

</script>

<style scoped>

.layout {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout__preloader {
  width: 36px;
  height: 36px;
  border: 4px solid #ED5252;
  border-radius: 50%;
  border-top-color: transparent;
  animation-duration: 100s;
  animation-name: infinite-rotation;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes infinite-rotation {
  from {
    transform: rotate(-45deg);
  }

  to {
    transform: rotate(10000deg);
  }
}

</style>
