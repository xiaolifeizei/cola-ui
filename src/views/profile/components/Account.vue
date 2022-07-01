<template>
  <el-form ref="userForm" :rules="rules" :model="form" style="width: 550px">
    <el-form-item label="姓名" prop="name">
      <el-input
        v-model.trim="form.name"
        placeholder="请输入姓名"
        auto-complete="off"
        onfocus="this.removeAttribute('readonly');"
        readonly
        maxlength="10"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input
        v-model.trim="form.phone"
        placeholder="请输入手机号"
        auto-complete="off"
        onfocus="this.removeAttribute('readonly');"
        readonly
        maxlength="11"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item label="身份证号" prop="ids">
      <el-input
        v-model.trim="form.ids"
        placeholder="请输入身份证号"
        auto-complete="off"
        onfocus="this.removeAttribute('readonly');"
        readonly
        maxlength="18"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item label="原密码" prop="oldPassword">
      <el-input
        v-model.trim="form.password"
        placeholder="请输入原密码"
        type="password"
        auto-complete="off"
        onfocus="this.removeAttribute('readonly');"
        readonly
        maxlength="10"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input
        v-model.trim="form.newPassword"
        placeholder="请输入新密码"
        type="password"
        auto-complete="off"
        onfocus="this.removeAttribute('readonly');"
        readonly
        maxlength="10"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item label="再次输入新密码">
      <el-input
        v-model.trim="form.newPassword2"
        placeholder="请再次输入新密码"
        type="password"
        auto-complete="off"
        onfocus="this.removeAttribute('readonly');"
        readonly
        maxlength="10"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit"> 修 改 </el-button>
      <span style="margin-left: 10px; color: red">注：原密码和新密码不填写则不修改密码</span>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserInfo } from '@/api/system/user/user'
import { validateIdCard } from '@/utils/validate'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          userInfo: {
            id: '',
            ids: '',
            phone: ''
          }
        }
      }
    }
  },
  data() {
    return {
      form: {
        id: this.user.userInfo.id,
        name: this.user.name,
        ids: '',
        phone: '',
        password: '',
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.userForm.validate().then(() => {
        return this.$confirm('确定要修改吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }).then(() => {
        if (this.form.password.length > 0) {
          if (this.form.newPassword !== this.form.newPassword2) {
            this.$notify.error({
              title: '修改失败',
              message: '两次密码输入不一致'
            })
            return Promise.reject()
          }
          if (this.form.password === this.form.newPassword) {
            this.$notify.error({
              title: '修改失败',
              message: '原密码和新密码相同'
            })
            return Promise.reject()
          }
        }
        if (this.form.phone.length > 0) {
          const regex = /^1[3456789]\d{9}$/
          if (!regex.test(this.form.phone)) {
            this.$notify.error({
              title: '修改失败',
              message: '手机号码格式不正确'
            })
            return Promise.reject()
          }
        }
        if (this.form.ids.length > 0 && !validateIdCard(this.form.ids)) {
          this.$notify.error({
            title: '修改失败',
            message: '身份证号格式不正确'
          })
          return Promise.reject()
        }
      }).then(() => {
        return updateUserInfo(this.form)
      }).then(() => {
        this.$refs.userForm.resetFields()
        return this.$confirm('修改信息成功，重新登陆后可查看最新数据，是否需要重新登陆?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        })
      }).then(async() => {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    }
  }
}
</script>
