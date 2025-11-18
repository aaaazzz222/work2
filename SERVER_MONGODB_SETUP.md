# 🔧 使用自有服务器 MongoDB 配置指南

服务器IP: **43.140.212.105**

---

## ⚠️ 当前问题

端口 27017 无法从外部访问，需要在服务器上进行配置。

---

## 🛠️ 服务器端配置（必须操作）

### 第1步：SSH 登录服务器

```bash
ssh your_username@43.140.212.105
```

### 第2步：检查 MongoDB 是否运行

```bash
# 检查 MongoDB 服务状态
sudo systemctl status mongod

# 如果未运行，启动它
sudo systemctl start mongod

# 设置开机自启
sudo systemctl enable mongod
```

### 第3步：配置 MongoDB 允许远程连接

```bash
# 编辑 MongoDB 配置文件
sudo nano /etc/mongod.conf
```

找到 `net:` 部分，修改 `bindIp`:

**修改前**:
```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
```

**修改后**:
```yaml
net:
  port: 27017
  bindIp: 0.0.0.0  # 允许所有IP连接
```

保存文件（Ctrl+O, Enter, Ctrl+X）

### 第4步：重启 MongoDB

```bash
sudo systemctl restart mongod

# 检查是否成功
sudo systemctl status mongod
```

### 第5步：开放防火墙端口

#### 如果使用 ufw（Ubuntu/Debian）:
```bash
# 允许 27017 端口
sudo ufw allow 27017/tcp

# 重新加载防火墙
sudo ufw reload

# 检查状态
sudo ufw status

# 应该看到：
# 27017/tcp    ALLOW       Anywhere
```

#### 如果使用 iptables:
```bash
# 添加规则
sudo iptables -A INPUT -p tcp --dport 27017 -j ACCEPT

# 保存规则
sudo service iptables save
# 或
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

#### 如果使用 firewalld（CentOS/RHEL）:
```bash
sudo firewall-cmd --permanent --add-port=27017/tcp
sudo firewall-cmd --reload
```

### 第6步：配置云服务器安全组

如果使用**阿里云/腾讯云/华为云等**，还需要在控制台配置：

1. 登录云服务器控制台
2. 找到你的服务器实例
3. 进入**安全组**设置
4. 添加**入站规则**：
   ```
   协议类型: TCP
   端口范围: 27017
   授权对象: 0.0.0.0/0（所有IP）
   描述: MongoDB 访问
   ```
5. 保存规则

### 第7步：验证端口开放

在服务器上运行：

```bash
# 检查 MongoDB 是否监听在 0.0.0.0
sudo netstat -tlnp | grep 27017

