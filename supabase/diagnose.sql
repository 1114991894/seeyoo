-- ============================================
-- 肾小友 - Supabase 数据诊断脚本
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 检查 RLS 是否已关闭
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('policy_articles', 'health_articles');

-- 2. 检查表中实际数据量
SELECT 'policy_articles' as table_name, count(*) as count FROM policy_articles
UNION ALL
SELECT 'health_articles', count(*) FROM health_articles;

-- 3. 查看 policy_articles 最新 5 条
SELECT id, title, category, created_at
FROM policy_articles
ORDER BY created_at DESC
LIMIT 5;

-- 4. 查看 health_articles 最新 5 条
SELECT id, title, category, created_at
FROM health_articles
ORDER BY created_at DESC
LIMIT 5;

-- 5. 如果数据为空，插入测试数据（仅首次执行）
INSERT INTO policy_articles (title, content, category, cover_url, created_at, updated_at)
SELECT
  '测试：医保政策',
  '这是一条测试医保政策内容。',
  'insurance',
  '',
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM policy_articles);

INSERT INTO health_articles (title, content, category, cover_url, created_at, updated_at)
SELECT
  '测试：饮食管理',
  '这是一条测试保健文章内容。',
  'diet',
  '',
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM health_articles);

-- 6. 再次确认数据量
SELECT 'policy_articles' as table_name, count(*) as count FROM policy_articles
UNION ALL
SELECT 'health_articles', count(*) FROM health_articles;
