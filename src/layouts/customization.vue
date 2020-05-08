<template>
  <div class="air-customization-view layout">
    <library></library>
  </div>
</template>
<script>
import AirDialog from '@/components/container/dialog'
export default {
  name: 'customization',
  components: {
    Library: () => import('@/components/Library'),
    AirDialog
  }
}

</script>
<style lang="scss" scoped>
.air-customization-view {
  display: flex;
}

</style>
