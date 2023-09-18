export default {
  namespaced: true,
  state() {
    return {
      requests: []
    }
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload)
    },
    setRequest(state, payload) {
      state.requests = payload
    }
  },
  actions: {
    async contactCoach(context, payload) {
      const newRequest = {
        userEmail: payload.email,
        userMessage: payload.message
      }
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_API}/requests/${payload.coachId}.json`,
        {
          method: 'POST',
          body: JSON.stringify(newRequest)
        }
      )
      const resData = await response.json()

      if (!response.ok) {
        const error = new Error(resData.message || 'Failed to send request.')
        throw error
      }
      newRequest.id = resData.name
      newRequest.coachId = payload.coachId

      context.commit('addRequest', newRequest)
    },
    async fetchRequest(context) {
      const token = context.rootGetters.token

      const coachId = context.rootGetters.userId
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_API}/requests/${coachId}.json?auth=${token}`
      )
      const resData = await response.json()

      if (!response.ok) {
        const error = new Error(resData.message || 'Failed to fetch request.')
        throw error
      }
      const requests = []
      for (const key in resData) {
        const request = {
          id: key,
          coachId: coachId,
          userEmail: resData[key].userEmail,
          userMessage: resData[key].userMessage
        }
        requests.push(request)
      }

      context.commit('setRequest', requests)
    }
  },
  getters: {
    getRequests(state, _, _2, rootGetters) {
      const coachId = rootGetters.userId

      return state.requests.filter((req) => req.coachId === coachId)
    },
    hasRequests(_, getters) {
      return getters.getRequests && getters.getRequests.length > 0
    }
  }
}
