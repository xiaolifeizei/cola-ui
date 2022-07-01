<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="warning"
      icon="el-icon-setting"
      :disabled="grantDisabled"
      @click="showGrant"
    >
      分配菜单
    </el-button>
    <el-dialog :append-to-body="true" title="分配菜单" :visible.sync="dialogShow" width="400px" @close="cancelGrant">
      <el-tree
        ref="menuTree"
        :props="props"
        :data="menuTree"
        node-key="id"
        show-checkbox
        :default-expand-all="expandAll"
        @check-change="handleCheckChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :loading="grantLoading" @click="doGrantMenu">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree } from '@/api/system/menu/menu'
import { getRoleMenusByRole, grantMenus } from '@/api/system/role/role'

export default {
  name: 'GrantMenu',
  data() {
    return {
      table: {},
      grantDisabled: true,
      dialogShow: false,
      grantLoading: false,
      props: {
        label: 'name'
      },
      menuTree: [],
      expandAll: false
    }
  },
  watch: {
    'table.selection'() {
      this.grantDisabled = this.table.selection.length !== 1
    },
    dialogShow(val) {
      if (val) {
        this.getGrantMenusData()
      }
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
    this.getMenuTreeData()
  },
  methods: {
    handleCheckChange() {

    },
    getGrantMenusData() {
      getRoleMenusByRole({ id: this.table.selection[0].id }).then(res => {
        const nodes = []
        if (res.data.list) {
          res.data.list.forEach(item => {
            nodes.push({ id: item.menuId, name: item.name })
          })
        }
        this.$refs.menuTree.setCheckedNodes(nodes)
      })
    },
    getMenuTreeData() {
      getMenuTree().then(res => {
        if (res.data.list) {
          this.menuTree = res.data.list
        }
      })
    },
    showGrant() {
      this.dialogShow = true
    },
    cancelGrant() {

    },
    doGrantMenu() {
      this.grantLoading = true
      const checked = this.$refs.menuTree.getCheckedNodes()
      const data = {
        roleId: this.table.selection[0].id,
        list: []
      }
      if (checked.length > 0) {
        checked.forEach(item => {
          data.list.push({ roleId: data.roleId, menuId: item.id })
        })
      }
      grantMenus(data).then(() => {
        this.dialogShow = false
        this.grantLoading = false
        this.table.refresh()
        this.$notify.success({
          title: '成功',
          message: '菜单分配成功'
        })
      }).catch(() => {
        this.grantLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
