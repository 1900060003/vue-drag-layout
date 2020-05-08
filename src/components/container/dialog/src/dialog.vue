<template>
  <div :class="['air-dialog', {'is-library': hasLibrary}, customCls]">
    <template v-if="hasLibrary">
      <div>Air-Dialog</div>
    </template>
    <template v-else>
    </template>
  </div>
</template>
<script>
export default {
  name: 'air-dialog',
  props: {
    hasLibrary: {
      type: Boolean,
      default: false
    },
    customCls: {
      type: String,
      default: ''
    }
  }
}

</script>
