-- ============================================
-- 肾小友 - 禁用 Supabase RLS
-- ============================================
-- 在 Supabase SQL Editor 中执行此脚本
--
-- 💡 常见问题：后台发布的"保健""政策"文章用户端不显示
--    原因：Supabase 默认启用 RLS，阻止匿名用户读写数据
--    解决：执行本脚本禁用 RLS 即可
-- ============================================

ALTER TABLE policy_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE health_articles DISABLE ROW LEVEL SECURITY;