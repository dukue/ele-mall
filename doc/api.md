---
title: 电商毕设
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.23"

---

# 电商毕设

Base URLs:

* <a href="http://localhost:3000/api/v1">开发环境: http://localhost:3000/api/v1</a>

# Authentication

# Default

## POST 登录

POST /auth/login

> Body 请求参数

```
"{\r

\    \"username\": \"admin\",\r

\    \"password\": \"123456\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 是 |none|
|body|body|string| 否 |none|

> 返回示例

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

# 用户

## GET 用户列表

GET /auth/users

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pagenum|query|string| 否 |none|
|pagesize|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 添加用户

POST /auth/users

> Body 请求参数

```
"{\r

\  \"username\": \"test\",\r

\  \"password\": \"123456\",\r

\  \"email\": \"test@test.com\",\r

\  \"mobile\": \"13800138000\",\r

\  \"role\": \"user\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 修改用户

PUT /auth/users/2

> Body 请求参数

```
"{\r

\  \"email\": \"new@test.com\",\r

\  \"mobile\": \"13800138001\",\r

\  \"role\": \"admin\",\r

\  \"status\": true\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除用户

DELETE /auth/users/2

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 用户状态

PUT /auth/users/3/status

> Body 请求参数

```
"{\r\n  \"status\": false\r\n}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 400 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|

# 商品

## GET 商品列表

GET /products

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pagenum|query|string| 否 |none|
|pagesize|query|string| 否 |none|
|query|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "total": 0,
    "products": [
      "string"
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» total|integer|true|none||none|
|»» products|[string]|true|none||none|

## POST 添加商品

POST /products

> Body 请求参数

```
"{\r

\  \"price\": 99.99,\r

\  \"weight\": 1.5,\r

\  \"status\": true,\r

\  \"categoryId\": 1,\r

\  \"translations\": {\r

\    \"zh\": {\r

\      \"name\": \"无线鼠标\",\r

\      \"description\": \"高性能无线鼠标...\",\r

\      \"specifications\": {\r

\        \"color\": \"黑色\",\r

\        \"interface\": \"USB\"\r

\      }\r

\    }\r

\  }\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "price": 0,
    "weight": 0,
    "status": true,
    "description": "string",
    "createTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» price|number|true|none||none|
|»» weight|number|true|none||none|
|»» status|boolean|true|none||none|
|»» description|string|true|none||none|
|»» createTime|string|true|none||none|

## PUT 修改商品

PUT /products/1

> Body 请求参数

```
"{\r

\  \"name\": \"更新的商品\",\r

\  \"price\": 199.99,\r

\  \"weight\": 2.5,\r

\  \"description\": \"更新后的商品描述\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "price": 0,
    "weight": 0,
    "status": true,
    "description": "string",
    "createTime": "string",
    "updateTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» price|number|true|none||none|
|»» weight|number|true|none||none|
|»» status|boolean|true|none||none|
|»» description|string|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## DELETE 删除商品

DELETE /products/1

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|

## PUT 更新商品状态

PUT /products/3/status

> Body 请求参数

```
"{\r\n  \"status\": false\r\n}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "status": true
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» status|boolean|true|none||none|

# 商品/多语言

## GET 指定语言翻译

GET /products/1/translations

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|lang|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "specifications": null,
      "seoTitle": null,
      "seoDescription": null,
      "seoKeywords": null,
      "createTime": "string",
      "updateTime": "string",
      "productId": 0,
      "languageId": 0,
      "Language": {
        "code": "string",
        "name": "string"
      }
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|false|none||none|
|»» name|string|false|none||none|
|»» description|string|false|none||none|
|»» specifications|null|false|none||none|
|»» seoTitle|null|false|none||none|
|»» seoDescription|null|false|none||none|
|»» seoKeywords|null|false|none||none|
|»» createTime|string|false|none||none|
|»» updateTime|string|false|none||none|
|»» productId|integer|false|none||none|
|»» languageId|integer|false|none||none|
|»» Language|object|false|none||none|
|»»» code|string|true|none||none|
|»»» name|string|true|none||none|

## POST 添加新语言翻译

POST /products/1/translations

> Body 请求参数

```
"{\r

\  \"lang\": \"fr\",\r

\  \"name\": \"Souris sans fil\",\r

\  \"description\": \"Souris sans fil haute performance...\",\r

\  \"specifications\": {\r

\    \"color\": \"Noir\",\r

\    \"interface\": \"USB\"\r

\  }\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "productId": "string",
    "languageId": 0,
    "name": "string",
    "description": "string",
    "specifications": {
      "color": "string",
      "interface": "string"
    },
    "updateTime": "string",
    "createTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» productId|string|true|none||none|