# 应该看到：
# tcp  0  0  0.0.0.0:27017  0.0.0.0:*  LISTEN  xxxx/mongod
```

---

## 🔐 配置 MongoDB 用户认证

### 1. 连接到 MongoDB

```bash
mongosh
```

### 2. 切换到 admin 数据库

```javascript
use admin
```

### 3. 创建管理员用户（如果还没有）

```javascript
db.createUser({
  user: "admin",
  pwd: "强密码_替换这里",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
```

### 4. 创建项目专用用户

```javascript
use portfolio

db.createUser({
  user: "portfolio",
  pwd: "1234",  // 生产环境请使用强密码！
  roles: [
    { role: "readWrite", db: "portfolio" },
    { role: "dbAdmin", db: "portfolio" }
  ]
})

// 退出
exit
```

### 5. 启用认证（推荐）

```bash
# 编辑配置文件
sudo nano /etc/mongod.conf
```

添加或修改：

```yaml
security:
  authorization: enabled
```

重启 MongoDB:

```bash
sudo systemctl restart mongod
```

---

## ✅ 本地测试连接

在你的**本地电脑**上测试连接：

```bash
# 使用 mongosh 测试
mongosh "mongodb://portfolio:1234@43.140.212.105:27017/portfolio"

# 如果成功，会看到：
# Current Mongosh Log ID: ...
# Connecting to: mongodb://43.140.212.105:27017/portfolio
# Using MongoDB: ...
# portfolio>
```

或使用 telnet/nc 测试端口：

```bash
# 测试端口是否开放
nc -zv 43.140.212.105 27017

# 成功输出：
# Connection to 43.140.212.105 port 27017 [tcp/*] succeeded!
```

---

## 📝 部署配置

### 后端 .env 配置

```env
PORT=4000
MONGO_URI=mongodb://portfolio:1234@43.140.212.105:27017/portfolio
JWT_SECRET=<生成一个强密码>
NODE_ENV=production
```

### Render 环境变量

在 Render 部署时，添加以下环境变量：

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb://portfolio:1234@43.140.212.105:27017/portfolio
JWT_SECRET=<64位随机字符串>
```

### 生成 JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔒 安全建议

### 1. 使用强密码

❌ **不要使用**: `1234`, `password`, `admin`

✅ **应该使用**: 至少16位的随机字符串

生成强密码：
```bash
# 生成随机密码
openssl rand -base64 24
```

### 2. 限制 IP 访问（生产环境推荐）

**方法1: 云安全组**
- 不要使用 `0.0.0.0/0`
- 只允许 Render 的 IP 范围
- Render IP 列表: https://render.com/docs/static-outbound-ip-addresses

**方法2: 防火墙规则**
```bash
# 只允许特定IP
sudo ufw delete allow 27017/tcp
sudo ufw allow from <Render_IP> to any port 27017
```

### 3. 启用 SSL/TLS（可选）

配置 MongoDB 使用 SSL 连接（推荐但复杂）

### 4. 定期备份

```bash
# 备份数据库
mongodump --uri="mongodb://portfolio:1234@localhost:27017/portfolio" --out=/backup/$(date +%Y%m%d)

# 设置定时任务
crontab -e

# 每天凌晨2点备份
0 2 * * * mongodump --uri="mongodb://portfolio:1234@localhost:27017/portfolio" --out=/backup/$(date +\%Y\%m\%d)
```

---

## 🐛 故障排除

### 问题1: 连接超时

**检查清单**:
- [ ] MongoDB 服务运行中
- [ ] bindIp 设置为 0.0.0.0
- [ ] 防火墙端口已开放
- [ ] 云安全组规则已配置
- [ ] 端口 27017 可以从外部访问

**诊断命令**:
```bash
# 在服务器上
sudo systemctl status mongod
sudo netstat -tlnp | grep 27017
sudo ufw status

# 在本地
ping 43.140.212.105
nc -zv 43.140.212.105 27017
```

### 问题2: 认证失败

**原因**: 用户名或密码错误

**解决**:
```bash
mongosh

use portfolio

# 查看用户
db.getUsers()

# 重置密码
db.updateUser("portfolio", { pwd: "新密码" })
```

### 问题3: 数据库连接但无权限

**原因**: 用户权限不足

**解决**:
```javascript
use portfolio

// 授予更多权限
db.grantRolesToUser("portfolio", [
  { role: "readWrite", db: "portfolio" },
  { role: "dbAdmin", db: "portfolio" }
])
```

### 问题4: Render 无法连接

**可能原因**:
1. 服务器防火墙只允许特定IP
2. MongoDB 配置错误
3. 连接字符串格式错误

**解决**:
1. 临时开放所有IP测试（安全组: 0.0.0.0/0）
2. 查看 Render 部署日志
3. 验证 MONGO_URI 格式

---

## 📊 监控和维护

### 监控 MongoDB

```bash
# 查看 MongoDB 日志
sudo tail -f /var/log/mongodb/mongod.log

# 查看连接数
mongosh
use admin
db.serverStatus().connections

# 查看数据库大小
use portfolio
db.stats()
```

### 性能优化

```javascript
// 创建索引
use portfolio

// 为常用查询字段创建索引
db.users.createIndex({ email: 1 })
db.projects.createIndex({ user: 1 })
db.blogposts.createIndex({ author: 1 })
db.comments.createIndex({ post: 1 })
```

---

## ✅ 完整测试流程

### 1. 服务器端测试

```bash
ssh your_username@43.140.212.105

# 测试本地连接
mongosh "mongodb://portfolio:1234@localhost:27017/portfolio"

# 测试外部连接（在服务器上）
mongosh "mongodb://portfolio:1234@43.140.212.105:27017/portfolio"
```

### 2. 本地测试

```bash
# 在你的 Mac 上测试
mongosh "mongodb://portfolio:1234@43.140.212.105:27017/portfolio"

# 测试端口
nc -zv 43.140.212.105 27017
```

### 3. 应用测试

```bash
# 更新 backend/.env
MONGO_URI=mongodb://portfolio:1234@43.140.212.105:27017/portfolio

# 重启后端
cd backend
npm run dev

# 应该看到：
# MongoDB Connected: 43.140.212.105
```

---

## 📞 需要帮助？

### 常用命令速查

```bash
# 检查服务
sudo systemctl status mongod
sudo systemctl restart mongod

# 查看端口
sudo netstat -tlnp | grep 27017

# 防火墙
sudo ufw status
sudo ufw allow 27017/tcp

# 日志
sudo tail -f /var/log/mongodb/mongod.log
```

### 配置文件位置

- MongoDB 配置: `/etc/mongod.conf`
- MongoDB 日志: `/var/log/mongodb/mongod.log`
- 数据目录: `/var/lib/mongodb`

---

## 🎯 下一步

完成服务器配置后：

1. ✅ 测试从本地连接
2. ✅ 更新 `.env` 配置
3. ✅ 重启后端服务测试
4. ✅ 部署到 Render 时使用相同的连接字符串

---

**配置完成后记得告诉我，我会帮你测试连接！** 🚀
