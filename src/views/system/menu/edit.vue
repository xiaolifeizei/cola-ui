<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-edit"
      :disabled="editDisabled"
      @click="showEdit(table.selection[0])"
    >
      修改
    </el-button>
    <el-dialog :append-to-body="true" title="修改菜单" :visible.sync="dialogShow" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :inline="true" :rules="rules" :model="form" label-width="80px">
        <el-form-item :label="nameLabel" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="100" />
        </el-form-item>
        <el-form-item v-show="isMenu" label="图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
          >
            <icon-select @select="selectIcon" />
            <el-input slot="reference" :value="'  ' + form.icon" :readonly="true" style="width: 180px;">
              <icon-show slot="prefix" :icon="form.icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item :label="codeLabel" prop="code">
          <el-input v-model="form.code" autocomplete="off" maxlength="100" />
        </el-form-item>
        <el-form-item v-show="isMenu" label="组件" prop="component">
          <el-input v-model="form.component" autocomplete="off" maxlength="100" />
        </el-form-item>
        <el-form-item v-show="isMenu" label="URL" prop="url">
          <el-input v-model="form.url" autocomplete="off" maxlength="200" style="width: 445px" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="form.menuType" placeholder="请选择" style="width: 177px">
            <el-option v-for="item in this.$data.$dictValues['menuType']" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="isMenu" label="打开类型" prop="openType" style="width: 100%">
          <el-select v-model="form.openType" placeholder="请选择" style="width: 177px">
            <el-option v-for="item in this.$data.$dictValues['openType']" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="isMenu" label="是否隐藏" prop="hidden" style="width: 100%">
          <el-select v-model="form.hidden" placeholder="请选择" style="width: 177px">
            <el-option v-for="item in this.$data.$dictValues['whether']" :key="item.value" :label="item.name" :value="item.value * 1" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orders">
          <el-input-number v-model="form.orders" :min="0" :max="100" label="排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :loading="editLoading" @click="doEdit">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateMenu } from '@/api/system/menu/menu'
import IconSelect from '@/components/Icons/IconSelect'
import IconShow from '@/components/Icons/IconShow'

export default {
  name: 'MenuEdit',
  components: { IconSelect, IconShow },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      isMenu: true,
      nameLabel: '菜单名称',
      codeLabel: '菜单编码',
      form: {
        name: '',
        code: '',
        icon: '',
        url: '',
        component: '',
        menuType: 0,
        openType: '0',
        hidden: 0,
        orders: 0
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入菜单编码', trigger: 'blur' }],
        url: [{ required: true, message: '请输入菜单URL', trigger: 'blur' }],
        component: [{ required: true, message: '请输入菜单组件', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'table.selection'() {
      if (this.table.selection.length === 1) {
        this.editDisabled = false
      } else {
        this.editDisabled = true
      }
    },
    'form.menuType'(val) {
      if (val === 1) {
        this.isMenu = false
        this.codeLabel = '权限编码'
        this.nameLabel = '按钮名称'
      } else {
        this.isMenu = true
        this.codeLabel = '菜单编码'
        this.nameLabel = '菜单名称'
      }
    },
    'form.code': {
      handler(newValue, oldValue) {
        if (this.form.menuType === 1) {
          this.form.component = newValue
          this.form.url = newValue
          this.form.auth = newValue
        }
      }
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    selectIcon(icon) {
      this.form.icon = icon
    },
    cancelEdit() {
      this.dialogShow = false
      this.$refs.editForm.resetFields()
    },
    showEdit(row) {
      this.form = { ...row }
      this.dialogShow = true
    },
    doEdit() {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateMenu(this.form).then(() => {
            this.$refs.editForm.resetFields()
            this.editLoading = false
            this.dialogShow = false
            this.table.refresh()
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
          }).catch(() => {
            this.editLoading = false
          })
        } else {
          this.editLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
