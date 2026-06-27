# Supabase 配置指南

## 1. 创建 Supabase 项目
1. 访问 [Supabase 官网](https://supabase.com/) 并注册账号
2. 创建一个新的项目
3. 等待项目初始化完成

## 2. 获取 API 密钥
1. 在项目仪表板中，点击左侧菜单的「Settings」
2. 选择「API」选项卡
3. 复制以下信息：
   - `Project URL`（对应 `SUPABASE_URL`）
   - `anon public` 密钥（对应 `SUPABASE_ANON_KEY`）

## 3. 配置环境变量
编辑项目根目录下的 `.env` 文件，将复制的信息填入：
```env
SUPABASE_URL=你的Project URL
SUPABASE_ANON_KEY=你的anon public密钥
```

## 4. 安装依赖
在项目根目录运行以下命令：
```bash
npm install dotenv --save-dev
```

## 5. 启动项目
```bash
npm run dev
```

## 6. 数据库配置（可选）
如果你需要自定义用户表结构，可以在 Supabase 仪表板中创建和配置数据库表。

完成以上步骤后，登录系统将使用 Supabase 进行用户验证，不再依赖 localStorage 模拟登录。