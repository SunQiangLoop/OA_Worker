<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { orgApi } from '../services/api'

const loading = ref(true)
const loadingUsers = ref(false)
const searchKeyword = ref('')
const expandedDepts = ref(new Set())
const selectedUserIds = ref([])
const sortState = reactive({ key: '', direction: 'asc' })

const showAddDept = ref(false)
const showDeptManage = ref(false)
const showAddMember = ref(false)
const showInviteMember = ref(false)
const showRecords = ref(false)
const showBulk = ref(false)
const showSort = ref(false)
const showEditMember = ref(false)
const showMemberModal = computed(() => showAddMember.value || showInviteMember.value)
const memberModalTitle = computed(() => (showInviteMember.value ? '邀请成员' : '添加成员'))

const deptForm = reactive({
  name: '',
  parent_id: null,
  manager_id: null,
})

const userForm = reactive({
  username: '',
  email: '',
  password: '',
  position: '',
  status: 'active',
})

const editUser = ref(null)

const departments = ref([])
const selectedDept = ref(null)
const users = ref([])

const mockDepartments = [
  {
    id: 'dept-root',
    name: '滁州云链物流数字技术有限公司',
    count: 35,
    deptId: '910000',
    children: [
      { id: 'dept-fin', name: '财务部', count: 3, deptId: '910101' },
      { id: 'dept-hr', name: '人事行政', count: 1, deptId: '910102' },
      { id: 'dept-data', name: '数据中心', count: 2, deptId: '910103' },
      { id: 'dept-ops', name: '运营部', count: 3, deptId: '910104' },
      {
        id: 'dept-sales',
        name: '南京销售大区',
        count: 4,
        deptId: '910200',
        children: [
          {
            id: 'dept-tech',
            name: '技术部',
            count: 10,
            deptId: '910201',
            children: [
              { id: 'dept-dev', name: '开发组', count: 3, deptId: '973146626' },
              { id: 'dept-qa', name: '测试组', count: 2, deptId: '973146627' },
              { id: 'dept-pm', name: '产品组', count: 4, deptId: '973146628' },
              { id: 'dept-gm', name: '总经理', count: 1, deptId: '973146629' },
            ],
          },
        ],
      },
    ],
  },
]

const mockUsersByDept = {
  'dept-dev': [
    {
      id: 'u-1',
      name: '孙成',
      username: 'suncheng',
      password_plain: '123456',
      roleTag: '主管',
      accountType: '个人账号',
      status: '正常',
      position: '研发主管',
      employeeNo: '0543192823750039',
      email: 'suncheng@workflow.com',
      userId: '0543192823750039',
    },
    {
      id: 'u-2',
      name: '梦云',
      username: 'mengyun',
      password_plain: '123456',
      roleTag: '',
      accountType: '个人账号',
      status: '正常',
      position: '前端工程师',
      employeeNo: '062067576328242947',
      email: 'mengyun@workflow.com',
      userId: '062067576328242947',
    },
    {
      id: 'u-3',
      name: '乡家镇',
      username: 'xiangjia',
      password_plain: '123456',
      roleTag: '',
      accountType: '个人账号',
      status: '正常',
      position: '后端工程师',
      employeeNo: '166756015123524629',
      email: 'xiangjia@workflow.com',
      userId: '166756015123524629',
    },
  ],
  'dept-qa': [
    {
      id: 'u-4',
      name: '韩梅',
      username: 'hanmei',
      password_plain: '123456',
      roleTag: '组长',
      accountType: '个人账号',
      status: '正常',
      position: '测试主管',
      employeeNo: '062067576328242950',
      email: 'hanmei@workflow.com',
      userId: '062067576328242950',
    },
    {
      id: 'u-5',
      name: '小马',
      username: 'xiaoma',
      password_plain: '123456',
      roleTag: '',
      accountType: '个人账号',
      status: '正常',
      position: '测试工程师',
      employeeNo: '062067576328242951',
      email: 'xiaoma@workflow.com',
      userId: '062067576328242951',
    },
  ],
}

