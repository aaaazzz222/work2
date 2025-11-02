# Portfolio & Blog RESTful API

一个功能完整的个人作品集和博客后端 API，使用 Node.js、Express 和 MongoDB Atlas 构建。

## 🚀 技术栈

- **Node.js** - JavaScript 运行时
- **Express.js** - Web 应用框架
- **MongoDB Atlas** - 云数据库
- **Mongoose** - MongoDB 对象建模
- **JWT** - 身份验证
- **bcryptjs** - 密码加密
- **Helmet** - 安全中间件
- **express-validator** - 输入验证

## 📋 功能特性

### 用户系统
- 用户注册和登录
- JWT 身份验证
- 密码加密存储
- 用户资料管理
- 角色权限控制（用户/管理员）

### 作品集管理
- 创建、查看、更新、删除项目
- 项目分类（web、mobile、desktop、ai/ml、other）
- 项目状态管理（已完成、进行中、计划中）
- 项目搜索和筛选
- 项目浏览统计和点赞

### 博客系统
- 发布、编辑、删除博客文章
- 文章分类和标签系统
- 文章状态管理（发布/草稿）
- 评论系统（支持回复）
- 文章浏览统计和点赞
- 阅读时间估算

### 联系表单
- 访客留言功能
- 消息管理和统计
- 消息优先级设置
- 已读/未读状态管理
- 归档功能

## 🛠️ 安装和设置

### 1. 克隆项目
```bash
git clone https://github.com/aaaazzz222/work2.git
cd portfolio-blog-api
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境变量设置
创建 `.env` 文件：
```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio-blog-api?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 4. 运行项目
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器将在 http://localhost:5000 启动

## 📚 API 端点

### 用户认证

#### 用户注册
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "bio": "Web Developer"
}
```

#### 用户登录
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 获取当前用户信息
```
GET /api/users/me
Authorization: Bearer <token>
```

#### 更新用户资料
```
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "bio": "Full Stack Developer",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### 修改密码
```
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### 项目管理

#### 获取所有项目
```
GET /api/projects?page=1&limit=10&category=web&featured=true&search=react
```

#### 获取单个项目
```
GET /api/projects/:id
```

#### 创建项目（需要登录）
```
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Awesome Project",
  "description": "A detailed description of the project...",
  "shortDescription": "Brief description",
  "imageUrl": "https://example.com/image.jpg",
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/username/repo",
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "web",
  "status": "completed",
  "tags": ["frontend", "fullstack"]
}
```

#### 更新项目（需要登录）
```
PUT /api/projects/:id
Authorization: Bearer <token>
```

#### 删除项目（需要登录）
```
DELETE /api/projects/:id
Authorization: Bearer <token>
```

#### 点赞项目
```
PUT /api/projects/:id/like
```

#### 获取项目分类
```
GET /api/projects/categories
```

### 博客文章

#### 获取所有文章
```
GET /api/blog?page=1&limit=10&category=technology&search=javascript&tags=react,nodejs
```

#### 获取单篇文章
```
GET /api/blog/:id
```

#### 创建文章（需要登录）
```
POST /api/blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "Full blog post content...",
  "excerpt": "Brief excerpt of the post",
  "featuredImage": "https://example.com/image.jpg",
  "category": "technology",
  "tags": ["javascript", "nodejs"],
  "published": true,
  "seoTitle": "My First Blog Post - Portfolio",
  "seoDescription": "A comprehensive guide to..."
}
```

#### 更新文章（需要登录）
```
PUT /api/blog/:id
Authorization: Bearer <token>
```

#### 删除文章（需要登录）
```
DELETE /api/blog/:id
Authorization: Bearer <token>
```

#### 点赞文章
```
PUT /api/blog/:id/like
```

#### 获取文章分类
```
GET /api/blog/categories
```

#### 获取热门标签
```
GET /api/blog/tags
```

### 评论系统

#### 获取文章评论
```
GET /api/blog/:postId/comments?page=1&limit=20
```

#### 创建评论（需要登录）
```
POST /api/blog/:postId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great article! Thanks for sharing.",
  "parentComment": null  // 如果是回复其他评论，提供父评论ID
}
```

#### 更新评论（需要登录）
```
PUT /api/blog/:postId/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

