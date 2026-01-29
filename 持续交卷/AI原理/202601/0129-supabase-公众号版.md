---
title: 2026-01-29 - Supabase开源BaaS平台完全指南
cover: https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop&crop=center
theme: lapis
processed_at: 2026-01-29T12:00:00Z
source_file: 持续交卷/AI原理/202601/0129-supabase.md
---

# 2026-01-29 - Supabase开源BaaS平台完全指南

![数据库技术](https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop&crop=center)

## 📄 内容概要

Supabase 是一个开源的后端即服务（Backend as a Service，简称 BaaS）平台，为开发者提供完整的 Postgres 数据库、用户认证、实时订阅、文件存储和 Edge Functions 等核心功能。作为 Firebase 的开源替代品，Supabase 以其开放性、灵活性和强大的 PostgreSQL 生态支持，正在成为全栈开发的热门选择。

本文将全面介绍 Supabase 的核心功能和使用方法，涵盖从快速入门到高级特性的完整技术栈，帮助开发者快速构建现代化的全栈应用。

---

## 🚀 Supabase 核心功能概览

Supabase 围绕 PostgreSQL 数据库构建了一套完整的后端服务体系，主要包含以下五大核心模块：

### 1️⃣ Postgres 数据库

每个 Supabase 项目都配备完整的 PostgreSQL 数据库实例，支持实时数据同步、自动备份，以及 40+ 种 PostgreSQL 扩展。其**行级安全（Row Level Security，RLS）**机制为数据访问提供了细粒度的权限控制能力。

### 2️⃣ 认证系统

内置完整的用户认证解决方案，支持多种登录方式：
- 邮箱/密码登录
- OAuth 第三方登录（GitHub、Google 等）
- 魔法链接登录
- 手机号登录

### 3️⃣ 实时功能（Realtime）

基于 PostgreSQL 的逻辑复制机制，Supabase 提供了强大的实时数据同步能力：
- 数据库变更监听（Change Data Capture，CDC）
- 广播消息机制
- 用户在线状态追踪（Presence）

### 4️⃣ 存储服务

提供完整的文件存储解决方案：
- 文件上传与下载
- Bucket（存储桶）管理
- 图片转换和优化处理

### 5️⃣ Edge Functions

基于 Deno 运行时的无服务器函数服务，支持全球部署，可用于处理自定义业务逻辑。

---

## 🛠️ 快速开始

### 安装客户端

首先通过 npm 安装 Supabase JavaScript 客户端：

```bash
npm install @supabase/supabase-js
```

### 初始化客户端

在你的应用中初始化 Supabase 客户端：

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://<project_ref>.supabase.co'
const supabaseKey = '<your-anon-key>'

const supabase = createClient(supabaseUrl, supabaseKey)
```

> **提示**：`project_ref` 和 `anon-key` 可以在 Supabase 控制台的项目设置中获取。

---

## 💾 数据库操作详解

Supabase 提供了简洁直观的 JavaScript API 来操作 PostgreSQL 数据库，无需编写原生 SQL 即可完成大部分 CRUD 操作。

### 查询数据（SELECT）

#### 基础查询

查询表中所有数据：

```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
```

#### 查询特定列

只获取需要的字段，减少数据传输：

```javascript
const { data: users } = await supabase
  .from('users')
  .select('id, email, created_at')
```

#### 关联查询

Supabase 支持通过外键关系进行关联查询，使用简洁的语法获取关联数据：

```javascript
const { data: posts } = await supabase
  .from('posts')
  .select(`
    id,
    title,
    author:users!author_id(id, email, full_name),
    comments(id, content)
  `)
```

### 过滤条件

Supabase 提供了丰富的过滤方法，满足各种查询需求：

| 方法 | 说明 | 示例 |
|------|------|------|
| `.eq()` | 等于 | `.eq('status', 'active')` |
| `.neq()` | 不等于 | `.neq('status', 'deleted')` |
| `.gt()` / `.gte()` | 大于 / 大于等于 | `.gt('age', 18)` |
| `.lt()` / `.lte()` | 小于 / 小于等于 | `.lt('price', 100)` |
| `.in()` | 包含在列表中 | `.in('status', ['active', 'pending'])` |
| `.like()` | 模糊搜索 | `.like('name', '%John%')` |
| `.ilike()` | 不区分大小写模糊搜索 | `.ilike('email', '%@GMAIL.COM')` |
| `.range()` | 范围查询（分页） | `.range(0, 9)` |
| `.or()` | 复杂 OR 条件 | `.or('status.eq.featured,priority.gte.5')` |

### 排序和分页

```javascript
const { data } = await supabase
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })  // 降序排列
  .limit(10)                                   // 限制返回10条
  .range(0, 9)                                 // 分页：获取第0-9条
```

### 插入数据（INSERT）

#### 插入单条记录

```javascript
const { data: newUser, error } = await supabase
  .from('users')
  .insert({
    email: 'newuser@example.com',
    full_name: 'New User',
    age: 30
  })
  .select()
  .single()