|»» languageId|integer|true|none||none|
|»» name|string|true|none||none|
|»» description|string|true|none||none|
|»» specifications|object|true|none||none|
|»»» color|string|true|none||none|
|»»» interface|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» createTime|string|true|none||none|

## PUT 更新翻译

PUT /products/1/translations/fr

> Body 请求参数

```
"{\r

\  \"name\": \"Souris sans fil Pro\",\r

\  \"description\": \"Souris sans fil professionnelle...\",\r

\  \"specifications\": {\r

\    \"color\": \"Noir\",\r

\    \"interface\": \"USB\"\r

\  }\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除翻译

DELETE /products/1/translations/fr

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|

# 商品/分类

## GET 获取分类列表

GET /categories

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "name": "string",
      "createTime": "string",
      "updateTime": "string",
      "productCount": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» productCount|integer|true|none||none|

## POST 创建分类

POST /categories

> Body 请求参数

```
"{\r\n  \"name\": \"生活用品\"\r\n}\r\n"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "updateTime": "string",
    "createTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» createTime|string|true|none||none|

## PUT 更新分类

PUT /categories/1

> Body 请求参数

```
"{\r\n  \"name\": \"数码产品\"\r\n}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "createTime": "string",
    "updateTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## DELETE 删除分类

DELETE /categories/5

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|

# 订单

## GET 订单列表

GET /orders

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pagenum|query|string| 否 |none|
|pagesize|query|string| 否 |none|
|startDate|query|string| 否 |none|
|endDate|query|string| 否 |none|
|query|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "total": 0,
    "orders": [
      {
        "id": 0,
        "orderNo": "string",
        "createTime": "string",
        "totalAmount": "string",
        "status": "string",
        "payMethod": "string",
        "receiver": "string",
        "phone": "string",
        "address": "string",
        "products": [
          {
            "name": null,
            "price": null,
            "quantity": null
          }
        ]
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» total|integer|true|none||none|
|»» orders|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» orderNo|string|true|none||none|
|»»» createTime|string|true|none||none|
|»»» totalAmount|string|true|none||none|
|»»» status|string|true|none||none|
|»»» payMethod|string|true|none||none|
|»»» receiver|string|true|none||none|
|»»» phone|string|true|none||none|
|»»» address|string|true|none||none|
|»»» products|[object]|true|none||none|
|»»»» name|string|true|none||none|
|»»»» price|string|true|none||none|
|»»»» quantity|integer|true|none||none|

## PUT 更新订单状态

PUT /orders/1/status

> Body 请求参数

```
'{"status": "processing"}'

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Content-Type|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "orderNo": "string",
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» orderNo|string|true|none||none|
|»» status|string|true|none||none|

## GET 订单详情

GET /orders/1

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "orderNo": "string",
    "createTime": "string",
    "updateTime": "string",
    "totalAmount": "string",
    "status": "string",
    "payMethod": "string",
    "receiver": "string",
    "phone": "string",
    "address": "string",
    "products": [
      {
        "id": 0,
        "name": "string",
        "price": "string",
        "quantity": 0,
        "subtotal": 0
      }
    ],
    "statusText": "string",
    "payMethodText": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» orderNo|string|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» totalAmount|string|true|none||none|
|»» status|string|true|none||none|
|»» payMethod|string|true|none||none|
|»» receiver|string|true|none||none|
|»» phone|string|true|none||none|
|»» address|string|true|none||none|
|»» products|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» price|string|true|none||none|
|»»» quantity|integer|true|none||none|
|»»» subtotal|number|true|none||none|
|»» statusText|string|true|none||none|
|»» payMethodText|string|true|none||none|

# 订单/海关

## GET 获取清关状态

