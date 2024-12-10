<script setup >

import AccountInfo from "/content/accountInfo.vue";
import SponsorMe from "/content/sponsorMe.vue";
import assets from "/content/assets.vue";
</script>

<script>
export default {
  name: 'walletContent',
  components: {},
  methods: {}
}
</script>

<template>
<n-flex vertical style="width: 100%">
    <account-info/>
    <sponsor-me/>
    <assets/>
</n-flex>
</template>

<style scoped>

</style>