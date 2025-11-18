# 🚀 使用自有服务器部署指南

**服务器**: 43.140.212.105
**数据库**: 自有 MongoDB（不使用 Atlas）

---

## 📋 部署步骤概览

1. ✅ 配置服务器 MongoDB（必须先完成）
2. ✅ 推送代码到 GitHub
3. ✅ 部署后端到 Render
4. ✅ 部署前端到 Vercel
5. ✅ 测试功能

---

## 🔧 第1步：配置服务器 MongoDB

### ⚠️ 这是最重要的一步！

你需要在服务器 `43.140.212.105` 上进行以下操作：

### 1.1 SSH 登录服务器

```bash
ssh your_username@43.140.212.105
```

### 1.2 配置 MongoDB 允许远程连接

```bash
sudo nano /etc/mongod.conf
```

修改 `bindIp`:
```yaml
net:
  port: 27017
  bindIp: 0.0.0.0  # 改为 0.0.0.0
```

### 1.3 开放防火墙端口

```bash
sudo ufw allow 27017/tcp
sudo ufw reload
```

### 1.4 配置云安全组

登录你的云服务商控制台（阿里云/腾讯云等）：

1. 找到服务器实例
2. 进入**安全组**设置
3. 添加**入站规则**：
   - 协议: TCP
   - 端口: 27017
   - 来源: 0.0.0.0/0

### 1.5 重启 MongoDB

```bash
sudo systemctl restart mongod
sudo systemctl status mongod
```

### 1.6 本地测试连接

**在你的 Mac 上测试**：

```bash
# 测试端口
nc -zv 43.140.212.105 27017

# 应该看到：
# Connection to 43.140.212.105 port 27017 [tcp/*] succeeded!
```

✅ **如果端口测试成功，继续下一步！**
❌ **如果失败，请查看 `SERVER_MONGODB_SETUP.md` 详细排查**

---

## 📦 第2步：推送到 GitHub

```bash
cd /Users/zishen/Desktop/stuck

# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库后
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 🔧 第3步：部署后端到 Render

### 3.1 登录 Render

访问 https://render.com 并登录

### 3.2 创建 Web Service

1. 点击 **"New +"** → **"Web Service"**
2. 连接 GitHub 仓库
3. 配置：
   ```
   Name: portfolio-blog-api
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

### 3.3 设置环境变量 ⚠️ 重要

```env
NODE_ENV=production

PORT=10000

# 使用你的服务器 MongoDB
MONGO_URI=mongodb://portfolio:1234@43.140.212.105:27017/portfolio

# 生成强密码（运行下面的命令）
JWT_SECRET=<运行命令生成>
```

**生成 JWT_SECRET**：
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.4 部署

1. 点击 **"Create Web Service"**
2. 等待部署（2-3分钟）
3. 记录你的后端 URL：
   ```
   https://portfolio-blog-api-xxxx.onrender.com
   ```

### 3.5 测试后端

访问你的后端 URL，应该看到欢迎消息。

**如果看到数据库连接错误**，检查：
- 服务器 27017 端口是否开放
- MONGO_URI 是否正确
- MongoDB 服务是否运行

---

## 🎨 第4步：部署前端到 Vercel

### 4.1 登录 Vercel

访问 https://vercel.com 并登录

### 4.2 导入项目

