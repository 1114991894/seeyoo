/**
 * GitHub OAuth 认证服务器
 * 负责安全的 code/token 交换（client_secret 仅在服务端使用）
 * 
 * 启动： node auth-server.js
 * 默认端口：3001
 */
const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.AUTH_SERVER_PORT || 3001;

// GitHub OAuth 配置
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error('❌ 错误: 请在 .env 文件中设置 GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET');
  process.exit(1);
}

// 前端地址（生产环境替换为实际域名）
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3015';

// Step 1: 跳转到 GitHub 授权页
app.get('/auth/github', (req, res) => {
  const redirectUri = `${req.protocol}://${req.get('host')}/auth/github/callback`;
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// Step 2: GitHub 回调 → 交换 token → 获取用户信息 → 重定向回前端
app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect(`${FRONTEND_URL}/#/login?error=no_code`);
  }

  const redirectUri = `${req.protocol}://${req.get('host')}/auth/github/callback`;

  try {
    // 交换 code → access_token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      console.error('[Auth] 获取 access_token 失败:', tokenRes.data);
      return res.redirect(`${FRONTEND_URL}/#/login?error=token_failed`);
    }

    // 用 access_token 获取 GitHub 用户信息
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 获取用户邮箱（可能需要额外请求）
    let email = userRes.data.email || '';
    if (!email) {
      try {
        const emailsRes = await axios.get('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const primary = emailsRes.data.find(function(e) { return e.primary && e.verified; });
        if (primary) email = primary.email;
      } catch (e) {
        // 忽略邮箱获取失败
      }
    }

    // 构建统一用户对象
    const user = {
      id: `github_${userRes.data.id}`,
      nickname: userRes.data.login,
      avatar_url: userRes.data.avatar_url,
      email: email,
      bio: userRes.data.bio || '',
      github_id: userRes.data.id,
    };

    // 编码后重定向回前端
    const userParam = encodeURIComponent(JSON.stringify(user));
    const redirectUrl = `${FRONTEND_URL}/#/login?github_user=${userParam}`;
    console.log(`[Auth] GitHub 用户 ${user.nickname} 登录成功`);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('[Auth] GitHub OAuth 错误:', error.message);
    res.redirect(`${FRONTEND_URL}/#/login?error=auth_failed`);
  }
});

// 健康检查
app.get('/auth/health', (_req, res) => {
  res.json({ status: 'ok', github_configured: true });
});

app.listen(PORT, () => {
  console.log(`\n🔐 GitHub OAuth 服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 前端地址: ${FRONTEND_URL}`);
  console.log(`👉 登录链接: http://localhost:${PORT}/auth/github\n`);
});