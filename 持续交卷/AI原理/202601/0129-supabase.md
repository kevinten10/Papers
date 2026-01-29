# Supabase 使用指南

## 概述

Supabase 是一个开源的后端即服务(BaaS)平台，提供完整的 Postgres 数据库、认证、实时订阅、存储和 Edge Functions 等功能。它被称为"开源的 Firebase 替代品"。

## 核心功能

### 1. Postgres 数据库

Supabase 为每个项目提供完整的 Postgres 数据库，支持：
- 实时数据同步
- 数据库备份
- 40+ Postgres 扩展
- Row Level Security (RLS) 行级安全

### 2. 认证系统

内置完整的用户认证解决方案：
- 邮箱/密码登录
- OAuth 第三方登录 (GitHub, Google 等)
- 魔法链接登录
- 手机号登录

### 3. 实时功能 (Realtime)

- 数据库变更监听 (CDC)
- 广播消息
- 用户在线状态 (Presence)

### 4. 存储服务

- 文件上传/下载
- Bucket 管理
- 图片转换和优化

### 5. Edge Functions

- 无服务器函数
- Deno 运行时
- 全球部署

---

## 快速开始

### 安装客户端

```bash
npm install @supabase/supabase-js
```

### 初始化客户端

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://<project_ref>.supabase.co'
const supabaseKey = '<your-anon-key>'

const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 数据库操作

### 查询数据 (SELECT)

```javascript
// 基础查询
const { data, error } = await supabase
  .from('users')
  .select('*')

// 查询特定列
const { data: users } = await supabase
  .from('users')
  .select('id, email, created_at')

// 关联查询
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

```javascript
// 等于
.eq('status', 'active')

// 不等于
.neq('status', 'deleted')

// 大于/大于等于
.gt('age', 18)
.gte('created_at', '2024-01-01')

// 小于/小于等于
.lt('price', 100)
.lte('quantity', 10)

// 包含在列表中
.in('status', ['active', 'pending'])

// 模糊搜索
.like('name', '%John%')
.ilike('email', '%@GMAIL.COM')  // 不区分大小写

// 范围查询
.range(0, 9)  // 分页：获取第0-9条

// 复杂条件 (OR)
.or('status.eq.featured,priority.gte.5')
```

### 排序和分页

```javascript
const { data } = await supabase
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })  // 降序
  .limit(10)                                   // 限制10条
  .range(0, 9)                                 // 分页
```

### 插入数据 (INSERT)

```javascript
// 插入单条
const { data: newUser, error } = await supabase
  .from('users')
  .insert({
    email: 'newuser@example.com',
    full_name: 'New User',
    age: 30
  })
  .select()
  .single()

// 插入多条
const { data: newUsers } = await supabase
  .from('users')
  .insert([
    { email: 'user1@example.com', full_name: 'User 1' },
    { email: 'user2@example.com', full_name: 'User 2' }
  ])
  .select()
```

### 更新数据 (UPDATE)

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

### 删除数据 (DELETE)

```javascript
const { data: deletedUsers, error } = await supabase
  .from('users')
  .delete()
  .eq('status', 'banned')
  .select()
```

---

## 认证功能

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

// 返回数据
// data.user - 新创建的用户对象
// data.session - 用户会话（如果启用自动登录）
```

### 用户登录

```javascript
// 邮箱密码登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password-123'
})

// 返回数据
// data.user - 认证的用户对象
// data.session.access_token - 访问令牌
// data.session.expires_at - 过期时间戳
```

### OAuth 登录

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
const { data: { user } } = await supabase.auth.getUser()

// 或者从会话中获取
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

## 实时订阅 (Realtime)

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

### 用户在线状态 (Presence)

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

## 存储服务

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

## Edge Functions

### 调用 Edge Function

```javascript
// POST 请求（默认）
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: {
    name: 'Alice',
    message: 'Hello from client'
  },
  headers: {
    'x-custom-header': 'custom-value'
  }
})

// GET 请求
const { data, error } = await supabase.functions.invoke('get-user-data', {
  method: 'GET'
})

// 上传文件
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

## 行级安全 (RLS)

RLS (Row Level Security) 是 Supabase 的安全核心，用于控制用户对数据的访问权限。

### 启用 RLS

```sql
-- 在 SQL 编辑器中执行
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

---

## 最佳实践

### 1. 错误处理

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

### 2. 类型安全 (TypeScript)

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

```javascript
// 组件卸载时取消订阅
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

## 参考资料

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JS 客户端](https://github.com/supabase/supabase-js)
- [PostgREST API 文档](https://postgrest.org/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

---

## 总结

Supabase 提供了完整的后端解决方案：

| 功能 | 说明 |
|------|------|
| **数据库** | 完整的 Postgres，支持 SQL 和 REST API |
| **认证** | 多种登录方式，内置用户管理 |
| **实时** | 数据库变更监听，广播，在线状态 |
| **存储** | 文件上传下载，图片处理 |
| **Edge Functions** | 无服务器函数，全球部署 |
| **安全** | RLS 行级安全，细粒度权限控制 |

适合场景：
- 快速原型开发
- 全栈应用后端
- 实时协作应用
- 需要 Postgres 复杂查询的项目