function isNumericId(id) {
  if (typeof id === 'number') return Number.isFinite(id)
  if (typeof id === 'string') return /^[0-9]+$/.test(id)
  return false
}

function toNumericId(id) {
  return isNumericId(id) ? Number(id) : null
}

function normalizeDepartment(dept) {
  const deptId = dept.deptId || (isNumericId(dept.id) ? String(dept.id) : '000000')
  return {
    ...dept,
    deptId,
    count: typeof dept.count === 'number' ? dept.count : 0,
    children: dept.children ? dept.children.map(normalizeDepartment) : [],
  }
}

function normalizeUser(user) {
  const name = user.name || user.username || '未命名'
  const statusRaw = user.status || 'active'
  const normalizedStatus =
    statusRaw === '正常' ? 'active' : statusRaw === '待邀请' ? 'invited' : statusRaw === '停用' ? 'disabled' : statusRaw
  const statusLabel =
    normalizedStatus === 'active'
      ? '正常'
      : normalizedStatus === 'invited'
      ? '待邀请'
      : normalizedStatus === 'disabled'
      ? '停用'
      : statusRaw
  const statusTone =
    normalizedStatus === 'active' ? 'green' : normalizedStatus === 'invited' ? 'amber' : normalizedStatus === 'disabled' ? 'gray' : 'gray'
  const employeeNo = user.employeeNo || user.employee_no || user.userId || user.id || '-'
  const userId = user.userId || user.employeeNo || user.id || '-'
  const passwordPlain = user.password_plain || user.passwordPlain || user.password || ''
  return {
    ...user,
    name,
    status: normalizedStatus,
    statusLabel,
    statusTone,
    accountType: user.accountType || '个人账号',
    employeeNo,
    userId,
    passwordPlain,
  }
}

function normalizeUsers(list) {
  return list.map(normalizeUser)
}

function normalizeStatusValue(value) {
  if (value === '正常') return 'active'
  if (value === '待邀请') return 'invited'
  if (value === '停用') return 'disabled'
  return value || 'active'
}

onMounted(async () => {
  await loadDepartments()
})

async function loadDepartments() {
  loading.value = true
  try {
    const data = await orgApi.getDepartments()
    const source = Array.isArray(data) && data.length > 0 ? data : mockDepartments
    departments.value = source.map(normalizeDepartment)
  } catch (err) {
    departments.value = mockDepartments.map(normalizeDepartment)
  } finally {
    expandedDepts.value = new Set()
    if (departments.value[0]) {
      expandedDepts.value.add(departments.value[0].id)
    }
    if (findDeptById('dept-sales')) expandedDepts.value.add(findDeptById('dept-sales').id)
    if (findDeptById('dept-tech')) expandedDepts.value.add(findDeptById('dept-tech').id)
    selectDepartment(findDeptById('dept-dev') || departments.value[0])
    loading.value = false
  }
}

async function selectDepartment(dept) {
  if (!dept) return
  selectedDept.value = dept
  loadingUsers.value = true
  selectedUserIds.value = []
  try {
    if (isNumericId(dept.id)) {
      const data = await orgApi.getDepartmentUsers(dept.id)
      users.value = Array.isArray(data) && data.length > 0 ? normalizeUsers(data) : normalizeUsers(mockUsersByDept[dept.id] || [])
    } else {
      users.value = normalizeUsers(mockUsersByDept[dept.id] || [])
    }
  } catch (err) {
    users.value = normalizeUsers(mockUsersByDept[dept.id] || [])
  } finally {
    loadingUsers.value = false
  }
}

function toggleExpand(deptId) {
  if (expandedDepts.value.has(deptId)) {
    expandedDepts.value.delete(deptId)
  } else {
    expandedDepts.value.add(deptId)
  }
}

function isExpanded(deptId) {
  return expandedDepts.value.has(deptId)
}

