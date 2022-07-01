import store from '@/store'
import TableHeader from './TableHeader'
import TableQuery from './TableQuery'

export default {
  components: {
    TableHeader,
    TableQuery
  },
  data() {
    return {
      $dictValues: store.getters.dict
    }
  },
  methods: {
    $dict(key, value) {
      let dictName = ''
      if (this.$data.$dictValues && this.$data.$dictValues[key] instanceof Array && this.$data.$dictValues[key].length > 0) {
        this.$data.$dictValues[key].forEach(d => {
          if (d.value === value) {
            dictName = d.name
          }
        })
      }
      return dictName
    }
  }
}
