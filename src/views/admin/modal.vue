<script setup lang="ts">
import { h, ref } from 'vue'
import {
  NButton, NDataTable, NForm, NFormItem, NInput, NModal,
  NSelect, useMessage,
} from 'naive-ui'
import type {
  DataTableColumns, DataTableRowKey,
  FormInst,
} from 'naive-ui'
import { t } from '@/locales'
import { createAccountAPI, fetchAccountsAPI, resetPasswordAPI } from '@/api/admin'
import { HoverButton, SvgIcon } from '@/components/common'
import { generateRandomPassword, generateRandomUsername } from '@/utils/generate'
interface Props {
  newVisible: boolean
  resetVisible: boolean
}
interface Account {
  username: string
  password: string
  roleType: number
}
interface AccountData {
  index: number
  id: number
  username: string
  name: string
}
defineProps<Props>()
const emit: (event: string, payload?: any) => void = defineEmits()
const ms = useMessage()
const roleOptions = [{
  label: t('admin.user'),
  value: 10,
}, {
  label: t('admin.vip'),
  value: 20,
}, {
  label: t('admin.admin'),
  value: 100,
}]
const user = ref<Account>({
  username: '',
  password: '',
  roleType: 10,
})
const newFormRef = ref<FormInst | null>(null)
const newRules = {
  username: {
    required: true,
    trigger: 'input',
    message: t('admin.usernameEmptyWarning'),
  },
  password: {
    required: true,
    trigger: 'input',
    message: t('admin.passwordEmptyWarning'),
  },
}

const handleCreateAccount = function (e: Event) {
  e.preventDefault()
  newFormRef.value?.validate((errors) => {
    if (!errors) {
      createAccountAPI(user.value)
        .then(response => response.data)
        .then((data) => {
          if (data.success) {
            ms.success(t('common.addSuccess'))
            emit('closeNew')
          }
          else { ms.error(data.message) }
        }).catch((e) => {
        })
    }
    else {
      
    }
  })
}

const accountDatas = ref()
const createResetColumns = (): DataTableColumns<AccountData> => [
  { type: 'selection' },
  // { title: t('admin.order'), key: 'index', width: '60' },
  { title: t('setting.username'), key: 'username', ellipsis: { tooltip: true } },
  { title: t('setting.name'), key: 'name', ellipsis: { tooltip: true } },
  {
    title: t('common.action'),
    key: 'actions',
    width: '80',
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => reset(row.id, row.username),
        },
        { default: () => t('common.reset') },
      )
    },
  },
]
const accountColumns = createResetColumns()
const checkedRowKeys = ref<DataTableRowKey[]>([])
const choosedUsername = ref<string>('')
const pagination = {
  pageSize: 5,
}
const rowKey = (row: AccountData) => row.id
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeys.value = rowKeys
}
const resetPassword = function () {
  const resetSuccessCb = function () {
    checkedRowKeys.value = []
    choosedUsername.value = ''
    hideResetConfirmModal()
  }
  const username = choosedUsername.value
  resetPasswordAPI(
    checkedRowKeys.value.map((key: DataTableRowKey) => Number(key)))
    .then(response => response.data)
    .then((data) => {
      if (data.success) {
        if (username)
          ms.success(`${t('common.user')} ${username} ${data.message}`)
        else ms.success(data.message)
      }
      else { ms.error(data.message) }
      resetSuccessCb()
    }).catch((e) => {

    })
}
function reset(id: number, username: string) {
  // 执行重置操作，根据需要进行处理
  checkedRowKeys.value = [id]
  choosedUsername.value = username
  resetConfirmVisible.value = true
}
function resetAll() {
  // 执行重置操作，根据需要进行处理
  if (checkedRowKeys.value.length === 0) {
    ms.warning(t('admin.checkItemWarning'))
    return
  }
  choosedUsername.value = ''
  resetConfirmVisible.value = true
}
const handleResetConfirm = function () {
  resetPassword()
}

const renderAcountList = function (searchParams?: string) {
  fetchAccountsAPI(searchParams)
    .then((response) => {
      return response.data
    })
    .then((data) => {
      if (data.success) {
        if (data.data) {
          accountDatas.value
          = data.data.map((item: any, index: number) => ({
              index: index + 1,
              ...item.data,
            }))
        }
      }
      else { ms.error(data.message) }
    }).catch((e) => {
    })
}
const handleModalShow = function () {
  renderAcountList()
}

const searchParams = ref<string>('')
const handleSearchAccounts = function () {
  renderAcountList(searchParams.value)
}

