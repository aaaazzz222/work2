# 🚀 部署指南

## 推送到 GitHub

首先，将项目推送到你的 GitHub 仓库：

```bash
# 如果你还没有配置 Git 用户信息
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 推送到 GitHub
git push -u origin main
```

## 部署选项

### 选项 1: Render (推荐)

Render 提供免费套餐，非常适合部署 Node.js 应用。

#### 部署步骤：

1. **创建 Render 账户**
   - 访问 [render.com](https://render.com)
   - 使用 GitHub 账号登录

2. **创建新的 Web Service**
   - 点击 "New +" → "Web Service"
   - 连接你的 GitHub 仓库 `aaaazzz222/work2`
   - 选择以下配置：
     - **Name**: portfolio-blog-api
     - **Region**: Oregon (或最近的区域)
     - **Branch**: main
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **设置环境变量**
   在 Environment 标签页添加：
   ```
   NODE_ENV=production
   MONGODB_URI=你的MongoDB Atlas连接字符串
   JWT_SECRET=你的JWT密钥（至少32个字符）
   PORT=10000
   ```

4. **部署**
   - 点击 "Create Web Service"
   - 等待部署完成（通常需要2-3分钟）

5. **获取 API URL**
   部署完成后，你的 API 将在以下地址可用：
   `https://portfolio-blog-api.onrender.com`

### 选项 2: Heroku

1. **安装 Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # 或者下载: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **登录 Heroku**
   ```bash
   heroku login
   ```

3. **创建应用**
   ```bash
   heroku create portfolio-blog-api
   ```

4. **设置环境变量**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="你的MongoDB Atlas连接字符串"
   heroku config:set JWT_SECRET="你的JWT密钥"
   ```

5. **推送代码**
   ```bash
   git push heroku main
   ```

### 选项 3: Vercel

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel
   ```

3. **设置环境变量**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```

## MongoDB Atlas 设置

如果你还没有设置 MongoDB Atlas：

1. **创建免费集群**
   - 访问 [cloud.mongodb.com](https://cloud.mongodb.com)
   - 创建免费账户
   - 创建新的免费集群（M0）

2. **配置网络访问**
   - 在 Network Access 中添加 IP: `0.0.0.0/0`（允许所有访问）

3. **创建数据库用户**
   - 在 Database Access 中创建用户
   - 记住用户名和密码

4. **获取连接字符串**
   - 点击 Clusters → Connect
   - 选择 "Connect your application"
   - 复制连接字符串
   - 替换 `<password>` 为你的密码

## 测试部署

部署完成后，测试以下端点：

1. **健康检查**
   ```bash
   curl https://your-app-url.com/api/health
   ```

2. **用户注册**
   ```bash
   curl -X POST https://your-app-url.com/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"admin@example.com","password":"password123"}'
   ```

3. **获取项目列表**
   ```bash
   curl https://your-app-url.com/api/projects
   ```

## 生产环境注意事项

1. **安全**
   - 确保使用强密码
   - 定期更新依赖
   - 监控 API 使用情况

2. **性能**
   - 使用 CDN 加速静态资源
   - 考虑添加 Redis 缓存
   - 监控数据库性能

3. **监控**
   - 设置错误报告
   - 配置日志记录
   - 设置 Uptime 监控

## 常见问题

### Q: 部署失败怎么办？
A: 检查构建日志，确保所有依赖都正确安装。

### Q: 如何设置自定义域名？
A: 在部署平台的设置中添加自定义域名，并配置 DNS。

### Q: 数据库连接失败？
A: 检查 MongoDB Atlas 的网络设置，确保 IP 白名单包含部署平台的 IP。

### Q: 如何更新应用？
A: 推送代码到 GitHub 主分支，部署平台会自动重新部署。

## 🎉 完成！

部署完成后，你就拥有了一个功能完整的 Portfolio 和 Blog API！

- **GitHub**: https://github.com/aaaazzz222/work2
- **API 文档**: 查看 README.md
- **生产环境**: 你的部署 URL