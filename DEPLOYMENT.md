# 🚀 部署指南 (Deployment Guide)

完整的部署指南：前端部署到 Vercel，后端部署到 Render

---

## 📋 部署前准备

### 1. 创建 GitHub 仓库

```bash
# 初始化 Git（如果还没有）
cd /Users/zishen/Desktop/stuck
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit - Portfolio & Blog App"

# 创建 GitHub 仓库后，添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到 GitHub
git push -u origin main
```

### 2. 准备 MongoDB 数据库

**选项 A: 使用你的远程服务器（需要开放端口）**
- 地址: `43.140.212.105:27017`
- 需要开放防火墙端口 27017

**选项 B: 使用 MongoDB Atlas（推荐）** ⭐
1. 访问 https://www.mongodb.com/cloud/atlas
2. 注册免费账号
3. 创建免费集群（M0）
4. 获取连接字符串
5. 添加 IP 白名单（选择 0.0.0.0/0 允许所有访问）

---

## 🔧 第一步：部署后端到 Render

### 1. 注册 Render 账号

访问 https://render.com 并注册

### 2. 创建新的 Web Service

1. 点击 **"New +"** → **"Web Service"**
2. 连接你的 GitHub 仓库
3. 选择仓库中的 **backend** 目录

### 3. 配置服务

**基本设置**:
```
Name: portfolio-blog-api
Root Directory: backend
Environment: Node
Region: 选择距离你最近的区域
Branch: main
```

**构建配置**:
```
Build Command: npm install
Start Command: npm start
```

**实例类型**:
```
选择: Free (0$/month)
```

### 4. 设置环境变量

在 **Environment** 标签页添加以下变量：

```env
NODE_ENV=production

PORT=10000

# MongoDB 连接字符串（选择一个）
# 选项1: 远程服务器（需要先开放端口）
MONGO_URI=mongodb://portfolio:1234@43.140.212.105:27017/portfolio

# 选项2: MongoDB Atlas（推荐）
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT 密钥（生成一个随机字符串）
JWT_SECRET=your_production_secret_key_here_make_it_long_and_random
```

**生成安全的 JWT_SECRET**:
```bash
# 在终端运行
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. 部署

1. 点击 **"Create Web Service"**
2. 等待部署完成（约 2-3 分钟）
3. 部署成功后，你会看到一个 URL，例如：
   ```
   https://portfolio-blog-api.onrender.com
   ```

### 6. 测试后端

访问你的后端 URL，应该看到：
```json
{
  "message": "Welcome to Portfolio & Blog API",
  "endpoints": {
    "users": "/api/users",
    "projects": "/api/projects",
    "blog": "/api/blog",
    "contact": "/api/contact"
  }
}
```

---

## 🎨 第二步：部署前端到 Vercel

### 1. 注册 Vercel 账号

访问 https://vercel.com 并注册

### 2. 安装 Vercel CLI（可选）

```bash
npm install -g vercel
```

### 3. 通过 Vercel Dashboard 部署

1. 点击 **"Add New..."** → **"Project"**
2. 导入你的 GitHub 仓库
3. 配置项目：

**项目设置**:
```
Framework Preset: Vite
Root Directory: frontend
```

**构建设置**:
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4. 设置环境变量

在 **Environment Variables** 中添加：

```env
# 你的 Render 后端 URL
VITE_API_URL=https://portfolio-blog-api.onrender.com/api
```

⚠️ **重要**: 将 `portfolio-blog-api` 替换为你实际的 Render 服务名称！

### 5. 部署

1. 点击 **"Deploy"**
2. 等待构建和部署（约 1-2 分钟）
3. 部署成功后，你会得到一个 URL，例如：
   ```
   https://your-portfolio.vercel.app
   ```

---

## 🔄 第三步：更新 CORS 配置

部署完成后，需要更新后端 CORS 配置以允许前端访问。

### 方法 1: 允许所有来源（开发/测试）

后端 `server.js` 已经配置了 `cors()`，默认允许所有来源。

### 方法 2: 指定前端域名（生产环境推荐）

编辑 `backend/server.js`:

```javascript
// 修改 CORS 配置
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5175',
    'https://your-portfolio.vercel.app'  // 添加你的 Vercel 域名
  ],
  credentials: true
}));
```

提交更改并推送到 GitHub，Render 会自动重新部署。

---

## ✅ 第四步：测试部署

### 1. 访问前端

打开你的 Vercel URL: `https://your-portfolio.vercel.app`

### 2. 注册账号

1. 点击 **"Register"**
2. 创建管理员账号

### 3. 测试功能