const resetConfirmVisible = ref<boolean>(false)
const hideResetConfirmModal = function () {
  resetConfirmVisible.value = false
}

const genRandomUsername = function () {
  const randomUsername = generateRandomUsername()
  user.value.username = randomUsername
}
const genRandomPassword = function () {
  const randomPassword = generateRandomPassword()
  user.value.password = randomPassword
}
</script>

<template>
  <NModal
    ref="newModal" :show="newVisible" preset="dialog" :show-icon="false"
    :mask-closable="true" :closable="false" :on-mask-click="() => emit('closeNew')"
  >
    <template #header>
      <div class="flex justify-center my-2 mx-auto">
        <h3 class="">
          {{ $t('admin.createNewAccount') }}
        </h3>
      </div>
    </template>
    <template #default>
      <NForm
        ref="newFormRef" :model="user" :rules="newRules" class="flex flex-col gap-2"
        label-placement="left" label-width="auto" :style="{ maxWidth: '640px' }"
      >
        <NFormItem :label="$t('setting.username')" path="username">
          <NInput
            v-model:value="user.username"
            :placeholder="$t('setting.username')"
          >
            <template #suffix>
              <HoverButton class="flex items-center" @click="genRandomUsername">
                <span class="text-lg dark:text-white">
                  <SvgIcon icon="fa6-solid:dice" />
                </span>
              </HoverButton>
            </template>
          </NInput>
        </NFormItem>
        <NFormItem :label="$t('setting.password')" path="password">
          <NInput
            v-model:value="user.password" :placeholder="$t('setting.password')"
            show-password-on="click" type="password"
          >
            <template #suffix>
              <HoverButton class="flex items-center" @click="genRandomPassword">
                <span class="text-lg dark:text-white">
                  <SvgIcon icon="fa6-solid:dice" />
                </span>
              </HoverButton>
            </template>
          </NInput>
        </NFormItem>
        <NFormItem :label="$t('admin.roleType')" path="roleType">
          <NSelect v-model:value="user.roleType" :options="roleOptions" />
        </NFormItem>
        <div class="flex justify-around">
          <NButton
            type="primary" width="80px;" style="width:80px; border-radius: 4px; color: #fff"
            @click="handleCreateAccount"
          >
            {{ $t('common.confirm') }}
          </NButton>
          <NButton
            type="default" width="80px;" style="width:80px; border-radius: 4px;"
            @click="() => emit('closeNew')"
          >
            {{ $t('common.cancel') }}
          </NButton>
        </div>
      </NForm>
    </template>
  </NModal>
  <NModal
    ref="resetModal" :show="resetVisible" preset="dialog" :show-icon="false"
    :mask-closable="true" :closable="false" :on-mask-click="() => emit('closeReset')"
    :on-after-enter="handleModalShow" style="width: 600px;"
  >
    <template #header>
      <div class="flex justify-center my-2 mx-auto">
        <h3 class="">
          {{ $t('admin.chooseAccount') }}
        </h3>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col justify-center">
        <div class="flex justify-between gap-2 items-center">
          <NForm ref="searchInputRef" class="flex gap-2 items-center">
            <NFormItem>
              <NInput
                v-model:value="searchParams"
                :placeholder="$t('admin.searchPlacehoder')"
              />
            </NFormItem>
            <NButton
              type="primary" width="80px;" style="width:80px; border-radius: 4px; color: #fff"
              @click="handleSearchAccounts"
            >
              {{ $t('admin.search') }}
            </NButton>
          </NForm>
          <div>
            <NButton
              type="primary" width="80px;" style="width:80px; border-radius: 4px; color: #fff"
              @click="resetAll"
            >
              {{ $t('admin.resetAll') }}
            </NButton>
          </div>
        </div>
        <NDataTable
          striped
          :bordered="false"
          :single-line="false"
          :columns="accountColumns"
          :data="accountDatas"
          :pagination="pagination"
          :row-key="rowKey"
          @update:checked-row-keys="handleCheck"
        />
      </div>
    </template>
  </NModal>
  <NModal
    ref="resetConfirmModal"
    :show="resetConfirmVisible"
    preset="dialog"
    :show-icon="false"
    style="border-radius: 12px;"
    :title="$t('admin.confirmResetTitle')"
    :content="$t('admin.confirmResetContent')"
    :positive-text="$t('common.reset')"
    :negative-text="$t('common.cancel')"
    :on-positive-click="handleResetConfirm"
    :on-negative-click="hideResetConfirmModal"
    :on-mask-click="hideResetConfirmModal"
    :on-close="hideResetConfirmModal"
  />
</template>