function findDeptById(id, list = departments.value) {
  for (const dept of list) {
    if (dept.id === id) return dept
    if (dept.children) {
      const found = findDeptById(id, dept.children)
      if (found) return found
    }
  }
  return null
}

function flattenDepartments(list, level = 0, rows = []) {
  list.forEach((dept) => {
    rows.push({ dept, level })
    if (dept.children && isExpanded(dept.id)) {
      flattenDepartments(dept.children, level + 1, rows)
    }
  })
  return rows
}

const filteredDepartments = computed(() => {
  const keyword = searchKeyword.value.trim()
  if (!keyword) return departments.value
  const filter = (list) =>
    list
      .map((dept) => ({
        ...dept,
        children: dept.children ? filter(dept.children) : [],
      }))
      .filter((dept) => dept.name.includes(keyword) || dept.children.length > 0)
  return filter(departments.value)
})

const visibleDepartments = computed(() => {
  return flattenDepartments(filteredDepartments.value)
})

const deptOptions = computed(() => {
  const rows = []
  const walk = (list, level = 0) => {
    list.forEach((dept) => {
      rows.push({ id: dept.id, name: dept.name, level })
      if (dept.children && dept.children.length > 0) {
        walk(dept.children, level + 1)
      }
    })
  }
  walk(departments.value)
  return rows
})

function getAvatar(name) {
  return name ? name.slice(0, 1) : '?'
}

const displayUsers = computed(() => {
  const list = [...users.value]
  if (sortState.key) {
    list.sort((a, b) => {
      const av = (a[sortState.key] || '').toString()
      const bv = (b[sortState.key] || '').toString()
      if (sortState.direction === 'asc') return av.localeCompare(bv)
      return bv.localeCompare(av)
    })
  }
  return list
})

function toggleSelectUser(id) {
  if (selectedUserIds.value.includes(id)) {
    selectedUserIds.value = selectedUserIds.value.filter((item) => item !== id)
  } else {
    selectedUserIds.value = [...selectedUserIds.value, id]
  }
}

function toggleSelectAll() {
  if (selectedUserIds.value.length === displayUsers.value.length) {
    selectedUserIds.value = []
  } else {
    selectedUserIds.value = displayUsers.value.map((u) => u.id)
  }
}

function openAddDept() {
  deptForm.name = ''
  deptForm.parent_id = selectedDept.value?.id || ''
  deptForm.manager_id = ''
  showAddDept.value = true
}

async function submitAddDept() {
  if (!deptForm.name) {
    alert('请填写部门名称')
    return
  }
  const parentIdRaw = deptForm.parent_id || null
  const managerIdRaw = deptForm.manager_id || null
  const payload = {
    name: deptForm.name,
    parent_id: parentIdRaw,
    manager_id: managerIdRaw,
  }
  const apiPayload = {
    name: deptForm.name,
    parent_id: toNumericId(parentIdRaw),
    manager_id: toNumericId(managerIdRaw),
  }
  if (isNumericId(parentIdRaw) || parentIdRaw === null) {
    try {
      await orgApi.createDepartment(apiPayload)
      await loadDepartments()
    } catch (err) {
      showApiError(err, '添加部门失败，请确认已使用管理员账号登录')
      return
    }
  } else {
    addLocalDepartment(payload)
  }
  showAddDept.value = false
}

function openDeptManage() {
  if (!selectedDept.value) return
  deptForm.name = selectedDept.value.name
  deptForm.parent_id = selectedDept.value.parent_id || ''
  deptForm.manager_id = selectedDept.value.manager_id || ''
  showDeptManage.value = true
}

async function submitDeptManage() {
  if (!selectedDept.value) return
  const parentIdRaw = deptForm.parent_id || null
  const managerIdRaw = deptForm.manager_id || null
  const payload = {
    name: deptForm.name,
    parent_id: parentIdRaw,
    manager_id: managerIdRaw,
  }
  const apiPayload = {
    name: deptForm.name,
    parent_id: toNumericId(parentIdRaw),
    manager_id: toNumericId(managerIdRaw),
  }
  if (isNumericId(selectedDept.value.id)) {
    try {
      await orgApi.updateDepartment(selectedDept.value.id, apiPayload)
      await loadDepartments()
    } catch (err) {
      showApiError(err, '更新部门失败，请确认权限与服务状态')
      return
    }
  } else {
    updateLocalDepartment(selectedDept.value.id, payload)
  }
  showDeptManage.value = false
}

