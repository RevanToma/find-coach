export default {
  state() {
    return {
      userId: null,
      token: null,
      tokenExpiration: null
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.tokenExpiration = payload.tokenExpiration;
    }
  },
  actions: {
    async login(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'login'
      });
    },
    async signup(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signup'
      });
    },
    logOutUser(context) {
      context.commit('setUser', {
        token: null,
        userId: null,
        tokenExpiration: null
      });
    },
    async auth(context, payload) {
      const mode = payload.mode;
      let url = `${import.meta.env.VITE_FIREBASE_SIGNIN}${import.meta.env.VITE_FIREBASE_API_KEY}`;

      if (mode === 'signup') {
        url = `${import.meta.env.VITE_FIREBASE_SIGNUP}${import.meta.env.VITE_FIREBASE_API_KEY}`;
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })
      });
      const resData = await response.json();

      if (!response.ok) {
        const error = new Error(resData.message || 'Failed to authenticate.');
        throw error;
      }

      context.commit('setUser', {
        token: resData.idToken,
        userId: resData.localId,
        tokenExpiration: resData.expiresIn
      });
    }
  },
  getters: {
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    }
  }
};
