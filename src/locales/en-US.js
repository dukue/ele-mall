export default {
  common: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    reset: 'Reset',
    operation: 'Operation',
    status: 'Status',
    save: 'Save',
    loading: 'Loading...',
    systemTitle: 'E-commerce Admin System',
    logout: 'Logout',
    logoutSuccess: 'Logout successful',
    logoutFailed: 'Logout failed',
    home: 'Home',
    welcome: 'Welcome',
    view: 'View',
    process: 'Process',
    selectFile: 'Select File',
    file: 'File',
    download: 'Download',
    yes: 'Yes',
    no: 'No',
    createTime: 'Create Time',
    updateTime: 'Update Time'
  },
  product: {
    list: 'Product List',
    name: 'Product Name',
    price: 'Price',
    weight: 'Weight',
    category: 'Category',
    status: 'Status',
    description: 'Description',
    specifications: 'Specifications',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteConfirm: 'Are you sure to delete this product?',
    addSuccess: 'Product added successfully',
    editSuccess: 'Product updated successfully',
    deleteSuccess: 'Product deleted successfully',
    searchPlaceholder: 'Enter product name',
    deleteFailed: 'Failed to delete product',
    listFailed: 'Failed to get product list',
    getCategoriesFailed: 'Failed to get categories',
    selectCategory: 'Please select category',
    basicInfo: 'Basic Info',
    specName: 'Specification Name',
    specValue: 'Specification Value',
    specNameLabel: 'Name',
    specValueLabel: 'Value',
    addSpecification: 'Add Specification',
    atLeastOneName: 'At least one language name is required',
    saveFailed: 'Save failed',
    updateFailed: 'Update failed',
    addFailed: 'Add failed',
    unknownCategory: 'Unknown Category'
  },
  validation: {
    required: '{field} is required',
    numeric: '{field} must be numeric',
    min: '{field} cannot be less than {min}'
  },
  menu: {
    home: 'Home',
    welcome: 'Welcome',
    crossBorder: {
      title: 'Cross Border'
    },
    i18n: {
      title: 'Language',
      languages: 'Language List'
    },
    exchange: {
      title: 'Exchange Rate'
    },
    warehouse: {
      title: 'Warehouse'
    },
    products: {
      title: 'Products',
      list: 'Product List',
      categories: 'Categories'
    },
    orders: {
      title: 'Orders',
      list: 'Order List',
      customs: 'Customs Management'
    },
    users: {
      title: 'Users',
      list: 'User List'
    },
    statistics: {
      title: 'Statistics',
      report: 'Data Report'
    }
  },
  order: {
    orderNo: 'Order No.',
    customer: 'Customer',
    amount: 'Amount',
    status: 'Status',
    createTime: 'Create Time',
    orderDetail: 'Order Detail',
    process: 'Process',
    searchPlaceholder: 'Enter order number',
    statusFilter: 'Status Filter',
    listFailed: 'Failed to get order list',
    processConfirm: 'Are you sure to process this order?',
    processSuccess: 'Order processed successfully',
    processFailed: 'Failed to process order',
    statusMap: {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    basicInfo: 'Basic Info',
    products: 'Products',
    unitPrice: 'Unit Price',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    shippingInfo: 'Shipping Info',
    recipient: 'Recipient',
    phone: 'Phone',
    address: 'Address',
    updateTime: 'Update Time',
    totalAmount: 'Total Amount',
    payMethod: 'Payment Method',
    payMethodMap: {
      alipay: 'Alipay',
      wechat: 'WeChat Pay',
      bank: 'Bank Transfer'
    },
    getDetailFailed: 'Failed to get order detail',
    updateStatusSuccess: 'Order status updated successfully',
    updateStatusFailed: 'Failed to update order status',
    confirmUpdateStatus: 'Are you sure to update order status to {status}?',
    tracking: {
      title: 'Tracking Information',
      trackingNo: 'Tracking No.',
      carrier: 'Carrier',
      status: 'Status',
      estimatedDelivery: 'Est. Delivery',
      originCountry: 'Origin',
      destinationCountry: 'Destination',
      location: 'Location',
      details: 'Details',
      history: 'Tracking History',
      eventTime: 'Time',
      createTracking: 'Create Tracking',
      updateStatus: 'Update Status',
      createSuccess: 'Tracking created successfully',
      createFailed: 'Failed to create tracking',
      updateSuccess: 'Status updated successfully',
      updateFailed: 'Failed to update status',
      statusTypes: {
        pending: 'Pending',
        in_transit: 'In Transit',
        arrived: 'Arrived',
        customs: 'In Customs',
        delivered: 'Delivered',
        exception: 'Exception',
        returned: 'Returned'
      }
    }
  },
  user: {
    username: 'Username',
    password: 'Password',
    email: 'Email',
    mobile: 'Mobile',
    role: 'Role',
    status: 'Status',
    createTime: 'Create Time',
    searchPlaceholder: 'Enter username/email/mobile',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteConfirm: 'Are you sure to delete this user?',
    addSuccess: 'User added successfully',
    editSuccess: 'User updated successfully',
    deleteSuccess: 'User deleted successfully',
    listFailed: 'Failed to get user list',
    addFailed: 'Failed to add user',
    editFailed: 'Failed to update user',
    deleteFailed: 'Failed to delete user',
    usernameLengthTip: 'Username length should be between 3 and 20 characters',
    passwordLengthTip: 'Password length should not be less than 6 characters',
    emailFormatTip: 'Please enter a valid email address',
    mobileFormatTip: 'Please enter a valid mobile number',
    roleMap: {
      admin: 'Administrator',
      user: 'Regular User'
    },
    statusUpdateSuccess: 'User status updated successfully',
    statusUpdateFailed: 'Failed to update user status'
  },
  category: {
    list: 'Category List',
    name: 'Category Name',
    productCount: 'Product Count',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    deleteConfirm: 'Are you sure to delete this category?',
    addSuccess: 'Category added successfully',
    editSuccess: 'Category updated successfully',
    deleteSuccess: 'Category deleted successfully',
    addFailed: 'Failed to add category',
    editFailed: 'Failed to update category',
    deleteFailed: 'Failed to delete category',
    getFailed: 'Failed to get category list',
    nameLengthTip: 'Category name length should be between 2 and 20 characters',
    atLeastOneName: 'At least one language name is required'
  },
  customs: {
    searchPlaceholder: 'Enter order number',
    statusFilter: 'Customs status filter',
    listFailed: 'Failed to get customs list',
    status: 'Customs Status',
    declarationNo: 'Declaration No.',
    customsOffice: 'Customs Office',
    inspectionNotes: 'Inspection Notes',
    documents: 'Documents',
    updateStatus: 'Update Status',
    uploadDocument: 'Upload Document',
    documentType: 'Document Type',
    documentName: 'Document Name',
    updateSuccess: 'Status updated successfully',
    updateFailed: 'Failed to update status',
    uploadSuccess: 'Document uploaded successfully',
    uploadFailed: 'Failed to upload document',
    downloadFailed: 'Failed to download document',
    statusTypes: {
      pending: 'Pending',
      submitted: 'Submitted',
      inspecting: 'Inspecting',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed'
    },
    documentTypes: {
      invoice: 'Commercial Invoice',
      packing_list: 'Packing List',
      declaration: 'Declaration Form',
      inspection_cert: 'Inspection Certificate',
      other: 'Other Documents'
    },
    uploadTip: 'Support PDF, Word, JPG, PNG files, size limit 10MB',
    invalidFileType: 'Invalid file type',
    fileSizeLimit: 'File size cannot exceed 10MB',
    uploadComplete: 'Upload Complete'
  },
  language: {
    code: 'Language Code',
    name: 'Language Name',
    isDefault: 'Default Language',
    isActive: 'Active',
    addLanguage: 'Add Language',
    editLanguage: 'Edit Language',
    deleteLanguage: 'Delete Language',
    deleteConfirm: 'Are you sure to delete this language?',
    addSuccess: 'Language added successfully',
    editSuccess: 'Language updated successfully',
    deleteSuccess: 'Language deleted successfully',
    addFailed: 'Failed to add language',
    editFailed: 'Failed to update language',
    deleteFailed: 'Failed to delete language',
    getFailed: 'Failed to get language list',
    statusUpdateSuccess: 'Language status updated successfully',
    statusUpdateFailed: 'Failed to update language status',
    codeFormatTip: 'Language code format: xx or xx-XX, e.g. zh, en-US'
  },
  exchange: {
    addRate: 'Add Rate',
    editRate: 'Edit Rate',
    fromCurrency: 'From Currency',
    toCurrency: 'To Currency',
    rate: 'Rate',
    isActive: 'Active',
    getFailed: 'Failed to get exchange rates',
    addSuccess: 'Rate added successfully',
    addFailed: 'Failed to add rate',
    editSuccess: 'Rate updated successfully',
    editFailed: 'Failed to update rate',
    statusUpdateSuccess: 'Status updated successfully',
    statusUpdateFailed: 'Failed to update status'
  },
  statistics: {
    overview: 'Overview',
    totalSales: 'Total Sales',
    totalOrders: 'Total Orders',
    totalProducts: 'Total Products',
    totalUsers: 'Total Users',
    salesTrend: 'Sales Trend',
    categoryDistribution: 'Category Distribution',
    paymentMethods: 'Payment Methods',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    getDataFailed: 'Failed to get data',
    logistics: {
      title: 'Logistics Data',
      cost: 'Logistics Cost',
      time: 'Delivery Time',
      performance: 'Carrier Performance',
      shipmentCount: 'Shipment Count',
      avgCost: 'Average Cost',
      totalShipments: 'Total Shipments',
      deliveryRate: 'Delivery Rate',
      exceptionRate: 'Exception Rate',
      returnRate: 'Return Rate'
    },
    international: {
      title: 'International Sales',
      domestic: 'Domestic Sales',
      overseas: 'Overseas Sales',
      byCountry: 'Sales by Country',
      byCurrency: 'Sales by Currency'
    },
    noData: 'No Data',
    orderCount: 'Order Count',
    amount: 'Amount',
    amountCNY: 'Amount (CNY)',
    productCount: 'Product Count',
    percentage: 'Percentage'
  }
} 