async function deleteDept() {
  if (!selectedDept.value) return
  if (!confirm(`确定删除部门「${selectedDept.value.name}」吗？`)) return
  if (isNumericId(selectedDept.value.id)) {
    try {
      await orgApi.deleteDepartment(selectedDept.value.id)
      await loadDepartments()
    } catch (err) {
      showApiError(err, '删除部门失败，请确认权限与服务状态')
      return
    }
  } else {
    deleteLocalDepartment(selectedDept.value.id)
    selectDepartment(departments.value[0])
  }
  showDeptManage.value = false
}

function openAddMember(status = 'active') {
  userForm.username = ''
  userForm.email = ''
  userForm.password = ''
  userForm.position = ''
  userForm.status = status
  showAddMember.value = status === 'active'
  showInviteMember.value = status === 'invited'
}

async function submitAddMember() {
  if (!selectedDept.value) return
  if (!userForm.username) {
    alert('请填写账号')
    return
  }
  if (!userForm.password) {
    alert('请填写初始密码')
    return
  }
  const payload = {
    username: userForm.username,
    email: userForm.email,
    password: userForm.password,
    position: userForm.position,
    status: userForm.status,
    department_id: selectedDept.value.id || null,
  }
  const apiPayload = {
    ...payload,
    department_id: toNumericId(selectedDept.value.id) || null,
  }
  if (isNumericId(selectedDept.value.id)) {
    try {
      await orgApi.createUser(apiPayload)
      await selectDepartment(selectedDept.value)
    } catch (err) {
      showApiError(err, '添加成员失败，请确认权限与服务状态')
      return
    }
  } else {
    addLocalUser(payload)
  }
  showAddMember.value = false
  showInviteMember.value = false
}

function openEditUser(user) {
  editUser.value = user
  userForm.username = user.username || user.name || ''
  userForm.email = user.email || ''
  userForm.password = ''
  userForm.position = user.position || ''
  userForm.status = normalizeStatusValue(user.status)
  showEditMember.value = true
}

async function submitEditUser() {
  if (!editUser.value) return
  if (!userForm.username) {
    alert('请填写账号')
    return
  }
  const payload = {
    username: userForm.username,
    email: userForm.email,
    password: userForm.password || undefined,
    position: userForm.position,
    status: userForm.status,
    department_id: selectedDept.value?.id || null,
  }
  const apiPayload = {
    ...payload,
    department_id: toNumericId(selectedDept.value?.id) || null,
  }
  if (isNumericId(editUser.value.id)) {
    try {
      await orgApi.updateUser(editUser.value.id, apiPayload)
      await selectDepartment(selectedDept.value)
    } catch (err) {
      showApiError(err, '更新成员失败，请确认权限与服务状态')
      return
    }
  } else {
    updateLocalUser(editUser.value.id, payload)
  }
  showEditMember.value = false
}

async function deleteUser(id) {
  if (!confirm('确定删除该员工吗？')) return
  if (isNumericId(id)) {
    try {
      await orgApi.deleteUser(id)
      await selectDepartment(selectedDept.value)
    } catch (err) {
      showApiError(err, '删除成员失败，请确认权限与服务状态')
      return
    }
  } else {
    deleteLocalUser(id)
  }
}

function openRecords() {
  showRecords.value = true
}

function openBulkManage() {
  showBulk.value = true
}

