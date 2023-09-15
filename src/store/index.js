import { createStore } from 'vuex'
import CoachesModule from './modules/coaches/index'
import RequestModule from './modules/requests/index'
const store = createStore({
  modules: {
    coaches: CoachesModule,
    requests: RequestModule
  },
  state() {
    return {
      userId: 'c2'
    }
  },
  getters: {
    userId(state) {
      return state.userId
    }
  }
})

export default store