GET /orders/1/customs

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "orderId": 0,
    "status": "string",
    "declarationNo": null,
    "customsOffice": null,
    "inspectionNotes": null,
    "operatorId": 0,
    "createTime": "string",
    "updateTime": "string",
    "Order": {
      "orderNo": "string"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» orderId|integer|true|none||none|
|»» status|string|true|none||none|
|»» declarationNo|null|true|none||none|
|»» customsOffice|null|true|none||none|
|»» inspectionNotes|null|true|none||none|
|»» operatorId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» Order|object|true|none||none|
|»»» orderNo|string|true|none||none|

## PUT 更新清关状态

PUT /orders/1/customs/status

> Body 请求参数

```
"{\r

\  \"status\": \"submitted\",\r

\  \"declarationNo\": \"CD20240319001\",\r

\  \"customsOffice\": \"上海海关\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "orderId": 0,
    "status": "string",
    "declarationNo": "string",
    "customsOffice": "string",
    "inspectionNotes": null,
    "operatorId": 0,
    "createTime": "string",
    "updateTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» orderId|integer|true|none||none|
|»» status|string|true|none||none|
|»» declarationNo|string|true|none||none|
|»» customsOffice|string|true|none||none|
|»» inspectionNotes|null|true|none||none|
|»» operatorId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## GET 清关文件列表

GET /orders/1/customs/documents

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "clearanceId": 0,
      "type": "string",
      "name": "string",
      "path": "string",
      "uploaderId": 0,
      "createTime": "string",
      "updateTime": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» clearanceId|integer|true|none||none|
|»» type|string|true|none||none|
|»» name|string|true|none||none|
|»» path|string|true|none||none|
|»» uploaderId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## POST 上传清关文件

POST /orders/1/customs/documents

> Body 请求参数

```yaml
file: file://C:\Users\dk\Documents\Adobe\PhotoshopPrefsManager-20210527-131114.log
type: invoice
name: 商业发票

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» file|body|string(binary)| 否 |none|
|» type|body|string| 否 |none|
|» name|body|string| 否 |none|

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "clearanceId": 0,
    "type": "string",
    "name": "string",
    "path": "string",
    "uploaderId": 0,
    "updateTime": "string",
    "createTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» clearanceId|integer|true|none||none|
|»» type|string|true|none||none|
|»» name|string|true|none||none|
|»» path|string|true|none||none|
|»» uploaderId|integer|true|none||none|
|»» updateTime|string|true|none||none|
|»» createTime|string|true|none||none|

# 订单/物流

## GET 获取物流信息

GET /orders/1/tracking

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "orderId": 0,
    "trackingNo": "string",
    "carrier": "string",
    "status": "string",
    "estimatedDelivery": "string",
    "originCountry": "string",
    "destinationCountry": "string",
    "operatorId": 0,
    "createTime": "string",
    "updateTime": "string",
    "Order": {
      "orderNo": "string"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» orderId|integer|true|none||none|
|»» trackingNo|string|true|none||none|
|»» carrier|string|true|none||none|
|»» status|string|true|none||none|
|»» estimatedDelivery|string|true|none||none|
|»» originCountry|string|true|none||none|
|»» destinationCountry|string|true|none||none|
|»» operatorId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» Order|object|true|none||none|
|»»» orderNo|string|true|none||none|

## POST 创建物流信息

POST /orders/1/tracking

> Body 请求参数

```
"{\r

\  \"trackingNo\": \"DHL1234567890\",\r

\  \"carrier\": \"DHL\",\r

\  \"estimatedDelivery\": \"2024-03-26T10:00:00Z\",\r

\  \"originCountry\": \"CN\",\r

\  \"destinationCountry\": \"US\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|array[string]| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 500 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### 返回数据结构

状态码 **500**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|

## PUT 更新物流状态

PUT /orders/1/tracking/TN17346182182642

> Body 请求参数

```
"{\r

\  \"status\": \"arrived\",\r

\  \"location\": \"Los Angeles International Airport\",\r

\  \"details\": \"Package arrived at destination airport\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "orderId": 0,
    "trackingNo": "string",
    "carrier": "string",
    "status": "string",
    "estimatedDelivery": "string",
    "originCountry": "string",
    "destinationCountry": "string",
    "operatorId": 0,
    "createTime": "string",
    "updateTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» orderId|integer|true|none||none|
|»» trackingNo|string|true|none||none|
|»» carrier|string|true|none||none|
|»» status|string|true|none||none|
|»» estimatedDelivery|string|true|none||none|
|»» originCountry|string|true|none||none|
|»» destinationCountry|string|true|none||none|
|»» operatorId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## GET 获取物流历史

GET /orders/1/tracking/history

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "trackingId": 0,
      "location": "string",
      "status": "string",
      "details": "string",
      "eventTime": "string",
      "operatorId": 0,
      "createTime": "string",
      "updateTime": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» trackingId|integer|true|none||none|
|»» location|string|true|none||none|
|»» status|string|true|none||none|
|»» details|string|true|none||none|
|»» eventTime|string|true|none||none|
|»» operatorId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

# 数据统计

## GET 获取概览数据

GET /statistics/overview

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "totalSales": 0,
    "totalOrders": 0,
    "totalProducts": 0,
    "totalUsers": 0,
    "trends": {
      "sales": 0,
      "orders": 0,
      "products": 0,
      "users": 0
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» totalSales|number|true|none||none|
|»» totalOrders|integer|true|none||none|
|»» totalProducts|integer|true|none||none|
|»» totalUsers|integer|true|none||none|
|»» trends|object|true|none||none|
|»»» sales|integer|true|none||none|
|»»» orders|integer|true|none||none|
|»»» products|integer|true|none||none|
|»»» users|integer|true|none||none|

## GET 获取销售数据

GET /statistics/sales

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|range|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "xAxis": [
      "string"
    ],
    "series": [
      0
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» xAxis|[string]|true|none||none|
|»» series|[oneOf]|true|none||none|

*oneOf*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»»» *anonymous*|integer|false|none||none|

*xor*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»»» *anonymous*|number|false|none||none|

## GET 商品分类统计

GET /statistics/categories

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "name": "string",
      "value": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» name|string|true|none||none|
|»» value|integer|true|none||none|

## GET 支付方式统计

GET /statistics/payments

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "name": "string",
      "value": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» name|string|true|none||none|
|»» value|integer|true|none||none|

# 数据统计/物流数据

## GET 获取物流成本统计

GET /statistics/logistics/cost

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "country": "string",
      "carrier": "string",
      "shipmentCount": 0,
      "avgCost": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» country|string|true|none||none|
|»» carrier|string|true|none||none|
|»» shipmentCount|integer|true|none||none|
|»» avgCost|number|true|none||none|

## GET 获取物流时效统计

GET /statistics/logistics/time

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    "string"
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[string]|true|none||none|

## GET 获取承运商绩效统计

GET /statistics/logistics/carrier-performance

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "carrier": "string",
      "totalShipments": 0,
      "deliveredCount": 0,
      "exceptionCount": 0,
      "returnedCount": 0,
      "deliveryRate": 0,
      "exceptionRate": 0,
      "returnRate": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» carrier|string|true|none||none|
|»» totalShipments|integer|true|none||none|
|»» deliveredCount|integer|true|none||none|
|»» exceptionCount|integer|true|none||none|
|»» returnedCount|integer|true|none||none|
|»» deliveryRate|integer|true|none||none|
|»» exceptionRate|integer|true|none||none|
|»» returnRate|integer|true|none||none|

# 数据统计/国际销售数据

## GET 获取国际销售数据

GET /statistics/sales/international

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|startDate|query|string| 否 |none|
|endDate|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "domestic": {
      "amount": 0,
      "count": 0
    },
    "international": {
      "amount": 0,
      "count": 0,
      "yearOverYearGrowth": "string"
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» domestic|object|true|none||none|
|»»» amount|integer|true|none||none|
|»»» count|integer|true|none||none|
|»» international|object|true|none||none|
|»»» amount|integer|true|none||none|
|»»» count|integer|true|none||none|
|»»» yearOverYearGrowth|string|true|none||none|

## GET 获取各国销售数据

GET /statistics/sales/by-country

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|startDate|query|string| 否 |none|
|endDate|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    "string"
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[string]|true|none||none|

## GET 获取各币种销售数据

GET /statistics/sales/by-currency

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "currency": "string",
      "orderCount": 0,
      "totalAmount": 0,
      "totalAmountCNY": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» currency|string|true|none||none|
|»» orderCount|integer|true|none||none|
|»» totalAmount|number|true|none||none|
|»» totalAmountCNY|number|true|none||none|

# 语言

## GET 语言列表

GET /i18n/languages

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "code": "string",
      "name": "string",
      "isDefault": true,
      "isActive": true,
      "createTime": "string",
      "updateTime": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» code|string|true|none||none|
|»» name|string|true|none||none|
|»» isDefault|boolean|true|none||none|
|»» isActive|boolean|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## POST 添加语言

POST /i18n/languages

> Body 请求参数

```
"{\r

\  \"code\": \"fr\",\r

\  \"name\": \"Français\",\r

\  \"isDefault\": false\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "isActive": true,
    "id": 0,
    "code": "string",
    "name": "string",
    "isDefault": true,
    "updateTime": "string",
    "createTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» isActive|boolean|true|none||none|
|»» id|integer|true|none||none|
|»» code|string|true|none||none|
|»» name|string|true|none||none|
|»» isDefault|boolean|true|none||none|
|»» updateTime|string|true|none||none|
|»» createTime|string|true|none||none|

## PUT 更新语言

PUT /i18n/languages/4

> Body 请求参数

```
"{\r

\  \"name\": \"French\",\r

\  \"isDefault\": false\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除语言

DELETE /i18n/languages/4

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|

# 汇率

## GET 汇率列表

GET /exchange/rates

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "fromCurrency": "string",
      "toCurrency": "string",
      "rate": "string",
      "isActive": true,
      "createTime": "string",
      "updateTime": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» fromCurrency|string|true|none||none|
|»» toCurrency|string|true|none||none|
|»» rate|string|true|none||none|
|»» isActive|boolean|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## POST 添加汇率

POST /exchange/rates

> Body 请求参数

```
"{\r

\  \"fromCurrency\": \"GBP\",\r

\  \"toCurrency\": \"CNY\",\r

\  \"rate\": 8.75\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 更新汇率

PUT /exchange/rates/1

> Body 请求参数

```
"{\r\n  \"rate\": 6.45\r\n}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 汇率转换

GET /exchange/convert

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|from|query|string| 否 |none|
|to|query|string| 否 |none|
|amount|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "from": "string",
    "to": "string",
    "amount": 0,
    "rate": "string",
    "convertedAmount": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» from|string|true|none||none|
|»» to|string|true|none||none|
|»» amount|integer|true|none||none|
|»» rate|string|true|none||none|
|»» convertedAmount|integer|true|none||none|

# 仓库

## GET 仓库列表

GET /warehouses

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "code": "string",
      "name": "string",
      "location": "string",
      "country": "string",
      "contact": "string",
      "phone": "string",
      "isActive": true,
      "createTime": "string",
      "updateTime": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» code|string|true|none||none|
|»» name|string|true|none||none|
|»» location|string|true|none||none|
|»» country|string|true|none||none|
|»» contact|string|true|none||none|
|»» phone|string|true|none||none|
|»» isActive|boolean|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## POST 创建仓库

POST /warehouses

> Body 请求参数

```
"{\r

\  \"code\": \"UK001\",\r

\  \"name\": \"London Warehouse\",\r

\  \"location\": \"XXX Street, London\",\r

\  \"country\": \"GB\",\r

\  \"contact\": \"William\",\r

\  \"phone\": \"+44-20-1234-5678\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 201 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "isActive": true,
    "id": 0,
    "code": "string",
    "name": "string",
    "location": "string",
    "country": "string",
    "contact": "string",
    "phone": "string",
    "updateTime": "string",
    "createTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» isActive|boolean|true|none||none|
|»» id|integer|true|none||none|
|»» code|string|true|none||none|
|»» name|string|true|none||none|
|»» location|string|true|none||none|
|»» country|string|true|none||none|
|»» contact|string|true|none||none|
|»» phone|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» createTime|string|true|none||none|

## PUT 更新仓库

PUT /warehouses/1

> Body 请求参数

```
"{\r

\  \"name\": \"Shanghai Main Warehouse\",\r

\  \"location\": \"上海市浦东新区XX路XX号\",\r

\  \"country\": \"CN\",\r

\  \"contact\": \"李四\",\r

\  \"phone\": \"13900139000\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": {
    "id": 0,
    "code": "string",
    "name": "string",
    "location": "string",
    "country": "string",
    "contact": "string",
    "phone": "string",
    "isActive": true,
    "createTime": "string",
    "updateTime": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» code|string|true|none||none|
|»» name|string|true|none||none|
|»» location|string|true|none||none|
|»» country|string|true|none||none|
|»» contact|string|true|none||none|
|»» phone|string|true|none||none|
|»» isActive|boolean|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|

## GET 商品库存

GET /products/1/inventory

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "data": [
    {
      "id": 0,
      "productId": 0,
      "warehouseId": 0,
      "quantity": 0,
      "safetyStock": 0,
      "reservedQuantity": 0,
      "createTime": "string",
      "updateTime": "string",
      "ProductId": 0,
      "WarehouseId": 0,
      "Warehouse": {
        "code": "string",
        "name": "string",
        "location": "string",
        "country": "string"
      }
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» productId|integer|true|none||none|
|»» warehouseId|integer|true|none||none|
|»» quantity|integer|true|none||none|
|»» safetyStock|integer|true|none||none|
|»» reservedQuantity|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» updateTime|string|true|none||none|
|»» ProductId|integer|true|none||none|
|»» WarehouseId|integer|true|none||none|
|»» Warehouse|object|true|none||none|
|»»» code|string|true|none||none|
|»»» name|string|true|none||none|
|»»» location|string|true|none||none|
|»»» country|string|true|none||none|

## PUT 库存调拨

PUT /products/1/inventory/transfer

> Body 请求参数

```
"{\r

\  \"fromWarehouseId\": 2,\r

\  \"toWarehouseId\": 1,\r

\  \"quantity\": 10,\r

\  \"reason\": \"调整库存分布\"\r

}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|Content-Type|header|string| 否 |none|
|body|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|

# 数据模型

