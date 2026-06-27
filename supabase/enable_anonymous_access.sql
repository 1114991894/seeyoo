-- ============================================
-- 肾小友 - Supabase 匿名访问配置
-- ============================================
-- 在 Supabase SQL Editor 中执行此脚本
-- 执行前请确保 schema.sql 中的表已创建
--
-- 💡 常见问题：后台发布的"保健""政策"文章用户端不显示
--    原因：Supabase 默认启用 RLS，阻止匿名用户读写数据
--    解决：执行本脚本禁用 RLS 即可
-- ============================================

-- 禁用政策文章表的行级安全（允许匿名读写）
ALTER TABLE policy_articles DISABLE ROW LEVEL SECURITY;

-- 禁用保健文章表的行级安全（允许匿名读写）
ALTER TABLE health_articles DISABLE ROW LEVEL SECURITY;

-- 验证 RLS 状态
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('policy_articles', 'health_articles');