async function bulkDelete() {
  if (selectedUserIds.value.length === 0) return
  if (!confirm('确定删除选中的成员吗？')) return
  const ids = [...selectedUserIds.value]
  selectedUserIds.value = []
  if (ids.every((id) => isNumericId(id))) {
    try {
      await Promise.all(ids.map((id) => orgApi.deleteUser(id)))
      await selectDepartment(selectedDept.value)
    } catch (err) {
      showApiError(err, '批量删除失败，请确认权限与服务状态')
      return
    }
  } else {
    ids.forEach((id) => deleteLocalUser(id))
  }
  showBulk.value = false
}

function openSort() {
  showSort.value = true
}

function applySort(key) {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortState.key = key
    sortState.direction = 'asc'
  }
  showSort.value = false
}

function addLocalDepartment(payload) {
  const newDept = normalizeDepartment({
    id: `local-${Date.now()}`,
    name: payload.name,
    parent_id: payload.parent_id,
    manager_id: payload.manager_id,
    count: 0,
  })
  if (payload.parent_id) {
    const parent = findDeptById(payload.parent_id)
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newDept)
      expandedDepts.value.add(parent.id)
    } else {
      departments.value.push(newDept)
    }
  } else {
    departments.value.push(newDept)
  }
}

function updateLocalDepartment(id, payload) {
  const target = findDeptById(id)
  if (!target) return
  Object.assign(target, payload)
}

function deleteLocalDepartment(id, list = departments.value) {
  const index = list.findIndex((dept) => dept.id === id)
  if (index >= 0) {
    list.splice(index, 1)
    return true
  }
  for (const dept of list) {
    if (dept.children && dept.children.length > 0) {
      const removed = deleteLocalDepartment(id, dept.children)
      if (removed) return true
    }
  }
  return false
}

function addLocalUser(payload) {
  const newUser = normalizeUser({
    id: `local-${Date.now()}`,
    username: payload.username,
    email: payload.email,
    position: payload.position,
    status: payload.status,
    password_plain: payload.password,
  })
  users.value = [...users.value, newUser]
}

function updateLocalUser(id, payload) {
  users.value = users.value.map((user) => (user.id === id ? normalizeUser({ ...user, ...payload }) : user))
}

function deleteLocalUser(id) {
  users.value = users.value.filter((user) => user.id !== id)
}

function showApiError(err, fallback) {
  const status = err?.response?.status
  let message = err?.response?.data?.message || err?.message || fallback
  if (status === 404) {
    message = '接口不存在（404），请确认后端已重启到最新代码'
  }
  if (status === 403) {
    message = '权限不足，请使用管理员账号登录'
  }
  alert(message)
}

watch(users, () => {
  selectedUserIds.value = []
})
</script>