#### 删除评论（需要登录）
```
DELETE /api/blog/:postId/comments/:id
Authorization: Bearer <token>
```

#### 点赞评论
```
PUT /api/blog/:postId/comments/:id/like
```

### 联系表单

#### 发送消息
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your work...",
  "phone": "+1234567890",
  "company": "ABC Company"
}
```

#### 获取所有消息（仅管理员）
```
GET /api/contact?page=1&limit=20&isRead=false&priority=high&search=project
Authorization: Bearer <admin-token>
```

#### 获取消息统计（仅管理员）
```
GET /api/contact/stats
Authorization: Bearer <admin-token>
```

#### 标记消息为已读（仅管理员）
```
PUT /api/contact/:id/read
Authorization: Bearer <admin-token>
```

#### 归档/取消归档消息（仅管理员）
```
PUT /api/contact/:id/archive
Authorization: Bearer <admin-token>
```

#### 更新消息优先级（仅管理员）
```
PUT /api/contact/:id/priority
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "priority": "high"  // low, normal, high, urgent
}
```

#### 删除消息（仅管理员）
```
DELETE /api/contact/:id
Authorization: Bearer <admin-token>
```

### 健康检查
```
GET /api/health
```

## 🔒 安全特性

- **Helmet**: 安全头部设置
- **JWT**: 安全的身份验证
- **bcrypt**: 密码加密存储
- **Rate Limiting**: API 请求频率限制
- **CORS**: 跨域资源共享配置
- **Input Validation**: 严格的输入验证
- **Role-based Access**: 基于角色的权限控制

## 📊 数据模型

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  avatar: String,
  role: String (user/admin),
  isActive: Boolean
}
```

### Project Model
```javascript
{
  title: String,
  description: String,
  shortDescription: String,
  technologies: [String],
  imageUrl: String,
  liveUrl: String,
  githubUrl: String,
  featured: Boolean,
  category: String,
  status: String,
  author: ObjectId (ref: User),
  tags: [String],
  views: Number,
  likes: Number
}
```

### BlogPost Model
```javascript
{
  title: String,
  slug: String (unique),
  content: String,
  excerpt: String,
  featuredImage: String,
  author: ObjectId (ref: User),
  category: String,
  tags: [String],
  published: Boolean,
  publishedAt: Date,
  views: Number,
  likes: Number,
  readTime: Number,
  commentsCount: Number
}
```

### Comment Model
```javascript
{
  content: String,
  author: ObjectId (ref: User),
  blogPost: ObjectId (ref: BlogPost),
  parentComment: ObjectId (ref: Comment),
  replies: [ObjectId] (ref: Comment),
  isApproved: Boolean,
  likes: Number,
  isEdited: Boolean
}
```

### Message Model
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  phone: String,
  company: String,
  isRead: Boolean,
  isArchived: Boolean,
  priority: String,
  source: String,
  ipAddress: String,
  userAgent: String
}
```

## 🌐 部署

### 部署到 Render

1. 将代码推送到 GitHub
2. 在 Render 创建新的 Web Service
3. 连接 GitHub 仓库
4. 设置环境变量
5. 部署完成

### 部署到 Heroku

1. 安装 Heroku CLI
2. 创建 Heroku 应用
3. 设置环境变量
4. 推送代码到 Heroku
5. 启动应用

## 📝 项目结构

```
portfolio-blog-api/
├── controllers/         # 控制器
│   ├── userController.js
│   ├── projectController.js
│   ├── blogController.js
│   ├── commentController.js
│   └── contactController.js
├── models/              # 数据模型
│   ├── User.js
│   ├── Project.js
│   ├── BlogPost.js
│   ├── Comment.js
│   └── Message.js
├── routes/              # 路由定义
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   ├── blogRoutes.js
│   ├── commentRoutes.js
│   └── contactRoutes.js
├── middleware/          # 中间件
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── config/              # 配置文件
│   └── database.js
├── utils/               # 工具函数
├── .env.example         # 环境变量示例
├── .gitignore           # Git 忽略文件
├── package.json         # 项目依赖
├── server.js            # 服务器入口文件
└── README.md            # 项目文档
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请通过以下方式联系：

- 邮箱: your-email@example.com
- GitHub: https://github.com/aaaazzz222/work2

---

**注意**: 这是一个后端 API 项目，需要配合前端应用使用。