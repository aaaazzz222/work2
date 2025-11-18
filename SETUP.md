# 快速启动指南 (Quick Setup Guide)

## 📋 前提条件 (Prerequisites)

在开始之前，请确保已安装：
- ✅ Node.js (v16+)
- ✅ MongoDB (本地安装或使用 MongoDB Atlas)
- ✅ Git (可选)

## 🚀 启动步骤 (Setup Steps)

### 第一步：安装依赖

在项目根目录运行：
```bash
npm run install-all
```

或者分别安装：

**后端：**
```bash
cd backend
npm install
```

**前端：**
```bash
cd frontend
npm install
```

### 第二步：配置环境变量

#### 后端配置
后端的 `.env` 文件已经创建，位置：`backend/.env`

默认配置：
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_blog
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

**重要：** 如果使用本地MongoDB，请确保MongoDB服务正在运行！

启动本地MongoDB：
```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# 或直接运行
mongod
```

#### 前端配置
前端的 `.env` 文件已经创建，位置：`frontend/.env`

默认配置：
```env
VITE_API_URL=http://localhost:5000/api
```

### 第三步：启动项目

#### 方式1：使用两个终端窗口（推荐）

**终端1 - 启动后端：**
```bash
cd backend
npm run dev
```

看到以下输出表示成功：
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**终端2 - 启动前端：**
```bash
cd frontend
npm run dev
```

看到以下输出表示成功：
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

#### 方式2：在根目录使用npm scripts

**终端1：**
```bash
npm run backend
```

**终端2：**
```bash
npm run frontend
```

## 🎯 访问应用

启动成功后：
- 🌐 前端：http://localhost:5173
- 🔌 后端API：http://localhost:5000
- 📚 API测试：http://localhost:5000/api

## 👤 创建第一个用户

1. 在浏览器打开 http://localhost:5173
2. 点击 "Register" 注册账号
3. 填写信息：
   - Username: admin
   - Email: admin@example.com
   - Password: 123456
4. 注册成功后会自动登录
5. 导航到 Admin Dashboard 开始管理内容

## 📝 测试功能

### 公共功能（无需登录）
- ✅ 浏览首页
- ✅ 查看项目列表
- ✅ 阅读博客文章
- ✅ 提交联系表单

### 需要登录的功能
- ✅ 访问 Admin Dashboard
- ✅ 创建/编辑/删除项目
- ✅ 创建/编辑/删除博客文章
- ✅ 发表评论
- ✅ 查看联系消息

## 🛠️ 常见问题

### MongoDB连接失败
**问题：** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**解决方案：**
1. 确保MongoDB正在运行
2. macOS: `brew services start mongodb-community`
3. 检查端口：`lsof -i :27017`

### 端口被占用
**问题：** `Error: listen EADDRINUSE: address already in use`

**解决方案：**
```bash
# 查找占用端口的进程
lsof -i :5000  # 后端
lsof -i :5173  # 前端

# 终止进程
kill -9 <PID>
```

### CORS错误
**问题：** 前端无法连接到后端

**解决方案：**
1. 确保后端运行在端口 5000
2. 确保前端 `.env` 中的 API URL 正确
3. 检查浏览器控制台的错误信息

### 依赖安装失败
**问题：** npm install 出错

**解决方案：**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和重新安装
rm -rf node_modules package-lock.json
npm install
```

## 📦 项目结构概览

```
stuck/
├── backend/              # Node.js + Express API
│   ├── config/          # 数据库配置
│   ├── controllers/     # 业务逻辑
│   ├── middleware/      # 中间件
│   ├── models/          # Mongoose模型
│   ├── routes/          # API路由
│   ├── utils/           # 工具函数
│   └── server.js        # 入口文件
│
├── frontend/            # React应用
│   ├── src/
│   │   ├── components/ # 组件
│   │   ├── context/    # Context
│   │   ├── pages/      # 页面
│   │   ├── services/   # API服务
│   │   └── App.jsx     # 主应用
│   └── index.html
│
└── README.md           # 项目说明
```

## 🎨 设计特点

- 🌸 粉红色主题
- 📱 响应式设计
- ✨ iOS/鸿蒙风格
- 🎭 平滑动画
- 🎯 现代化UI

## 📚 下一步

1. **自定义内容**
   - 在 Admin Dashboard 添加项目
   - 撰写博客文章
   - 更新个人信息

2. **修改设计**
   - 编辑 `frontend/src/index.css` 更改主题色
   - 修改各页面的 CSS 文件

3. **部署上线**
   - 后端部署到 Render/Heroku
   - 前端部署到 Vercel/Netlify
   - 使用 MongoDB Atlas 云数据库

## ❓ 获取帮助

如有问题：
1. 查看 README.md
2. 检查浏览器控制台
3. 查看后端终端日志
4. 参考项目文档

---

**祝使用愉快！** 🎉
