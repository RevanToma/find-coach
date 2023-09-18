let timer;

export default {
  state() {
    return {
      userId: null,
      token: null,
      tokenExpiration: null,
      didAutoLogout: false
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
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
      clearTimeout(timer);
      context.commit('setUser', {
        token: null,
        userId: null
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
        let errorMsg = '';
        if (resData.error.message === 'EMAIL_EXISTS') {
          errorMsg = 'Email already exist!';
        }
        if (resData.error.message === 'INVALID_LOGIN_CREDENTIALS') {
          errorMsg = 'Wrong email adress or password.';
        }
        const error = new Error(errorMsg || 'Failed to authenticate.');
        throw error;
      }
      const expiresIn = +resData.expiresIn * 1000;
      const expirationData = new Date().getTime() + expiresIn;

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      context.commit('setUser', {
        token: resData.idToken,
        userId: resData.localId,
        tokenExpiration: expirationData
      });
    },
    tryLogin(state, context) {
      const tokenExpire = state.rootGetters.tokenExpiration;

      const expiresIn = +tokenExpire - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);
    },
    autoLogout(context) {
      context.dispatch('logOutUser');
      context.commit('setAutoLogout');
    }
  },
  getters: {
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    tokenExpiration(state) {
      return state.tokenExpiration;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    }
  }
};
