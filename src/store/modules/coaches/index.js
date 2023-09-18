export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30
        }
      ]
    }
  },
  mutations: {
    registerCoach(state, payload) {
      state.coaches.push(payload)
    },
    setCoaches(state, payload) {
      state.coaches = payload
    },
    setFetchTimeStamp(state) {
      state.lastFetch = new Date().getTime()
    }
  },
  actions: {
    async registerCoachAction(context, data) {
      const userId = context.rootGetters.userId
      const coachData = {
        firstName: data.first,
        lastName: data.last,
        description: data.desc,
        hourlyRate: data.rate,
        areas: data.areas
      }
      const token = context.rootGetters.token
      const response = await fetch(
        `${import.meta.env.VITE_FIREBASE_API}/coaches/${userId}.json?auth=${token}`,
        {
          method: 'PUT',
          body: JSON.stringify(coachData)
        }
      )
      // const resData = await response.json()

      if (!response.ok) {
        return
      }
      context.commit('registerCoach', {
        ...coachData,
        id: userId
      })
    },
    async loadCoaches(context, payload) {
      if (!payload.forceRefresh && !context.getters.shouldUpdate) {
        return
      }

      const response = await fetch(`${import.meta.env.VITE_FIREBASE_API}/coaches/.json`)
      const resData = await response.json()
      if (!response.ok) {
        const error = new Error(resData.message || 'Failed Fetch!')
        throw error
      }
      const coaches = []
      for (const key in resData) {
        const coach = {
          id: key,
          firstName: resData[key].firstName,
          lastName: resData[key].lastName,
          description: resData[key].description,
          hourlyRate: resData[key].hourlyRate,
          areas: resData[key].areas
        }
        coaches.push(coach)
      }
      context.commit('setCoaches', coaches)
      context.commit('setFetchTimeStamp')
    }
  },
  getters: {
    getCoaches(state) {
      return state.coaches
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch
      if (!lastFetch) {
        return true
      }
      const currentTimeStamp = new Date().getTime()
      return (currentTimeStamp - lastFetch) / 1000 > 60
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0
    },
    getAreas(state) {
      if (state.coaches.areas) {
        return state.coaches.areas
      } else {
        return
      }
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.getCoaches
      const userId = rootGetters.userId
      return coaches.some((coach) => coach.id === userId)
    }
  }
}