```

#### 批量插入

```javascript
const { data: newUsers } = await supabase
  .from('users')
  .insert([
    { email: 'user1@example.com', full_name: 'User 1' },
    { email: 'user2@example.com', full_name: 'User 2' }
  ])
  .select()
```

### 更新数据（UPDATE）

```javascript
const { data: updatedUser, error } = await supabase
  .from('users')
  .update({ 
    status: 'inactive', 
    updated_at: new Date().toISOString() 
  })
  .eq('id', '123e4567-e89b-12d3-a456-426614174000')
  .select()
  .single()
```

### 删除数据（DELETE）

```javascript
const { data: deletedUsers, error } = await supabase
  .from('users')
  .delete()
  .eq('status', 'banned')
  .select()
```

---

## 🔐 认证功能详解

Supabase Auth 提供了完整的用户认证流程，支持多种登录方式。

### 用户注册

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password-123',
  options: {
    data: {
      full_name: 'John Doe',
      age: 25
    },
    emailRedirectTo: 'https://example.com/welcome'
  }
})

// 返回数据说明：
// data.user - 新创建的用户对象
// data.session - 用户会话（如果启用自动登录）
```

### 用户登录

#### 邮箱密码登录

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password-123'
})

// 返回数据说明：
// data.user - 认证的用户对象
// data.session.access_token - 访问令牌
// data.session.expires_at - 过期时间戳
```

#### OAuth 登录

```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',  // 或 'google', 'discord' 等
  options: {
    redirectTo: 'https://example.com/auth/callback',
    scopes: 'repo user'  // 可选的权限范围
  }
})

// 用户将被重定向到 OAuth 提供商的登录页面
```

### 用户登出

```javascript
const { error } = await supabase.auth.signOut()
```

### 获取当前用户

```javascript
// 方式一：直接获取当前用户
const { data: { user } } = await supabase.auth.getUser()

// 方式二：从会话中获取
const { data: { session } } = await supabase.auth.getSession()
const user = session?.user
```

### 监听认证状态变化

```javascript
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  console.log('Session:', session)
  
  if (event === 'SIGNED_IN') {
    // 用户登录
  } else if (event === 'SIGNED_OUT') {
    // 用户登出
  }
})
```

---

## ⚡ 实时订阅（Realtime）

Supabase Realtime 基于 PostgreSQL 的逻辑复制功能，允许客户端实时监听数据库变更。

### 监听数据库变更

```javascript
// 创建频道
const channel = supabase.channel('db-changes')

// 监听所有变更
channel.on('postgres_changes', { 
  event: '*', 
  schema: 'public' 
}, (payload) => {
  console.log('所有变更:', payload)
})

// 监听特定表的插入事件
channel.on('postgres_changes', { 
  event: 'INSERT', 
  schema: 'public', 
  table: 'messages' 
}, (payload) => {
  console.log('新消息:', payload)
})

// 监听带过滤条件的更新
channel.on('postgres_changes', { 
  event: 'UPDATE', 
  schema: 'public', 
  table: 'users', 
  filter: 'username=eq.Realtime' 
}, (payload) => {
  console.log('用户更新:', payload)
})

// 订阅频道
channel.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    console.log('已连接到实时服务!')
  }
})
```

### 用户在线状态（Presence）

Presence 功能用于追踪频道内用户的在线状态：

```javascript
const channel = supabase.channel('presence-test', {
  config: {
    presence: {
      key: '',
    },
  },
})

// 同步状态
channel.on('presence', { event: 'sync' }, () => {
  console.log('在线用户:', channel.presenceState())
})

// 用户加入
channel.on('presence', { event: 'join' }, ({ newPresences }) => {
  console.log('新用户加入:', newPresences)
})

// 用户离开
channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
  console.log('用户离开:', leftPresences)
})

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({ user_id: 1, status: 'online' })
  }
})
```

---

## 📦 存储服务

Supabase Storage 提供了完整的文件存储和管理功能。

### 上传文件

```javascript
const file = new File(['content'], 'profile.jpg', { type: 'image/jpeg' })

const { data: uploadData, error } = await supabase
  .storage
  .from('avatars')                    // bucket 名称
  .upload('user-123/profile.jpg', file, {
    cacheControl: '3600',             // 缓存时间
    upsert: false,                    // 是否覆盖已存在文件
    contentType: 'image/jpeg'         // 文件类型
  })

if (uploadData) {
  console.log('文件路径:', uploadData.path)
  console.log('Bucket ID:', uploadData.bucketId)
}
```

### 下载文件

```javascript
const { data: downloadedFile, error } = await supabase
  .storage
  .from('avatars')
  .download('user-123/profile.jpg')

if (downloadedFile) {
  const blob = downloadedFile
  const url = URL.createObjectURL(blob)
  console.log('文件URL:', url)
}
```

### 获取公开访问URL

```javascript
const { data } = supabase
  .storage
  .from('avatars')
  .getPublicUrl('user-123/profile.jpg')

