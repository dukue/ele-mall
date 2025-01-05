export default {
  common: {
    add: '添加',
    edit: '编辑',
    delete: '删除',
    cancel: '取消',
    confirm: '确定',
    search: '搜索',
    reset: '重置',
    operation: '操作',
    status: '状态',
    save: '保存',
    loading: '加载中...',
    systemTitle: '电商后台管理系统',
    logout: '退出登录',
    home: '首页',
    welcome: '欢迎页面',
    view: '查看',
    process: '处理',
    selectFile: '选择文件',
    file: '文件',
    download: '下载',
    yes: '是',
    no: '否',
    startDate: '开始日期',
    endDate: '结束日期',
    createTime: '创建时间',
    updateTime: '更新时间'
  },
  product: {
    list: '商品列表',
    name: '商品名称',
    price: '商品价格',
    weight: '商品重量',
    category: '商品分类',
    status: '商品状态',
    description: '商品描述',
    specifications: '规格参数',
    addProduct: '添加商品',
    editProduct: '编辑商品',
    deleteConfirm: '确定要删除该商品吗？',
    addSuccess: '添加商品成功',
    deleteSuccess: '删除商品成功',
    searchPlaceholder: '请输入商品名称',
    deleteFailed: '删除商品失败',
    listFailed: '获取商品列表失败',
    getCategoriesFailed: '获取分类列表失败',
    selectCategory: '请选择分类',
    basicInfo: '基本信息',
    specName: '规格名称',
    specValue: '规格值',
    specNameLabel: '名称',
    specValueLabel: '值',
    addSpecification: '添加规格',
    atLeastOneName: '至少需要一种语言的商品名称',
    saveFailed: '保存失败',
    updateFailed: '更新失败',
    addFailed: '添加失败',
    unknownCategory: '未知分类',
    inventory: '库存管理',
    getDetailFailed: '获取商品详情失败',
    editSuccess: '编辑商品成功',
    editFailed: '编辑商品失败'
  },
  validation: {
    required: '{field}不能为空',
    numeric: '{field}必须是数字',
    min: '{field}不能小于{min}'
  },
  menu: {
    home: '首页',
    welcome: '欢迎页面',
    crossBorder: {
      title: '跨境管理'
    },
    i18n: {
      title: '语言管理',
      languages: '语言列表'
    },
    exchange: {
      title: '汇率管理'
    },
    warehouse: {
      title: '仓库管理'
    },
    products: {
      title: '商品管理',
      list: '商品列表',
      categories: '分类管理'
    },
    orders: {
      title: '订单管理',
      list: '订单列表',
      customs: '清关管理'
    },
    users: {
      title: '用户管理',
      list: '用户列表'
    },
    statistics: {
      title: '数据统计',
      report: '数据报表'
    }
  },
  category: {
    list: '分类列表',
    name: '分类名称',
    productCount: '商品数量',
    addCategory: '添加分类',
    editCategory: '编辑分类',
    deleteCategory: '删除分类',
    deleteConfirm: '确定要删除该分类吗？',
    addSuccess: '添加分类成功',
    editSuccess: '编辑分类成功',
    deleteSuccess: '删除分类成功',
    addFailed: '添加分类失败',
    editFailed: '编辑分类失败',
    deleteFailed: '删除分类失败',
    getFailed: '获取分类列表失败',
    nameLengthTip: '分类名称长度在 2 到 20 个字符',
    atLeastOneName: '至少需要一种语言的分类名称',
    description: '分类描述'
  },
  order: {
    orderNo: '订单编号',
    customer: '客户',
    amount: '订单金额',
    status: '订单状态',
    createTime: '创建时间',
    orderDetail: '订单详情',
    process: '处理',
    searchPlaceholder: '请输入订单编号',
    statusFilter: '订单状态筛选',
    listFailed: '获取订单列表失败',
    processConfirm: '确定要处理该订单吗？',
    processSuccess: '订单处理成功',
    processFailed: '订单处理失败',
    statusMap: {
      pending: '待发货',
      processing: '已发货',
      completed: '已完成',
      cancelled: '已取消'
    },
    basicInfo: '基本信息',
    products: '商品信息',
    unitPrice: '单价',
    quantity: '数量',
    subtotal: '小计',
    shippingInfo: '收货信息',
    recipient: '收货人',
    phone: '联系电话',
    address: '收货地址',
    updateTime: '更新时间',
    totalAmount: '订单总额',
    payMethod: '支付方式',
    payMethodMap: {
      alipay: '支付宝',
      wechat: '微信支付',
      bank: '银行转账'
    },
    getDetailFailed: '获取订单详情失败',
    updateStatusSuccess: '更新订单状态成功',
    updateStatusFailed: '更新订单状态失败',
    confirmUpdateStatus: '确定要将订单状态更新为{status}吗？',
    tracking: {
      title: '物流信息',
      trackingNo: '物流单号',
      carrier: '承运商',
      status: '物流状态',
      estimatedDelivery: '预计送达',
      originCountry: '始发国',
      destinationCountry: '目的国',
      location: '当前位置',
      details: '详细信息',
      history: '物流历史',
      eventTime: '时间',
      createTracking: '创建物流',
      updateStatus: '更新状态',
      createSuccess: '创建物流信息成功',
      createFailed: '创建物流信息失败',
      updateSuccess: '更新物流状态成功',
      updateFailed: '更新物流状态失败',
      statusTypes: {
        pending: '待发货',
        in_transit: '运输中',
        customs: '海关清关',
        arrived: '已到达',
        delivered: '已送达',
        exception: '异常',
        returned: '已退回'
      }
    },
    orderCount: '订单数',
    amountCNY: '人民币金额'
  },
  user: {
    username: '用户名',
    password: '密码',
    email: '邮箱',
    mobile: '手机号',
    role: '角色',
    status: '状态',
    createTime: '创建时间',
    searchPlaceholder: '请输入用户名/邮箱/手机号',
    addUser: '添加用户',
    editUser: '编辑用户',
    deleteConfirm: '确定要删除该用户吗？',
    addSuccess: '添加用户成功',
    editSuccess: '编辑用户成功',
    deleteSuccess: '删除用户成功',
    listFailed: '获取用户列表失败',
    addFailed: '添加用户失败',
    editFailed: '编辑用户失败',
    deleteFailed: '删除用户失败',
    usernameLengthTip: '用户名长度在 3 到 20 个字符',
    passwordLengthTip: '密码长度不能小于 6 个字符',
    emailFormatTip: '请输入正确的邮箱地址',
    mobileFormatTip: '请输入正确的手机号',
    roleMap: {
      admin: '管理员',
      user: '普通用户'
    },
    statusUpdateSuccess: '用户状态更新成功',
    statusUpdateFailed: '用户状态更新失败'
  },
  customs: {
    searchPlaceholder: '请输入订单编号',
    statusFilter: '清关状态筛选',
    listFailed: '获取清关列表失败',
    status: '清关状态',
    declarationNo: '报关单号',
    customsOffice: '海关机构',
    inspectionNotes: '查验记录',
    documents: '清关文件',
    updateStatus: '更新状态',
    uploadDocument: '上传文件',
    documentType: '文件类型',
    documentName: '文件名称',
    updateSuccess: '状态更新成功',
    updateFailed: '状态更新失败',
    uploadSuccess: '文件上传成功',
    uploadFailed: '文件上传失败',
    downloadFailed: '文件下载失败',
    statusTypes: {
      pending: '待清关',
      submitted: '已提交',
      inspecting: '查验中',
      approved: '已放行',
      rejected: '已拒绝',
      completed: '已完成'
    },
    documentTypes: {
      invoice: '商业发票',
      packing_list: '装箱单',
      declaration: '报关单',
      inspection_cert: '查验证书',
      other: '其他文件'
    },
    uploadTip: '支持 PDF、Word、JPG、PNG 格式文件，文件大小不超过 10MB',
    invalidFileType: '不支持的文件类型',
    fileSizeLimit: '文件大小不能超过 10MB',
    uploadComplete: '上传完成'
  },
  language: {
    code: '语言代码',
    name: '语言名称',
    isDefault: '默认语言',
    isActive: '是否启用',
    addLanguage: '添加语言',
    editLanguage: '编辑语言',
    deleteLanguage: '删除语言',
    deleteConfirm: '确定要删除该语言吗？',
    addSuccess: '添加语言成功',
    editSuccess: '编辑语言成功',
    deleteSuccess: '删除语言成功',
    addFailed: '添加语言失败',
    editFailed: '编辑语言失败',
    deleteFailed: '删除语言失败',
    getFailed: '获取语言列表失败',
    statusUpdateSuccess: '语言状态更新成功',
    statusUpdateFailed: '语言状态更新失败',
    codeFormatTip: '语言代码格式为：xx 或 xx-XX，如：zh、en-US'
  },
  exchange: {
    addRate: '添加汇率',
    editRate: '编辑汇率',
    fromCurrency: '原币种',
    toCurrency: '目标币种',
    rate: '汇率',
    isActive: '是否启用',
    getFailed: '获取汇率列表失败',
    addSuccess: '添加汇率成功',
    addFailed: '添加汇率失败',
    editSuccess: '编辑汇率成功',
    editFailed: '编辑汇率失败',
    statusUpdateSuccess: '更新状态成功',
    statusUpdateFailed: '更新状态失败',
    currency: '币种'
  },
  warehouse: {
    title: '仓库管理',
    code: '仓库编码',
    name: '仓库名称',
    location: '位置',
    country: '国家',
    contact: '联系人',
    phone: '联系电话',
    status: '状态',
    active: '正常',
    inactive: '维护中',
    add: '添加仓库',
    edit: '编辑仓库',
    deleteConfirm: '确定要删除仓库 "{name}" 吗？',
    addSuccess: '添加仓库成功',
    editSuccess: '编辑仓库成功',
    deleteSuccess: '删除仓库成功',
    listFailed: '获取仓库列表失败',
    addFailed: '添加仓库失败',
    updateFailed: '更新仓库失败',
    deleteFailed: '删除仓库失败'
  },
  inventory: {
    title: '库存管理',
    transfer: '调拨',
    transferTitle: '库存调拨',
    fromWarehouse: '调出仓库',
    toWarehouse: '调入仓库',
    quantity: '调拨数量',
    reason: '调拨原因',
    outOfStock: '无可用库存',
    lowStock: '库存不足',
    sufficient: '库存充足',
    getFailed: '获取库存信息失败',
    transferSuccess: '库存调拨成功',
    transferFailed: '库存调拨失败',
    add: '添加库存',
    selectWarehouse: '选择仓库',
    safetyStock: '安全库存',
    invalidData: '请检查库存数据是否正确',
    noData: '暂无库存数据，点击下方按钮添加'
  },
  statistics: {
    overview: '数据概览',
    totalSales: '总销售额',
    totalOrders: '总订单数',
    totalProducts: '商品总数',
    totalUsers: '用户总数',
    salesTrend: '销售趋势',
    categoryDistribution: '分类分布',
    paymentMethods: '支付方式分布',
    week: '本周',
    month: '本月',
    year: '本年',
    getDataFailed: '获取数据失败',
    logistics: {
      title: '物流数据',
      cost: '物流成本',
      time: '物流时效',
      performance: '承运商绩效',
      shipmentCount: '运单数',
      avgCost: '平均成本',
      totalShipments: '总运单数',
      deliveryRate: '送达率',
      exceptionRate: '异常率',
      returnRate: '退回率'
    },
    international: {
      title: '国际销售',
      domestic: '国内销售',
      overseas: '海外销售',
      byCountry: '各国销售',
      byCurrency: '各币种销售'
    },
    noData: '暂无数据',
    orderCount: '订单数',
    amount: '金额',
    amountCNY: '人民币金额',
    productCount: '商品数量',
    percentage: '占比'
  }
} 