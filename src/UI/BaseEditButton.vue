<template>
  <button class="base-edit-button"
          @click="(e) => $emit('onButtonClicked', e)">
  </button>
</template>

<script>
export default {};
</script>

<style scoped>

.base-edit-button {
  width: 24px;
  height: 24px;
  border: 0;
  padding: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='11' viewBox='0 0 12 11' fill='none'%3E%3Cpath d='M2.13281 6.57812L8.07031 0.640625C8.55859 0.152344 9.35938 0.152344 9.84766 0.640625L10.6094 1.40234C10.668 1.46094 10.7266 1.53906 10.7656 1.59766C11.0977 2.08594 11.0391 2.75 10.6094 3.17969L4.67188 9.11719C4.65234 9.13672 4.61328 9.15625 4.59375 9.19531C4.39844 9.35156 4.18359 9.46875 3.94922 9.54688L1.58594 10.2305C1.42969 10.2891 1.25391 10.25 1.13672 10.1133C1 9.99609 0.960938 9.82031 1 9.66406L1.70312 7.30078C1.78125 7.02734 1.9375 6.77344 2.13281 6.57812ZM2.60156 7.57422L2.15234 9.09766L3.67578 8.64844C3.79297 8.60938 3.91016 8.55078 4.00781 8.45312L8.48047 3.98047L7.25 2.76953L2.79688 7.24219C2.77734 7.24219 2.77734 7.26172 2.75781 7.28125C2.67969 7.35938 2.64062 7.45703 2.60156 7.57422Z' fill='%23A0A6BF'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
}

</style>