console.log('公开URL:', data.publicUrl)
```

### 删除文件

```javascript
const { data, error } = await supabase
  .storage
  .from('avatars')
  .remove(['user-123/profile.jpg'])
```

### Bucket 管理

```javascript
// 创建 bucket
const { data: bucket, error } = await supabase
  .storage
  .createBucket('avatars', {
    public: true,           // 是否公开
    fileSizeLimit: 1024     // 文件大小限制 (KB)
  })

// 清空 bucket
const { data, error } = await supabase
  .storage
  .emptyBucket('temp-bucket')

// 删除 bucket
const { data, error } = await supabase
  .storage
  .deleteBucket('temp-bucket')
```

---

## 🔧 Edge Functions

Edge Functions 是 Supabase 的无服务器函数服务，基于 Deno 运行时。

### 调用 Edge Function

#### POST 请求（默认）

```javascript
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: {
    name: 'Alice',
    message: 'Hello from client'
  },
  headers: {
    'x-custom-header': 'custom-value'
  }
})
```

#### GET 请求

```javascript
const { data, error } = await supabase.functions.invoke('get-user-data', {
  method: 'GET'
})
```

#### 上传文件

```javascript
const fileToUpload = new File(['file content'], 'document.pdf', { type: 'application/pdf' })

const { data, error } = await supabase.functions.invoke('process-file', {
  body: fileToUpload,
  headers: {
    'Content-Type': 'application/pdf'
  }
})
```

### 错误处理

```javascript
const { data, error } = await supabase.functions.invoke('my-function', {
  body: { input: 'data' }
})

if (error) {
  console.error('状态码:', error.status)
  console.error('错误信息:', error.message)
  console.error('上下文:', error.context)
}
```

---

## 🛡️ 行级安全（RLS）

RLS（Row Level Security）是 Supabase 的安全核心机制，用于控制用户对数据的访问权限。启用 RLS 后，所有对表的访问都必须通过策略（Policy）进行授权。

### 启用 RLS

在 Supabase SQL 编辑器中执行：

```sql
-- 启用表的行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 创建策略

```sql
-- 允许用户查看自己的数据
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 允许用户更新自己的数据
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- 允许已认证用户插入数据
CREATE POLICY "Authenticated users can insert" ON posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

> **安全提示**：RLS 策略是保护数据安全的关键，建议在正式环境中为所有表启用 RLS 并配置合适的访问策略。

---

## ⭐ 最佳实践

### 1. 错误处理

始终检查操作返回的 error 对象：

```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')

if (error) {
  console.error('查询错误:', error.message)
  return
}

// 处理数据
console.log(data)
```

### 2. 类型安全（TypeScript）

为 Supabase 客户端添加类型定义，获得完整的类型支持：

```typescript
import { createClient } from '@supabase/supabase-js'

interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
        }
        Insert: {
          email: string
          full_name: string
        }
        Update: {
          email?: string
          full_name?: string
        }
      }
    }
  }
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)
```

### 3. 订阅清理

在 React 等框架中，组件卸载时记得清理订阅：

```javascript
useEffect(() => {
  const channel = supabase
    .channel('table-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, callback)
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

---

## 📚 参考资料

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JS 客户端](https://github.com/supabase/supabase-js)
- [PostgREST API 文档](https://postgrest.org/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

---

## 💭 总结与思考

Supabase 作为开源的 BaaS 平台，为开发者提供了一套完整且强大的后端解决方案。其核心优势在于：

| 功能模块 | 核心价值 |
|---------|---------|
| **Postgres 数据库** | 完整的 PostgreSQL 支持，兼具 SQL 灵活性和 REST API 便捷性 |
| **认证系统** | 多种登录方式，开箱即用的用户管理 |
| **实时功能** | 基于 PostgreSQL 逻辑复制的实时数据同步 |
| **存储服务** | 完整的文件存储和管理能力 |
| **Edge Functions** | Deno 驱动的无服务器函数，全球部署 |
| **RLS 安全** | 细粒度的行级安全控制 |

### 适用场景

Supabase 特别适合以下类型的项目：

- **快速原型开发**：快速搭建 MVP，验证产品想法
- **全栈应用后端**：为 Web 和移动应用提供完整后端支持
- **实时协作应用**：利用 Realtime 功能构建多人协作工具
- **复杂查询需求**：需要 PostgreSQL 强大查询能力的项目

### 技术展望

随着无服务器架构和实时应用需求的持续增长，Supabase 凭借其开源特性和 PostgreSQL 生态的深度整合，有望在后端服务领域占据更重要的位置。对于追求数据主权和避免厂商锁定的团队来说，Supabase 提供了一个理想的解决方案。

![技术未来](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=center)

---

*本文基于 Supabase 官方文档整理，旨在帮助开发者快速掌握 Supabase 的核心功能和使用方法。*
