import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  let roles = store.getters && store.getters.roles
  const buttons = store.getters && store.getters.buttons
  roles = roles.concat(buttons)
  if (roles.includes('administrator')) {
    return
  }
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