<template>
  <div class="org-page" v-if="!loading">
    <aside class="org-sidebar">
      <div class="sidebar-search">
        <span class="icon-search"></span>
        <input v-model="searchKeyword" type="text" placeholder="搜索成员、部门、角色" />
      </div>
      <div class="sidebar-actions">
        <button class="btn btn-ghost" type="button" @click="openAddDept">添加子部门</button>
        <button class="btn btn-ghost" type="button" @click="openDeptManage">部门管理</button>
      </div>

      <div class="dept-tree">
        <div
          v-for="row in visibleDepartments"
          :key="row.dept.id"
          class="dept-row"
          :class="{ active: selectedDept?.id === row.dept.id }"
          :style="{ paddingLeft: `${12 + row.level * 14}px` }"
          @click="selectDepartment(row.dept)"
        >
          <button
            v-if="row.dept.children && row.dept.children.length > 0"
            class="dept-toggle"
            :class="{ expanded: isExpanded(row.dept.id) }"
            type="button"
            @click.stop="toggleExpand(row.dept.id)"
          ></button>
          <span>{{ row.dept.name }}{{ row.dept.count ? `(${row.dept.count}人)` : '' }}</span>
        </div>
      </div>
    </aside>

    <main class="org-main">
      <div class="org-header">
        <div>
          <div class="org-title">
            {{ selectedDept?.name || '开发组' }}
            <span class="muted">（部门ID：{{ selectedDept?.deptId || '973146626' }}）</span>
            <span class="tag tag--ghost">部门群</span>
          </div>
          <div class="muted">你是主管管理员，拥有全部权限</div>
        </div>
        <button class="btn btn-ghost" type="button" @click="openDeptManage">编辑部门</button>
      </div>

      <div class="org-toolbar">
        <button class="btn btn-primary" type="button" @click="openAddMember('active')">添加成员</button>
        <button class="btn btn-ghost" type="button" @click="openAddMember('invited')">邀请成员</button>
        <button class="btn btn-ghost" type="button" @click="openRecords">添加/申请记录</button>
        <button class="btn btn-ghost" type="button" @click="openBulkManage">批量管理</button>
        <button class="btn btn-ghost" type="button" @click="openSort">调整排序</button>
      </div>

      <div class="org-table">
        <div class="org-table-scroll">
          <div class="table-head">
          <div>
            <input
              type="checkbox"
              :checked="displayUsers.length > 0 && selectedUserIds.length === displayUsers.length"
              @change="toggleSelectAll"
            />
          </div>
          <div>姓名</div>
          <div>账号</div>
          <div>密码</div>
          <div>账号类型</div>
          <div>账号状态</div>
          <div>职位</div>
          <div>工号</div>
          <div>邮箱</div>
          <div>员工UserID</div>
          <div>操作</div>
          </div>
          <div v-if="loadingUsers" class="empty">成员加载中...</div>
          <div v-else-if="displayUsers.length === 0" class="empty">该部门暂无成员</div>
          <div v-for="user in displayUsers" :key="user.id" class="table-row">
          <div>
            <input
              type="checkbox"
              :checked="selectedUserIds.includes(user.id)"
              @change="toggleSelectUser(user.id)"
            />
          </div>
          <div class="name-cell">
            <div class="avatar">{{ getAvatar(user.name || user.username) }}</div>
            <div>
              <div class="name">
                {{ user.name || user.username }}
                <span v-if="user.roleTag" class="badge">{{ user.roleTag }}</span>
              </div>
              <div v-if="user.username && user.username !== user.name" class="subtext">账号：{{ user.username }}</div>
            </div>
          </div>
          <div class="mono">{{ user.username || '-' }}</div>
          <div class="mono">{{ user.passwordPlain || '-' }}</div>
          <div><span class="badge light">{{ user.accountType || '个人账号' }}</span></div>
          <div>
            <span class="status-dot" :class="`status-${user.statusTone}`"></span>
            {{ user.statusLabel || '正常' }}
          </div>
          <div>{{ user.position || '员工' }}</div>
          <div>{{ user.employeeNo || '-' }}</div>
          <div>{{ user.email || '-' }}</div>
          <div>{{ user.userId || '-' }}</div>
          <div class="actions">
            <button class="link" type="button" @click="openEditUser(user)">编辑</button>
            <button class="link danger" type="button" @click="deleteUser(user.id)">删除</button>
          </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div v-else class="empty">加载组织架构...</div>

  <div v-if="showAddDept" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">添加子部门</div>
        <button class="btn btn-ghost" type="button" @click="showAddDept = false">关闭</button>
      </div>
      <div class="modal-body">
        <div class="field-group">
          <label>部门名称</label>
          <input v-model="deptForm.name" type="text" placeholder="请输入部门名称" />
        </div>
        <div class="field-group">
          <label>上级部门</label>
          <select v-model="deptForm.parent_id">
            <option value="">无</option>
            <option v-for="opt in deptOptions" :key="opt.id" :value="opt.id">
              {{ `${'—'.repeat(opt.level)} ${opt.name}` }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label>部门主管</label>
          <select v-model="deptForm.manager_id">
            <option value="">未设置</option>
            <option v-for="user in displayUsers" :key="user.id" :value="user.id">
              {{ user.name || user.username }}
            </option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" @click="showAddDept = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitAddDept">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showDeptManage" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">部门管理</div>
        <button class="btn btn-ghost" type="button" @click="showDeptManage = false">关闭</button>
      </div>
      <div class="modal-body">
        <div class="field-group">
          <label>部门名称</label>
          <input v-model="deptForm.name" type="text" placeholder="请输入部门名称" />
        </div>
        <div class="field-group">
          <label>上级部门</label>
          <select v-model="deptForm.parent_id">
            <option value="">无</option>
            <option v-for="opt in deptOptions" :key="opt.id" :value="opt.id">
              {{ `${'—'.repeat(opt.level)} ${opt.name}` }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label>部门主管</label>
          <select v-model="deptForm.manager_id">
            <option value="">未设置</option>
            <option v-for="user in displayUsers" :key="user.id" :value="user.id">
              {{ user.name || user.username }}
            </option>
          </select>
        </div>
      </div>
      <div class="modal-actions space-between">
        <button class="btn btn-ghost danger" type="button" @click="deleteDept">删除部门</button>
        <div class="modal-actions">
          <button class="btn btn-ghost" type="button" @click="showDeptManage = false">取消</button>
          <button class="btn btn-primary" type="button" @click="submitDeptManage">保存</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showMemberModal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ memberModalTitle }}</div>
        <button class="btn btn-ghost" type="button" @click="showAddMember = false; showInviteMember = false">关闭</button>
      </div>
      <div class="modal-body">
        <div class="field-group">
          <label>账号</label>
          <input v-model="userForm.username" type="text" placeholder="用于登录的账号" />
        </div>
        <div class="field-group">
          <label>初始密码</label>
          <input v-model="userForm.password" type="password" placeholder="设置初始密码" />
        </div>
        <div class="field-group">
          <label>邮箱</label>
          <input v-model="userForm.email" type="email" placeholder="输入邮箱地址" />
        </div>
        <div class="field-group">
          <label>职位</label>
          <input v-model="userForm.position" type="text" placeholder="输入职位信息" />
        </div>
        <div class="field-group">
          <label>账号状态</label>
          <select v-model="userForm.status">
            <option value="active">正常</option>
            <option value="invited">待邀请</option>
            <option value="disabled">停用</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" @click="showAddMember = false; showInviteMember = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitAddMember">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showEditMember" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">编辑成员</div>
        <button class="btn btn-ghost" type="button" @click="showEditMember = false">关闭</button>
      </div>
      <div class="modal-body">
        <div class="field-group">
          <label>账号</label>
          <input v-model="userForm.username" type="text" placeholder="用于登录的账号" />
        </div>
        <div class="field-group">
          <label>重置密码</label>
          <input v-model="userForm.password" type="password" placeholder="不修改请留空" />
        </div>
        <div class="field-group">
          <label>邮箱</label>
          <input v-model="userForm.email" type="email" placeholder="输入邮箱地址" />
        </div>
        <div class="field-group">
          <label>职位</label>
          <input v-model="userForm.position" type="text" placeholder="输入职位信息" />
        </div>
        <div class="field-group">
          <label>账号状态</label>
          <select v-model="userForm.status">
            <option value="active">正常</option>
            <option value="invited">待邀请</option>
            <option value="disabled">停用</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" @click="showEditMember = false">取消</button>
        <button class="btn btn-primary" type="button" @click="submitEditUser">保存</button>
      </div>
    </div>
  </div>

  <div v-if="showRecords" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">添加/申请记录</div>
        <button class="btn btn-ghost" type="button" @click="showRecords = false">关闭</button>
      </div>
      <div class="modal-body">
        <div class="muted">暂无记录，可在后续接入邀请审批或申请流转记录。</div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" @click="showRecords = false">我知道了</button>
      </div>
    </div>
  </div>

  <div v-if="showBulk" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">批量管理</div>
        <button class="btn btn-ghost" type="button" @click="showBulk = false">关闭</button>
      </div>
      <div class="modal-body">
        <div class="muted">已选中 {{ selectedUserIds.length }} 位成员</div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" type="button" @click="showBulk = false">取消</button>
        <button class="btn btn-primary" type="button" @click="bulkDelete">删除选中</button>
      </div>
    </div>
  </div>

  <div v-if="showSort" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">调整排序</div>
        <button class="btn btn-ghost" type="button" @click="showSort = false">关闭</button>
      </div>
      <div class="modal-body">
        <div class="sort-grid">
          <button class="btn btn-ghost" type="button" @click="applySort('name')">按姓名</button>
          <button class="btn btn-ghost" type="button" @click="applySort('position')">按职位</button>
          <button class="btn btn-ghost" type="button" @click="applySort('statusLabel')">按状态</button>
          <button class="btn btn-ghost" type="button" @click="applySort('employeeNo')">按工号</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" type="button" @click="showSort = false">完成</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.org-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 0;
  border-radius: 18px;
  border: 1px solid var(--shell-border);
  background: #fff;
  overflow: hidden;
}

