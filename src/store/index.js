import { createStore } from 'vuex'
import CoachesModule from './modules/coaches/index'
import RequestModule from './modules/requests/index'
import AuthModule from './modules/auth/index'
const store = createStore({
  modules: {
    coaches: CoachesModule,
    requests: RequestModule,
    auth: AuthModule
  },

  getters: {
    userId(state) {
      return state.userId
    }
  }
})

export default store
