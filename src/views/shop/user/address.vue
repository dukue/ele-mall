<template>
  <div class="address-container">
    <el-card class="address-card" v-loading="loading">
      <template #header>
        <span>收货地址</span>
        <el-button type="primary" size="small" @click="handleAdd">新增地址</el-button>
      </template>

      <!-- 地址列表 -->
      <div v-if="addresses.length" class="address-list">
        <el-card
          v-for="address in addresses"
          :key="address.id"
          class="address-item"
          shadow="hover"
        >
          <div class="address-info">
            <div class="receiver">
              <span class="name">{{ address.receiverName }}</span>
              <span class="phone">{{ address.receiverPhone }}</span>
              <el-tag size="small" type="success" v-if="address.isDefault">默认地址</el-tag>
            </div>
            <div class="address">
              {{ getFullAddress(address) }}
            </div>
          </div>
          <div class="address-actions">
            <el-button 
              v-if="!address.isDefault"
              type="text"
              @click="handleSetDefault(address.id)">
              设为默认
            </el-button>
            <el-button 
              type="text"
              @click="handleEdit(address)">
              编辑
            </el-button>
            <el-button 
              type="text"
              class="delete-btn"
              @click="handleDelete(address.id)">
              删除
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <el-empty v-else description="暂无收货地址">
        <el-button type="primary" size="small" @click="handleAdd">
          新增地址
        </el-button>
      </el-empty>
    </el-card>

    <!-- 地址编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="showDialog"
      width="500px"
      @closed="resetForm">
      <el-form :model="addressForm" :rules="rules" ref="addressForm" label-width="100px">
        <el-form-item label="收货人" prop="receiverName">
          <el-input v-model="addressForm.receiverName" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="receiverPhone">
          <el-input v-model="addressForm.receiverPhone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" required>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="province">
                <el-input v-model="addressForm.province" placeholder="省"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="city">
                <el-input v-model="addressForm.city" placeholder="市"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="district">
                <el-input v-model="addressForm.district" placeholder="区"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            type="textarea"
            v-model="addressForm.detailAddress"
            :rows="2"
            placeholder="请输入详细地址">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">设为默认收货地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddressManagement',
  data() {
    return {
      loading: false,
      submitting: false,
      addresses: [],
      showDialog: false,
      isEdit: false,
      addressForm: {
        id: null,
        receiverName: '',
        receiverPhone: '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
        isDefault: false
      },
      rules: {
        receiverName: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        receiverPhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        district: [
          { required: true, message: '请输入区/县', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑地址' : '新增地址'
    }
  },
  created() {
    this.getAddresses()
  },
  methods: {
    async getAddresses() {
      this.loading = true
      try {
        const { data } = await this.$store.dispatch('shop/address/getAddresses')
        this.addresses = data.list
      } catch (error) {
        this.$message.error('获取地址列表失败')
      } finally {
        this.loading = false
      }
    },
    getFullAddress(address) {
      return `${address.province}${address.city}${address.district}${address.detailAddress}`
    },
    handleAdd() {
      this.isEdit = false
      this.showDialog = true
    },
    handleEdit(address) {
      this.isEdit = true
      this.addressForm = { ...address }
      this.showDialog = true
    },
    async handleDelete(id) {
      try {
        await this.$confirm('确定要删除该地址吗？', '提示', {
          type: 'warning'
        })
        await this.$store.dispatch('shop/address/deleteAddress', id)
        this.$message.success('删除成功')
        this.getAddresses()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    async handleSetDefault(id) {
      try {
        await this.$store.dispatch('shop/address/updateAddress', id, {
          isDefault: true
        })
        this.$message.success('设置成功')
        this.getAddresses()
      } catch (error) {
        this.$message.error('设置失败')
      }
    },
    async handleSubmit() {
      this.$refs.addressForm.validate(async valid => {
        if (valid) {
          this.submitting = true
          try {
            if (this.isEdit) {
              await this.$store.dispatch('shop/address/updateAddress', this.addressForm.id, this.addressForm)
              this.$message.success('更新成功')
            } else {
              await this.$store.dispatch('shop/address/addAddress', this.addressForm)
              this.$message.success('添加成功')
            }
            this.showDialog = false
            this.getAddresses()
          } catch (error) {
            this.$message.error(error.message || (this.isEdit ? '更新失败' : '添加失败'))
          } finally {
            this.submitting = false
          }
        }
      })
    },
    resetForm() {
      if (this.$refs.addressForm) {
        this.$refs.addressForm.resetFields()
      }
      this.addressForm = {
        id: null,
        receiverName: '',
        receiverPhone: '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
        isDefault: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.address-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .address-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .address-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;

      .address-item {
        .address-info {
          margin-bottom: 15px;

          .receiver {
            margin-bottom: 10px;

            .name {
              font-weight: bold;
              margin-right: 10px;
            }

            .phone {
              color: #606266;
              margin-right: 10px;
            }
          }

          .address {
            color: #606266;
            font-size: 14px;
            line-height: 1.4;
          }
        }

        .address-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          padding-top: 15px;
          border-top: 1px solid #ebeef5;

          .delete-btn {
            color: #f56c6c;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .address-container {
    .address-card {
      .address-list {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style> 