1. **Add New** → **Project**
2. 选择 GitHub 仓库
3. 配置：
   ```
   Framework: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

### 4.3 设置环境变量

```env
VITE_API_URL=https://你的render后端URL/api
```

**示例**:
```
VITE_API_URL=https://portfolio-blog-api-xxxx.onrender.com/api
```

⚠️ **注意**: 必须包含 `/api` 后缀！

### 4.4 部署

1. 点击 **"Deploy"**
2. 等待构建（1-2分钟）
3. 记录你的前端 URL：
   ```
   https://your-portfolio.vercel.app
   ```

---

## ✅ 第5步：测试功能

### 5.1 访问网站

打开你的 Vercel URL

### 5.2 注册账号

1. 点击 **"Register"**
2. 创建账号：
   ```
   Username: admin
   Email: admin@example.com
   Password: 强密码
   ```

### 5.3 测试功能

- [ ] 登录成功
- [ ] 访问 Admin Dashboard
- [ ] 创建项目
- [ ] 创建博客文章
- [ ] 发表评论
- [ ] 提交联系表单

---

## 🔒 安全建议

### 生产环境配置

1. **修改数据库密码**
   ```bash
   ssh your_username@43.140.212.105
   mongosh
   use portfolio
   db.updateUser("portfolio", { pwd: "强密码" })
   ```

2. **限制 IP 访问**（推荐）

   在云安全组中，将 `0.0.0.0/0` 改为 Render 的 IP 范围：
   - 查看 Render IP: https://render.com/docs/static-outbound-ip-addresses

3. **定期备份数据库**
   ```bash
   # 在服务器上设置定时备份
   crontab -e

   # 每天凌晨2点备份
   0 2 * * * mongodump --uri="mongodb://portfolio:强密码@localhost:27017/portfolio" --out=/backup/$(date +\%Y\%m\%d)
   ```

---

## 🐛 常见问题

### 问题1: Render 无法连接数据库

**症状**: 后端部署失败，显示 "MongoNetworkError"

**解决方案**:
1. 检查服务器端口 27017 是否开放
   ```bash
   # 在本地测试
   nc -zv 43.140.212.105 27017
   ```
2. 检查云安全组规则
3. 检查 MongoDB 配置的 bindIp
4. 查看 Render 部署日志

### 问题2: 前端无法连接后端

**症状**: 网站加载但无数据

**解决方案**:
1. 检查 Vercel 的 `VITE_API_URL` 是否正确
2. 必须包含 `/api` 后缀
3. 检查浏览器控制台的错误信息
4. 验证后端 URL 可以访问

### 问题3: 首次访问很慢

**原因**: Render 免费实例休眠

**说明**:
- 15分钟无活动后休眠
- 首次访问需要 30-60 秒唤醒
- 这是 Render 免费计划的限制

---

## 📊 监控和维护

### 服务器监控

```bash
# SSH 登录服务器
ssh your_username@43.140.212.105

# 查看 MongoDB 状态
sudo systemctl status mongod

# 查看连接数
mongosh
use admin
db.serverStatus().connections

# 查看日志
sudo tail -f /var/log/mongodb/mongod.log
```

### Render 监控

1. 登录 Render Dashboard
2. 查看服务状态
3. 查看部署日志
4. 监控资源使用

### Vercel 监控

1. 登录 Vercel Dashboard
2. 查看部署历史
3. 分析访问统计

---

## 🔄 更新部署

### 自动部署

推送到 GitHub 会自动触发：

```bash
git add .
git commit -m "Update feature"
git push
```

Render 和 Vercel 会自动检测并重新部署。

---

## 📝 部署信息记录

### URL 信息

- **前端**: ____________________________
- **后端**: ____________________________
- **数据库**: 43.140.212.105:27017

### 环境变量

**Render (后端)**:
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb://portfolio:****@43.140.212.105:27017/portfolio
JWT_SECRET=****
```

**Vercel (前端)**:
```
VITE_API_URL=https://______.onrender.com/api
```

---

## ✅ 部署检查清单

### 服务器配置
- [ ] MongoDB bindIp 设置为 0.0.0.0
- [ ] 防火墙端口 27017 已开放
- [ ] 云安全组规则已配置
- [ ] MongoDB 服务运行中
- [ ] 端口测试成功

### GitHub
- [ ] 代码已推送
- [ ] 仓库设置正确

### Render (后端)
- [ ] Service 创建成功
- [ ] 环境变量配置正确
- [ ] 部署成功
- [ ] 可以访问 API

### Vercel (前端)
- [ ] 项目导入成功
- [ ] 环境变量配置正确
- [ ] 构建成功
- [ ] 网站可以访问

### 功能测试
- [ ] 可以注册
- [ ] 可以登录
- [ ] 可以创建项目
- [ ] 可以创建博客
- [ ] 可以发表评论

---

## 🎉 完成！

你的应用已经使用自己的服务器成功部署！

**重要提醒**:
- 🔐 定期更改数据库密码
- 💾 定期备份数据
- 📊 监控服务器资源使用
- 🔄 保持系统和软件更新

---

**需要帮助？查看详细文档**:
- `SERVER_MONGODB_SETUP.md` - 服务器配置详解
- `DEPLOYMENT.md` - 完整部署指南
- `DEPLOYMENT_CHECKLIST.md` - 检查清单
