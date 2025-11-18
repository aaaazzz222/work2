# ⚡ 快速部署指南（5步搞定）

## 🎯 部署概览

- **前端**: Vercel（免费）
- **后端**: Render（免费）
- **数据库**: MongoDB Atlas（免费512MB）

---

## 📝 第1步：推送到 GitHub

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

## 🗄️ 第2步：设置 MongoDB Atlas

1. 访问 https://www.mongodb.com/cloud/atlas
2. 注册并登录
3. 创建免费集群（M0）
4. **Network Access** → Add IP → `0.0.0.0/0`
5. **Database Access** → 创建用户
6. **Connect** → 复制连接字符串：
   ```
   mongodb+srv://username:password@cluster.xxx.mongodb.net/portfolio
   ```

---

## 🔧 第3步：部署后端到 Render

1. 访问 https://render.com 并登录
2. **New +** → **Web Service**
3. 连接 GitHub 仓库
4. 配置：
   ```
   Name: portfolio-blog-api
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

5. 添加环境变量：
   ```env
   NODE_ENV=production
   PORT=10000
   MONGO_URI=你的MongoDB Atlas连接字符串
   JWT_SECRET=随机生成的64位字符串
   ```

6. **Create Web Service**

7. 等待部署，记录你的 URL：
   ```
   https://portfolio-blog-api-xxxx.onrender.com
   ```

---

## 🎨 第4步：部署前端到 Vercel

1. 访问 https://vercel.com 并登录
2. **Add New** → **Project**
3. 导入 GitHub 仓库
4. 配置：
   ```
   Framework: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

5. 添加环境变量：
   ```env
   VITE_API_URL=https://你的render后端URL/api
   ```
   示例: `https://portfolio-blog-api-xxxx.onrender.com/api`

6. **Deploy**

7. 记录你的 Vercel URL：
   ```
   https://your-portfolio.vercel.app
   ```

---

## ✅ 第5步：测试

1. 访问你的 Vercel URL
2. 点击 **Register** 创建账号
3. 登录并访问 **Admin Dashboard**
4. 测试创建项目和博客

---

## 🎉 完成！

你的应用已经上线了！

**重要链接**:
- 前端: `https://your-portfolio.vercel.app`
- 后端: `https://portfolio-blog-api-xxxx.onrender.com`
- 数据库: MongoDB Atlas

---

## ⚠️ 注意事项

1. **Render 免费计划**:
   - 15分钟不活动会休眠
   - 首次访问需要30-60秒唤醒

2. **MongoDB Atlas 免费计划**:
   - 512MB 存储空间
   - 足够个人项目使用

3. **环境变量**:
   - JWT_SECRET 必须是强密码
   - 生成方法: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

---

## 🔄 如何更新

推送到 GitHub 会自动触发重新部署：

```bash
git add .
git commit -m "Update feature"
git push
```

完整部署文档请查看 `DEPLOYMENT.md`
