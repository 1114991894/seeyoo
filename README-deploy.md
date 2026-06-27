# 部署说明 - GitHub Pages + Supabase

## 1. 前端部署到 GitHub Pages

### a. 本地构建

在项目根目录运行：

```powershell
$env:SUPABASE_URL = "https://<your-project>.supabase.co"
$env:SUPABASE_ANON_KEY = "<your-anon-key>"
npm install
npm run build
```

> 这里使用的环境变量会在构建时注入到 `webpack` 中。

### b. GitHub Actions 自动部署

仓库中已添加 `.github/workflows/deploy.yml`，它会在推送到 `main` 分支后：

- 安装依赖
- 运行 `npm run build`
- 将 `dist/` 发布到 GitHub Pages

如果你还没有开启 GitHub Pages，请在仓库 `Settings -> Pages` 中查看是否已选择 `gh-pages` 分支。

## 2. Supabase 后端配置

### a. 创建 Supabase 项目

1. 登录 Supabase 控制台
2. 新建项目，记住以下两项：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. 在 `Authentication -> Settings` 中开启 `Enable email signup`

### b. 运行 SQL schema

在 Supabase 控制台中打开 `SQL Editor`，执行 `supabase/schema.sql` 中内容：

- `posts`
- `comments`
- `favorites`

如果你需要更完整的用户元数据表，可以在 Supabase 的 `auth.user_metadata` 中直接存储。

## 3. 代码中的 Supabase 集成

### a. `src/lib/supabaseClient.ts`

该文件负责创建 Supabase 客户端：

```ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### b. `webpack.config.js`

已通过 `DefinePlugin` 将环境变量注入到前端代码：

```js
new webpack.DefinePlugin({
  'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
  'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY)
})
```

### c. `src/contexts/AuthContext.tsx`

当前登录逻辑使用 `phone` 派生 `email`：

- 登录失败时自动尝试注册
- 用户数据写入 `auth.user_metadata`
- `logout` 调用 Supabase `signOut`

如果你想改成真正手机号登录/OTP，可再告诉我，我可以继续帮你切换。

## 4. GitHub Secrets 设置

在仓库 `Settings -> Secrets and variables -> Actions` 中添加：

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 5. 推送并部署

```powershell
git add .
git commit -m "feat: add Supabase auth and GitHub Pages deployment"
git push origin main
```

推送后，GitHub Actions 会自动构建并部署。

## 6. 验证步骤

1. 等待 Actions 完成
2. 打开仓库 `Actions` 查看 `Deploy to GitHub Pages` 运行结果
3. 检查 GitHub Pages 页面是否已发布

## 7. 常见问题

- `登录失败`：请确认 Supabase 已开启 Email Sign-Up，并且 `SUPABASE_URL`/`SUPABASE_ANON_KEY` 设置正确。
- `构建失败`：请确认 `npm install` 已成功安装依赖，并且 `npm run build` 在本地正常执行。
- `Page 404`：确认 Pages 已指向 `gh-pages` 分支，且 `dist/` 已正确发布。
