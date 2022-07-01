<template>
  <div class="login" style="background-image:url('./background.jpeg');">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" label-width="0px">
      <div class="avatar_box">
        <img src="logo.png" alt="">
      </div>
      <h3 class="title">
        欢迎使用本系统
      </h3>

      <el-form-item prop="loginName">
        <el-input
          ref="loginName"
          v-model="loginForm.loginName"
          size="normal"
          placeholder="请输入用户名"
          name="loginName"
          type="text"
          tabindex="1"
          autocomplete="on"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="top" manual>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            size="normal"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-top: 30px;margin-bottom:30px;" size="medium" @click.native.prevent="handleLogin">登陆</el-button>
    </el-form>
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </div>
</template>

<script>

import { Message } from 'element-ui'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginName: '',
        password: ''
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.loginName === '') {
      this.$refs.loginName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(async() => {
              await this.$store.dispatch('user/getInfo')
              await this.$store.dispatch('dict/getDict')
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
        } else {
          Message({
            message: '用户名和密码必须要填写',
            type: 'error',
            duration: 3 * 1000
          })
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}
.title {
  margin: 10px auto 10px auto;
  text-align: center;
  color: #fff;
}

.login-form {
  border-radius: 6px;
  // background: #ffffff;
  width: 450px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon{
    height: 39px;width: 14px;margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.avatar_box {
  height: 130px;
  width: 130px;
  // border: 1px solid #000000;
  border-radius: 50%;
  // box-shadow: 0 0 10px #000000;
  // position: absolute;
  left: 40%;
  transform: translate(105%, 0%);
  // background-color: #000;
  padding: 1px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
</style>
