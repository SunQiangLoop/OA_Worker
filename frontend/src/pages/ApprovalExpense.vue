<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { approvalApi } from '../services/api'

const router = useRouter()
const submitting = ref(false)
const error = ref('')

const form = reactive({
  applyType: '报销',
  expenseType: '办公费',
  amount: 100,
  applicant: '',
  department: '技术部',
  reason: '',
})

const expenseTypes = ['办公费', '差旅费', '招待费', '物料费', '培训费']
const departments = ['技术部', '产品部', '市场部', '行政部', '财务部']

function adjustAmount(delta) {
  const next = Number(form.amount || 0) + delta
  form.amount = next < 0 ? 0 : next
}

async function submitApproval() {
  error.value = ''
  if (submitting.value) return
  submitting.value = true
  const title = `${form.expenseType}报销`
  const description = `申请人：${form.applicant || '—'}；所属部门：${form.department || '—'}；申请理由：${form.reason || '—'}`
  try {
    await approvalApi.create({
      title,
      type: 'expense',
      amount: Number(form.amount || 0),
      description,
      priority: 'medium',
    })
    router.push('/approvals')
  } catch (err) {
    error.value = '提交失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page expense-page">
    <div class="expense-header">
      <div>
        <h2>发起 OA 审批</h2>
        <p class="page-subtitle">信息完整即可进入审批流程</p>
      </div>
      <span class="badge-available">审批流可用</span>
    </div>

    <section class="panel expense-panel">
      <form class="expense-form" @submit.prevent="submitApproval">
        <div class="form-row">
          <label>申请类型</label>
          <div class="form-control">
            <select v-model="form.applyType">
              <option value="报销">报销</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label>费用类型</label>
          <div class="form-control">
            <select v-model="form.expenseType">
              <option v-for="item in expenseTypes" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label>金额（元）</label>
          <div class="form-control">
            <div class="amount-control">
              <button type="button" class="amount-btn" @click="adjustAmount(-1)">-</button>
              <input v-model.number="form.amount" type="number" min="0" step="1" />
              <button type="button" class="amount-btn" @click="adjustAmount(1)">+</button>
            </div>
          </div>
        </div>

        <div class="form-row">
          <label>申请人</label>
          <div class="form-control">
            <input v-model="form.applicant" type="text" placeholder="例如：张三" />
          </div>
        </div>

        <div class="form-row">
          <label>所属部门</label>
          <div class="form-control">
            <select v-model="form.department">
              <option v-for="item in departments" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <label>申请理由</label>
          <div class="form-control">
            <textarea v-model="form.reason" rows="4"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" type="submit" :disabled="submitting">
            {{ submitting ? '提交中...' : '提交申请' }}
          </button>
          <span v-if="error" class="form-error">{{ error }}</span>
        </div>
      </form>
    </section>
  </div>
</template>
