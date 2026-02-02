<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const steps = [
  { key: 'basic', label: '基础信息' },
  { key: 'form', label: '表单设计' },
  { key: 'flow', label: '流程设计' },
]

const activeStep = ref('basic')

const guideCards = [
  {
    title: '创建审批流程',
    desc: '快速创建一个简单的审批流程',
  },
  {
    title: '设置分支条件',
    desc: '不同条件适用不同审批路线',
  },
  {
    title: '设置多人审批',
    desc: '可设置会签、或签模式',
  },
  {
    title: '审批人去重',
    desc: '同一审批人多次出现可自动去重',
  },
]

const toolBlocks = [
  {
    title: '角色组件',
    items: ['审批人', '抄送人', '办理人', '条件分支'],
  },
  {
    title: '流程操作',
    items: ['条件判断', '并行分支', '结束节点'],
  },
  {
    title: '常用模板',
    items: ['费用报销', '请假申请', '采购审批'],
  },
]

const formGroups = [
  { title: '文本', items: ['单行文本', '多行文本', '说明'] },
  { title: '数值', items: ['数字', '金额', '计算公式'] },
  { title: '选项', items: ['单选', '多选'] },
  { title: '日期', items: ['日期', '日期区间'] },
  { title: '其他', items: ['明细/表格', '图片', '附件', '部门', '联系人'] },
]

const fieldSettings = [
  { label: '标题', value: '数字' },
  { label: '默认提示', value: '请输入' },
  { label: '单位', value: '元' },
  { label: '最小值', value: '0' },
]

const approverOptions = [
  { label: '上级', value: 'leader' },
  { label: '用户组', value: 'group' },
  { label: '提交人本人', value: 'self' },
  { label: '指定成员', value: 'member' },
]
</script>