.org-sidebar {
  border-right: 1px solid var(--shell-border);
  padding: 16px;
  display: grid;
  gap: 14px;
  background: #fff;
}

.sidebar-search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--shell-border);
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
}

.sidebar-search input {
  border: none;
  background: transparent;
  width: 100%;
}

.sidebar-actions {
  display: grid;
  gap: 8px;
}

.dept-tree {
  display: grid;
  gap: 6px;
  max-height: 520px;
  overflow: auto;
}

.dept-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--shell-text);
}

.dept-row.active {
  background: #f1f5f9;
  font-weight: 600;
}

.dept-toggle {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  border: 1px solid var(--shell-border);
  background: #fff;
  position: relative;
}

.dept-toggle::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-right: 2px solid var(--shell-muted);
  border-bottom: 2px solid var(--shell-muted);
  transform: rotate(-45deg);
  top: 1px;
  left: 2px;
}

.dept-toggle.expanded::after {
  transform: rotate(45deg);
  top: -1px;
}

.org-main {
  padding: 20px 24px;
  display: grid;
  gap: 16px;
}

.org-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.org-title {
  font-weight: 700;
  font-size: 18px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: #fff7ed;
  color: #b45309;
}

.tag--ghost {
  background: #fef9c3;
  color: #92400e;
}

