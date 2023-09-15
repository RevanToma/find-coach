<template>
  <div>
    <base-dialog :show="!!error" title="An Error occurd!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <base-card>
        <header><h2>Requests Received</h2></header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="hasRequests && !isLoading">
          <request-item
            v-for="req in receivedRequests"
            :key="req.id"
            :email="req.userEmail"
            :message="req.userMessage"
          ></request-item>
        </ul>
        <h3 v-else>You haven't received any requests yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestsItem.vue'
import BaseDialog from '../../components/UI/BaseDialog.vue'
export default {
  data() {
    return {
      isLoading: false,
      error: null
    }
  },
  components: { RequestItem, BaseDialog },
  created() {
    this.loadRequest()
  },
  computed: {
    receivedRequests() {
      return this.$store.getters['requests/getRequests']
    },
    hasRequests() {
      return this.$store.getters['requests/hasRequests']
    }
  },
  methods: {
    async loadRequest() {
      this.isLoading = true
      try {
        await this.$store.dispatch('requests/fetchRequest')
      } catch (error) {
        this.error = error.message || 'Something Failed!'
      }
      this.isLoading = false
    },
    handleError() {
      this.error = null
    }
  }
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
