# 数据库表结构设计文档

## 1. 用户表(Users)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| username | STRING | 否 | - | 用户名 |
| password | STRING | 否 | - | 密码 |
| email | STRING | 否 | - | 邮箱 |
| mobile | STRING | 否 | - | 手机号 |
| role | ENUM | 否 | 'user' | 角色(admin/user) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 2. 商品表(Products)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| price | DECIMAL(10,2) | 否 | - | 价格 |
| weight | DECIMAL(10,2) | 否 | - | 重量(kg) |
| status | BOOLEAN | 否 | true | 商品状态 |
| categoryId | INTEGER | 否 | - | 分类ID(外键) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 3. 商品分类表(Categories)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| name | STRING | 否 | - | 分类名称 |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 4. 语言表(Languages)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| code | STRING(2) | 否 | - | 语言代码 |
| name | STRING | 否 | - | 语言名称 |
| isDefault | BOOLEAN | 否 | false | 是否默认语言 |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 5. 商品翻译表(ProductTranslations)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| productId | INTEGER | 否 | - | 商品ID(外键) |
| languageId | INTEGER | 否 | - | 语言ID(外键) |
| name | STRING | 否 | - | 商品名称 |
| description | TEXT | 是 | - | 商品描述 |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 6. 订单表(Orders)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| orderNo | STRING | 否 | - | 订单编号 |
| totalAmount | DECIMAL(10,2) | 否 | - | 订单总额 |
| currency | STRING(3) | 否 | 'CNY' | 币种 |
| status | ENUM | 否 | 'pending' | 订单状态 |
| payMethod | STRING | 否 | - | 支付方式 |
| receiver | STRING | 否 | - | 收货人 |
| phone | STRING | 否 | - | 联系电话 |
| address | STRING | 否 | - | 收货地址 |
| userId | INTEGER | 否 | - | 用户ID(外键) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 7. 订单商品表(OrderProducts)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| OrderId | INTEGER | 否 | - | 订单ID(外键) |
| ProductId | INTEGER | 否 | - | 商品ID(外键) |
| quantity | INTEGER | 否 | - | 数量 |
| price | DECIMAL(10,2) | 否 | - | 单价 |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 8. 汇率表(ExchangeRates)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| fromCurrency | STRING(3) | 否 | - | 原币种 |
| toCurrency | STRING(3) | 否 | - | 目标币种 |
| rate | DECIMAL(10,4) | 否 | - | 汇率 |
| isActive | BOOLEAN | 否 | true | 是否启用 |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 9. 仓库表(Warehouses)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| code | STRING | 否 | - | 仓库编码 |
| name | STRING | 否 | - | 仓库名称 |
| location | STRING | 否 | - | 仓库地址 |
| country | STRING(2) | 否 | - | 所在国家 |
| contact | STRING | 否 | - | 联系人 |
| phone | STRING | 否 | - | 联系电话 |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 10. 库存表(Inventories)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| productId | INTEGER | 否 | - | 商品ID(外键) |
| warehouseId | INTEGER | 否 | - | 仓库ID(外键) |
| quantity | INTEGER | 否 | 0 | 库存数量 |
| safetyStock | INTEGER | 否 | 0 | 安全库存 |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 11. 库存流水表(InventoryTransactions)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| productId | INTEGER | 否 | - | 商品ID(外键) |
| fromWarehouseId | INTEGER | 是 | - | 源仓库ID(外键) |
| toWarehouseId | INTEGER | 是 | - | 目标仓库ID(外键) |
| quantity | INTEGER | 否 | - | 数量 |
| type | ENUM | 否 | - | 类型(in/out/transfer) |
| reason | STRING | 是 | - | 原因说明 |
| operatorId | INTEGER | 否 | - | 操作人ID(外键) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 12. 清关记录表(CustomsClearances)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| orderId | INTEGER | 否 | - | 订单ID(外键) |
| status | ENUM | 否 | 'pending' | 清关状态 |
| declarationNo | STRING(50) | 是 | - | 报关单号 |
| customsOffice | STRING(100) | 是 | - | 海关关区 |
| inspectionNotes | TEXT | 是 | - | 查验备注 |
| operatorId | INTEGER | 否 | - | 操作人ID(外键) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 13. 清关文件表(CustomsDocuments)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| clearanceId | INTEGER | 否 | - | 清关记录ID(外键) |
| type | ENUM | 否 | - | 文件类型 |
| name | STRING(100) | 否 | - | 文件名称 |
| path | STRING(255) | 否 | - | 文件路径 |
| uploaderId | INTEGER | 否 | - | 上传人ID(外键) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 14. 物流追踪表(ShipmentTrackings)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| orderId | INTEGER | 否 | - | 订单ID(外键) |
| trackingNo | STRING(50) | 否 | - | 物流追踪号 |
| carrier | STRING(50) | 否 | - | 承运商 |
| status | ENUM | 否 | 'pending' | 物流状态 |
| estimatedDelivery | DATE | 是 | - | 预计送达时间 |
| originCountry | STRING(2) | 否 | - | 起运国 |
| destinationCountry | STRING(2) | 否 | - | 目的国 |
| operatorId | INTEGER | 否 | - | 操作人ID(外键) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

## 15. 物流历史表(TrackingHistories)
| 字段名 | 类型 | 允许空 | 默认值 | 说明 |
|--------|------|--------|--------|------|
| id | INTEGER | 否 | 自增 | 主键 |
| trackingId | INTEGER | 否 | - | 物流追踪ID(外键) |
| location | STRING(100) | 否 | - | 位置信息 |
| status | STRING(50) | 否 | - | 状态描述 |
| details | TEXT | 是 | - | 详细说明 |
| eventTime | DATE | 否 | - | 事件发生时间 |
| operatorId | INTEGER | 否 | - | 操作人ID(外键) |
| createTime | DATE | 否 | NOW() | 创建时间 |
| updateTime | DATE | 否 | NOW() | 更新时间 |

注意事项:
1. 所有表都包含 createTime 和 updateTime 字段用于记录创建和更新时间
2. 涉及金额的字段使用 DECIMAL 类型以保证精确度
3. 使用外键约束保证数据完整性
4. 状态字段使用 ENUM 类型限制可选值
5. 所有表主键均为自增的 id 字段
