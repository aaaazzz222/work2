# 远程 MongoDB 连接配置指南

## ⚠️ 当前问题

连接到远程MongoDB服务器 `43.140.212.105` 时出现**连接超时错误**：
```
Error: Socket 'connect' timed out after 30000ms
```

## 🔍 诊断结果

- ✅ **服务器可达**: Ping测试成功（延迟约20ms）
- ❌ **MongoDB端口不可达**: 27017端口连接超时
- ✅ **配置已更新**: .env文件已配置远程数据库

## 📋 你的数据库信息

```
服务器IP: 43.140.212.105
端口: 27017（默认）
数据库名: portfolio
用户名: portfolio
密码: 1234
```

## 🛠️ 解决方案

### 方案1: 开放MongoDB端口（推荐）

你需要在服务器上进行以下配置：

#### 1. 配置防火墙/安全组

**如果使用云服务器（阿里云/腾讯云/AWS等）**:
1. 登录云控制台
2. 找到安全组/防火墙设置
3. 添加入站规则：
   ```
   协议: TCP
   端口: 27017
   来源: 0.0.0.0/0（所有IP）或你的IP地址
   ```

**如果使用Linux防火墙（ufw）**:
```bash
# SSH登录到服务器
ssh user@43.140.212.105

# 开放27017端口
sudo ufw allow 27017/tcp

# 重启防火墙
sudo ufw reload

# 检查状态
sudo ufw status
```

**如果使用iptables**:
```bash
sudo iptables -A INPUT -p tcp --dport 27017 -j ACCEPT
sudo service iptables save
```

#### 2. 配置MongoDB允许远程连接

SSH登录到服务器后：

```bash
# 编辑MongoDB配置文件
sudo nano /etc/mongod.conf

# 找到 bindIp 行，修改为：
net:
  port: 27017
  bindIp: 0.0.0.0  # 原来可能是 127.0.0.1

# 保存后重启MongoDB
sudo systemctl restart mongod

# 检查状态
sudo systemctl status mongod
```

#### 3. 创建数据库用户（如果还没有）

```bash
# 连接MongoDB
mongosh

# 切换到admin数据库
use admin

# 创建管理员用户
db.createUser({
  user: "portfolio",
  pwd: "1234",
  roles: [
    { role: "readWrite", db: "portfolio" },
    { role: "dbAdmin", db: "portfolio" }
  ]
})

# 退出
exit
```

---

### 方案2: 使用SSH隧道（临时方案）

如果无法修改服务器防火墙，可以使用SSH隧道：

```bash
# 在本地终端运行（保持运行）
ssh -L 27017:localhost:27017 user@43.140.212.105 -N

# 然后修改.env为本地连接
MONGO_URI=mongodb://portfolio:1234@localhost:27017/portfolio
```

---

### 方案3: 使用MongoDB Atlas（最简单）

如果上述方案都不方便，建议使用MongoDB Atlas云数据库：

1. 访问 https://www.mongodb.com/cloud/atlas
2. 注册免费账号
3. 创建免费集群（512MB存储）
4. 获取连接字符串
5. 更新.env文件

优点：
- ✅ 无需配置服务器
- ✅ 自动备份
- ✅ 全球CDN加速
- ✅ 免费额度足够使用

---

## 🔧 当前配置

已更新的文件：`backend/.env`

```env
PORT=4000
MONGO_URI=mongodb://portfolio:1234@43.140.212.105:27017/portfolio
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

---

## ✅ 验证连接

完成配置后，按以下步骤验证：

### 1. 本地测试连接
```bash
# 使用mongosh测试
mongosh "mongodb://portfolio:1234@43.140.212.105:27017/portfolio"

# 如果成功会看到：
# Connected to MongoDB
# portfolio>
```

### 2. 测试端口
```bash
# 测试端口是否开放
nc -zv 43.140.212.105 27017

# 成功输出：
# Connection to 43.140.212.105 port 27017 [tcp/*] succeeded!
```

### 3. 重启后端服务
```bash
cd backend
npm run dev

# 看到以下输出说明成功：
# Server running in development mode on port 4000
# MongoDB Connected: 43.140.212.105
```

---

## 📞 需要帮助？

### 常见错误

**错误1: ECONNREFUSED**
- 原因: MongoDB服务未启动
- 解决: `sudo systemctl start mongod`

**错误2: Authentication failed**
- 原因: 用户名或密码错误
- 解决: 检查.env中的用户名密码

**错误3: Timeout**
- 原因: 端口未开放（当前问题）
- 解决: 按方案1操作

---

## 🔄 回滚到本地数据库

如果暂时无法解决远程连接，可以先恢复使用本地数据库：

```bash
# 编辑 backend/.env
MONGO_URI=mongodb://localhost:27017/portfolio_blog

# 确保本地MongoDB运行
brew services start mongodb-community

# 重启后端
cd backend
npm run dev
```

---

## 📊 推荐配置（生产环境）

### MongoDB配置文件示例

```yaml
# /etc/mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 0.0.0.0  # 允许远程连接

security:
  authorization: enabled  # 启用认证

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
```

### 安全建议

1. **使用强密码**: 不要使用"1234"这样的简单密码
2. **限制IP访问**: 防火墙只开放给需要的IP
3. **启用SSL/TLS**: 加密数据传输
4. **定期备份**: 使用mongodump备份数据
5. **监控日志**: 定期检查异常访问

---

## 📝 下一步

1. **立即**: 联系服务器管理员开放27017端口
2. **配置**: 按方案1修改MongoDB配置
3. **测试**: 使用mongosh验证连接
4. **重启**: 重启后端服务
5. **验证**: 测试API功能是否正常

---

**文档创建时间**: 2025-11-18
**问题状态**: ⚠️ 等待服务器端口开放
