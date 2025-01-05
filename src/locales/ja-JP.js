export default {
  common: {
    add: '追加',
    edit: '編集',
    delete: '削除',
    cancel: 'キャンセル',
    confirm: '確認',
    search: '検索',
    reset: 'リセット',
    operation: '操作',
    status: 'ステータス',
    save: '保存',
    loading: '読み込み中...',
    systemTitle: 'ECサイト管理システム',
    logout: 'ログアウト',
    home: 'ホーム',
    welcome: 'ようこそ',
    view: '表示',
    process: '処理',
    selectFile: 'ファイル選択',
    file: 'ファイル',
    download: 'ダウンロード',
    yes: 'はい',
    no: 'いいえ',
    createTime: '作成日時',
    updateTime: '更新日時'
  },
  product: {
    list: '商品一覧',
    name: '商品名',
    price: '価格',
    weight: '重量',
    category: 'カテゴリー',
    status: 'ステータス',
    description: '商品説明',
    specifications: '商品仕様',
    addProduct: '商品追加',
    editProduct: '商品編集',
    deleteConfirm: 'この商品を削除してもよろしいですか？',
    addSuccess: '商品を追加しました',
    editSuccess: '商品を更新しました',
    deleteSuccess: '商品を削除しました',
    searchPlaceholder: '商品名を入力',
    deleteFailed: '商品の削除に失敗しました',
    listFailed: '商品一覧の取得に失敗しました',
    getCategoriesFailed: 'カテゴリー一覧の取得に失敗しました',
    selectCategory: 'カテゴリーを選択してください',
    basicInfo: '基本情報',
    specName: '仕様名',
    specValue: '仕様値',
    specNameLabel: '名称',
    specValueLabel: '値',
    addSpecification: '仕様追加',
    atLeastOneName: '少なくとも1つの言語で商品名が必要です',
    saveFailed: '保存に失敗しました',
    updateFailed: '更新に失敗しました',
    addFailed: '追加に失敗しました',
    unknownCategory: '不明なカテゴリー'
  },
  validation: {
    required: '{field}は必須です',
    numeric: '{field}は数値で入力してください',
    min: '{field}は{min}以上で入力してください'
  },
  menu: {
    home: 'ホーム',
    welcome: 'ようこそ',
    crossBorder: {
      title: '越境EC'
    },
    i18n: {
      title: '言語設定',
      languages: '言語一覧'
    },
    exchange: {
      title: '為替レート'
    },
    warehouse: {
      title: '倉庫管理'
    },
    products: {
      title: '商品管理',
      list: '商品一覧',
      categories: 'カテゴリー'
    },
    orders: {
      title: '注文管理',
      list: '注文一覧',
      customs: '通関管理'
    },
    users: {
      title: 'ユーザー管理',
      list: 'ユーザー一覧'
    },
    statistics: {
      title: '統計データ',
      report: 'データレポート'
    }
  },
  exchange: {
    addRate: '為替レート追加',
    editRate: '為替レート編集',
    fromCurrency: '元通貨',
    toCurrency: '対象通貨',
    rate: 'レート',
    isActive: '有効',
    getFailed: '為替レートの取得に失敗しました',
    addSuccess: '為替レートを追加しました',
    addFailed: '為替レートの追加に失敗しました',
    editSuccess: '為替レートを更新しました',
    editFailed: '為替レートの更新に失敗しました',
    statusUpdateSuccess: 'ステータスを更新しました',
    statusUpdateFailed: 'ステータスの更新に失敗しました'
  },
  statistics: {
    overview: '概要',
    totalSales: '総売上高',
    totalOrders: '総注文数',
    totalProducts: '総商品数',
    totalUsers: '総ユーザー数',
    salesTrend: '売上傾向',
    categoryDistribution: 'カテゴリー分布',
    paymentMethods: '支払方法分布',
    week: '今週',
    month: '今月',
    year: '今年',
    getDataFailed: 'データの取得に失敗しました',
    logistics: {
      title: '物流データ',
      cost: '物流コスト',
      time: '配送時間',
      performance: '運送業者パフォーマンス',
      shipmentCount: '配送数',
      avgCost: '平均コスト',
      totalShipments: '総配送数',
      deliveryRate: '配達率',
      exceptionRate: '異常率',
      returnRate: '返品率'
    },
    international: {
      title: '国際販売',
      domestic: '国内販売',
      overseas: '海外販売',
      byCountry: '国別売上',
      byCurrency: '通貨別売上'
    },
    noData: 'データなし',
    orderCount: '注文数',
    amount: '金額',
    amountCNY: '人民元金額',
    productCount: '商品数',
    percentage: '割合'
  }
} 