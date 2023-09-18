export default {
  state() {
    return {
      userId: null,
      token: null,
      tokenExpiration: null
    }
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token
      state.userId = payload.userId
      state.tokenExpiration = payload.tokenExpiration
    }
  },
  actions: {
    login() {},
    async signup(context, payload) {
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_SIGNUP}${import.meta.env.VITE_FIREBASE_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true
          })
        }
      )
      const resData = await response.json()

      if (!response.ok) {
        console.log(resData)
        const error = new Error(resData.message || 'Failed to authenticate.')
        throw error
      }
      console.log(resData)
      context.commit('setUser', {
        token: resData.idToken,
        userId: resData.localId,
        tokenExpiration: resData.expiresIn
      })
    }
  },
  getters: {}
}