- ✅ 登录系统
- ✅ 访问 Admin Dashboard
- ✅ 创建项目
- ✅ 创建博客文章
- ✅ 发表评论
- ✅ 提交联系表单

---

## 🔐 第五步：安全加固

### 1. 更新 JWT Secret

```bash
# 生成强密码
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 在 Render 的环境变量中更新 JWT_SECRET
```

### 2. 配置 MongoDB IP 白名单

**如果使用 MongoDB Atlas**:
1. 登录 Atlas
2. Network Access → Add IP Address
3. 添加 `0.0.0.0/0`（允许所有）或添加 Render 的 IP

**如果使用自己的服务器**:
- 确保防火墙只允许必要的 IP 访问

### 3. 启用 HTTPS

- ✅ Vercel 和 Render 都自动提供 HTTPS
- ✅ 无需额外配置

---

## 📊 监控和维护

### Render 监控

1. 登录 Render Dashboard
2. 查看服务状态和日志
3. 监控资源使用情况

### Vercel 监控

1. 登录 Vercel Dashboard
2. 查看部署历史
3. 分析访问统计

---

## 🔄 更新部署

### 自动部署

推送到 GitHub 会自动触发部署：

```bash
# 修改代码后
git add .
git commit -m "Update: feature description"
git push

# Vercel 和 Render 会自动检测并重新部署
```

### 手动部署

**Render**:
1. 进入 Service Dashboard
2. 点击 **"Manual Deploy"** → **"Deploy latest commit"**

**Vercel**:
1. 进入 Project Dashboard
2. 点击 **"Redeploy"**

---

## 🐛 故障排除

### 前端无法连接后端

**问题**: API 请求失败

**解决方案**:
1. 检查 Vercel 环境变量 `VITE_API_URL` 是否正确
2. 确保后端 URL 包含 `/api` 后缀
3. 检查浏览器控制台的 CORS 错误
4. 验证后端服务正在运行

### 后端部署失败

**问题**: Build failed 或 Start failed

**解决方案**:
1. 检查 Render 日志
2. 确保 `package.json` 中有 `start` 脚本
3. 验证所有依赖都在 `dependencies` 中
4. 检查环境变量是否正确设置

### MongoDB 连接失败

**问题**: MongoNetworkError 或 Authentication failed

**解决方案**:
1. 检查 `MONGO_URI` 格式是否正确
2. MongoDB Atlas: 确保 IP 白名单包含 `0.0.0.0/0`
3. 远程服务器: 确保端口 27017 已开放
4. 验证用户名和密码正确

### Render 免费实例休眠

**问题**: 首次访问很慢（冷启动）

**说明**:
- Render 免费实例 15 分钟无活动后会休眠
- 首次访问需要 30-60 秒唤醒

**解决方案**:
- 升级到付费计划（$7/月）
- 或使用定时任务保持活跃

---

## 📝 部署检查清单

### 后端（Render）
- [ ] GitHub 仓库已推送
- [ ] Render 服务已创建
- [ ] 环境变量已配置
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] MONGO_URI（正确的连接字符串）
  - [ ] JWT_SECRET（强密码）
- [ ] 服务运行正常
- [ ] 可以访问根路由

### 前端（Vercel）
- [ ] GitHub 仓库已推送
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置
  - [ ] VITE_API_URL（后端 URL + /api）
- [ ] 构建成功
- [ ] 可以访问网站
- [ ] API 连接正常

### 数据库
- [ ] MongoDB 服务运行中
- [ ] 连接字符串正确
- [ ] IP 白名单已配置
- [ ] 用户权限正确

### 测试
- [ ] 可以注册账号
- [ ] 可以登录
- [ ] 可以创建项目
- [ ] 可以创建博客
- [ ] 可以发表评论
- [ ] 可以提交联系表单

---

## 🎯 部署后优化

### 性能优化

1. **前端优化**:
   - 启用 Vercel Analytics
   - 配置缓存策略
   - 压缩图片资源

2. **后端优化**:
   - 添加 Redis 缓存
   - 启用数据库索引
   - 实现 API 限流

### SEO 优化

1. 添加 `meta` 标签
2. 配置 `sitemap.xml`
3. 添加 `robots.txt`

---

## 📞 获取帮助

### 官方文档
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

### 社区支持
- Vercel Discord: https://vercel.com/discord
- Render Community: https://community.render.com

---

## 🎉 完成！

恭喜！你的全栈应用已成功部署！

**你的网站**:
- 前端: `https://your-portfolio.vercel.app`
- 后端: `https://portfolio-blog-api.onrender.com`

记得将这些 URL 添加到你的 README.md 中！

---

**文档版本**: 1.0
**最后更新**: 2025-11-18