<template>
  <div class="page workflow-builder">
    <div class="workflow-header">
      <button class="btn btn-ghost" @click="router.push('/approvals')">返回审批中心</button>
      <div>
        <div class="page-eyebrow">创建审批流程</div>
        <h2>费用报销</h2>
        <p class="page-subtitle">配置审批流程与审批人规则，支持条件分支与抄送。</p>
      </div>
      <div class="workflow-meta">
        <span class="meta-chip">3 项不完善</span>
        <button class="btn btn-primary" type="button">发布流程</button>
      </div>
    </div>

    <div class="workflow-steps">
      <button
        v-for="(step, idx) in steps"
        :key="step.key"
        class="workflow-step"
        :class="{ active: activeStep === step.key }"
        type="button"
        @click="activeStep = step.key"
      >
        <span class="step-number">{{ idx + 1 }}</span>
        <span>{{ step.label }}</span>
      </button>
    </div>

    <div v-if="activeStep === 'basic'" class="basic-grid">
      <section class="panel basic-card">
        <div class="panel-header">
          <div>
            <div class="panel-title">基础信息</div>
            <div class="muted">配置审批流程名称、归属与权限</div>
          </div>
        </div>
        <div class="panel-body basic-form">
          <div class="basic-avatar">
            <div class="avatar-circle">¥</div>
            <button class="btn btn-ghost" type="button">修改</button>
          </div>

          <label class="field">
            <span>名称 *</span>
            <input type="text" value="费用报销" />
          </label>

          <label class="field">
            <span>说明</span>
            <input type="text" value="差旅费、团建费等各类报销" />
          </label>

          <label class="field">
            <span>分类 *</span>
            <select>
              <option>财务</option>
              <option>行政</option>
              <option>人事</option>
            </select>
          </label>

          <label class="field">
            <span>谁可以提交该审批 *</span>
            <select>
              <option>全员</option>
              <option>部门成员</option>
              <option>指定成员</option>
            </select>
          </label>

          <div class="basic-toggle">
            <div>
              <div class="toggle-title">是否允许该审批展示在工作台</div>
              <div class="muted">开启后审批应用可被发现与使用</div>
            </div>
            <label class="switch">
              <input type="checkbox" checked />
              <span></span>
            </label>
          </div>

          <div class="basic-admin">
            <div class="toggle-title">流程管理员 *</div>
            <div class="admin-list">
              <div class="admin-item">
                <div class="admin-avatar">i</div>
                <div>
                  <div class="admin-name">importnew</div>
                  <div class="muted">权限：高级</div>
                </div>
              </div>
              <button class="admin-add" type="button">+</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else-if="activeStep === 'form'" class="form-grid">
      <section class="panel form-toolbox">
        <div class="panel-header">
          <div>
            <div class="panel-title">控件</div>
            <div class="muted">拖拽字段到表单预览</div>
          </div>
        </div>
        <div class="panel-body">
          <div v-for="group in formGroups" :key="group.title" class="tool-group">
            <div class="tool-title">{{ group.title }}</div>
            <div class="tool-items">
              <div v-for="item in group.items" :key="item" class="tool-item">
                <span class="tool-dot"></span>
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="panel form-preview">
        <div class="panel-header">
          <div>
            <div class="panel-title">表单设计画布</div>
            <div class="muted">在右侧配置字段属性</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="device-frame form-device">
            <div class="device-header">未命名审批</div>
            <div class="device-body">
              <div class="device-drop">点击或拖拽左侧控件至此处</div>
              <div class="device-field">
                <span>报销类型</span>
                <div class="device-chip">差旅费</div>
              </div>
              <div class="device-field">
                <span>报销事由</span>
                <div class="device-chip">请输入内容</div>
              </div>
              <div class="device-field">
                <span>金额</span>
                <div class="device-chip">0.00</div>
              </div>
              <div class="device-field">
                <span>附件</span>
                <div class="device-chip">上传文件</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="panel form-settings">
        <div class="panel-header">
          <div>
            <div class="panel-title">字段设置</div>
            <div class="muted">当前选中：数字</div>
          </div>
        </div>
        <div class="panel-body">
          <button class="btn btn-primary" type="button">基础设置</button>
          <div class="field-group">
            <label v-for="setting in fieldSettings" :key="setting.label" class="field">
              <span>{{ setting.label }}</span>
              <input type="text" :value="setting.value" />
            </label>
          </div>
          <div class="panel-divider"></div>
          <div class="setting-block">
            <div class="setting-title">校验规则</div>
            <div class="setting-tags">
              <span class="tag">必填</span>
              <span class="tag">仅数字</span>
              <span class="tag">范围限制</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div v-else class="builder-grid">
      <section class="panel guide-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">流程设计指南</div>
            <div class="muted">拖拽组件快速搭建流程</div>
          </div>
        </div>
        <div class="panel-body">
          <div v-for="card in guideCards" :key="card.title" class="guide-card">
            <div class="guide-title">{{ card.title }}</div>
            <div class="muted">{{ card.desc }}</div>
          </div>
        </div>
        <div class="panel-divider"></div>
        <div class="panel-body">
          <div v-for="block in toolBlocks" :key="block.title" class="tool-group">
            <div class="tool-title">{{ block.title }}</div>
            <div class="tool-items">
              <div v-for="item in block.items" :key="item" class="tool-item">{{ item }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="panel builder-canvas">
        <div class="panel-header">
          <div>
            <div class="panel-title">流程设计画布</div>
            <div class="muted">配置节点与条件分支</div>
          </div>
          <button class="btn btn-ghost" type="button">+ 添加条件</button>
        </div>
        <div class="panel-body">
          <div class="flow-board">
            <div class="flow-node start">提交</div>
            <div class="flow-plus">+</div>
            <div class="flow-node condition">+ 添加条件</div>
            <div class="flow-branches">
              <div class="flow-branch">
                <div class="branch-title">优先级 1</div>
                <div class="branch-node">
                  <div class="branch-label">审批</div>
                  <div class="branch-value">审批人：提交人自选</div>
                </div>
                <div class="flow-plus">+</div>
                <div class="branch-node highlight">
                  <div class="branch-label">审批</div>
                  <div class="branch-value">审批人：部门负责人</div>
                </div>
              </div>
              <div class="flow-branch">
                <div class="branch-title">优先级 2</div>
                <div class="branch-node">
                  <div class="branch-label">审批</div>
                  <div class="branch-value">审批人：财务复核</div>
                </div>
                <div class="flow-plus">+</div>
                <div class="branch-node highlight">
                  <div class="branch-label">审批</div>
                  <div class="branch-value">审批人：总经理</div>
                </div>
              </div>
              <div class="flow-branch">
                <div class="branch-title">默认条件</div>
                <div class="branch-node">
                  <div class="branch-label">审批</div>
                  <div class="branch-value">审批人：默认流程</div>
                </div>
                <div class="flow-plus">+</div>
                <div class="branch-node highlight">
                  <div class="branch-label">抄送</div>
                  <div class="branch-value">抄送人：财务主管</div>
                </div>
              </div>
            </div>
            <div class="flow-plus">+</div>
            <div class="flow-node end">完成</div>
          </div>

          <div class="flow-toolbar">
            <div class="toolbar-title">快速添加节点</div>
            <button class="toolbar-btn" type="button">审批人</button>
            <button class="toolbar-btn" type="button">抄送人</button>
            <button class="toolbar-btn" type="button">办理人</button>
            <button class="toolbar-btn" type="button">条件分支</button>
          </div>
        </div>
      </section>

      <aside class="panel settings-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">发起设置</div>
            <div class="muted">设置谁可以提交此审批</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="setting-block">
            <div class="setting-title">谁可以提交该审批</div>
            <div class="setting-chip">全员</div>
          </div>
          <div class="setting-block">
            <div class="setting-title">抄送人设置</div>
            <div class="setting-list">
              <label v-for="item in approverOptions" :key="item.value" class="radio">
                <input type="radio" :name="'cc'" :checked="item.value === 'leader'" />
                <span>{{ item.label }}</span>
              </label>
            </div>
            <button class="btn btn-ghost" type="button">+ 添加抄送人</button>
          </div>
          <div class="panel-divider"></div>
          <div class="setting-block">
            <div class="setting-title">审批人设置</div>
            <div class="approver-list">
              <div class="approver-item">
                <div>
                  <div class="approver-name">审批节点 1</div>
                  <div class="muted">提交人自选</div>
                </div>
                <button class="btn btn-ghost" type="button">编辑</button>
              </div>
              <div class="approver-item">
                <div>
                  <div class="approver-name">审批节点 2</div>
                  <div class="muted">部门负责人</div>
                </div>
                <button class="btn btn-ghost" type="button">编辑</button>
              </div>
              <div class="approver-item">
                <div>
                  <div class="approver-name">审批节点 3</div>
                  <div class="muted">财务复核</div>
                </div>
                <button class="btn btn-ghost" type="button">编辑</button>
              </div>
            </div>
            <button class="btn btn-primary" type="button">+ 添加审批人</button>
          </div>
          <div class="panel-divider"></div>
          <div class="setting-block">
            <div class="setting-title">提交人可见字段</div>
            <div class="setting-tags">
              <span class="tag">报销类型</span>
              <span class="tag">金额</span>
              <span class="tag">附件</span>
              <span class="tag">备注</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
