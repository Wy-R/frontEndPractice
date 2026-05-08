/*******============ Vuex =================*********/

const store = new Vuex.store({
  state: {
    count: 1,
    todos: []
  },

  getters: {
    counts() {
      return this.count
    }
  },
  mutations: {
    increment(state, payload) {
      state.count += payload.amount
    }

  },
  actions: {
    async fetchTodos() {
      try {
        const todoResult = await fetch('/api/todos')
        const { todos } = await response.json()
        commit('setTodos', todos)
      } catch (error) {
        return false
      }
    }
  }
})


// 使用
// this.$tore.getters.counts
// this.$store.commit('increment', { amount: 10})
// this.$store.dispatch('fetchTodos')
// 使用mapGetters 辅助
// computed: {
//   ...mapGetters(['counts'])
// ...mapMutations(['increment'])
// ...mapActions(['fetchTodos'])
// }




/*******============ pinia =================*********/

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: ()=> ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    },
    async fetchData()  {
      const response = await fetch('/api/data');
      this.count = await response.json();
    }
  }
})


// 使用
// import { useCounterStore } from '@/store/counter'
// const counter = useCounterStore()

// 直接访问状态
// console.log(counter.count)
// 修改状态
// counter.count++