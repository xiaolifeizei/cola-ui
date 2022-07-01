import { getDictList, getDictFromLocalStorage, setDictToLocalStorage } from '@/api/system/dict/dict'

const state = {
  dicts: getDictFromLocalStorage()
}

const mutations = {
  SET_DICT: (state, dict) => {
    if (dict instanceof Array && dict.length > 0) {
      state.dicts = {}
      dict.forEach(item => {
        if (!state.dicts[item.code]) {
          state.dicts[item.code] = []
        }
        if (parseFloat(item.dicValue).toString() !== 'NaN') {
          item.dicValue = parseFloat(item.dicValue)
        }
        state.dicts[item.code].push({ id: item.id, name: item.name, code: item.code, value: item.dicValue })
      })
    }
    setDictToLocalStorage(state.dicts)
  }
}

const actions = {
  getDict({ commit }) {
    return new Promise((resolve, reject) => {
      const query = {
        conditions: [{
          name: 'dicValue',
          keyword: 'ne'
        }],
        data: {
          dicValue: '-1'
        }
      }
      getDictList(query).then(res => {
        const dict = res.data.list ? res.data.list : []
        commit('SET_DICT', dict)
        resolve()
      }).catch(() => {
        reject()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