.org-toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.org-table {
  border: 1px solid var(--shell-border);
  border-radius: 12px;
  overflow: hidden;
}

.org-table-scroll {
  overflow-x: auto;
  overflow-y: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 40px 190px 140px 140px 120px 120px 120px 120px 200px 170px 120px;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  min-width: 1400px;
}

.table-head {
  background: #f3f4f6;
  font-size: 12px;
  color: var(--shell-muted);
  font-weight: 600;
}

.table-row {
  border-top: 1px solid var(--shell-border);
  font-size: 13px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.subtext {
  font-size: 12px;
  color: var(--shell-muted);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.badge {
  margin-left: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e7f8ef;
  color: #16a34a;
  font-size: 11px;
}

.badge.light {
  background: #e7f8ef;
  color: #16a34a;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  display: inline-block;
  margin-right: 6px;
}

.status-green {
  background: #22c55e;
}

.status-amber {
  background: #f59e0b;
}

.status-gray {
  background: #94a3b8;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.mono {
  font-family: 'IBM Plex Sans', monospace;
  font-size: 12px;
  color: var(--shell-ink);
}

.link {
  color: var(--shell-primary);
  font-weight: 600;
  font-size: 13px;
}

.link.danger {
  color: #ef4444;
}

.modal-body {
  display: grid;
  gap: 12px;
}

.field-group {
  display: grid;
  gap: 6px;
}

.field-group label {
  font-size: 12px;
  color: var(--shell-muted);
}

.modal-actions.space-between {
  justify-content: space-between;
  align-items: center;
}

.modal-actions.space-between .modal-actions {
  margin-top: 0;
}

.btn.danger {
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.btn-ghost.danger {
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.sort-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

@media (max-width: 1200px) {
  .org-page {
    grid-template-columns: 1fr;
  }
}
</style>
