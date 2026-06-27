const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

console.log('=== Supabase 连接验证 ===');
console.log('SUPABASE_URL:', SUPABASE_URL ? '已配置' : '未配置');
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '已配置' : '未配置');
console.log('');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('错误：环境变量未配置！');
  console.error('请检查 .env 文件或 GitHub Secrets 是否设置了 SUPABASE_URL 和 SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('1. 测试数据库连接...');
    const { data, error } = await supabase.from('policy_articles').select('*').limit(1);
    
    if (error) {
      console.error('连接失败:', error.message);
      
      if (error.message.includes('RLS') || error.message.includes('permission')) {
        console.error('');
        console.error('=== 检测到 RLS 问题 ===');
        console.error('请在 Supabase SQL Editor 中执行以下命令：');
        console.error('');
        console.error('ALTER TABLE policy_articles DISABLE ROW LEVEL SECURITY;');
        console.error('ALTER TABLE health_articles DISABLE ROW LEVEL SECURITY;');
      }
      return false;
    }
    
    console.log('连接成功！');
    return true;
  } catch (err) {
    console.error('连接异常:', err.message);
    return false;
  }
}

async function checkTables() {
  console.log('');
  console.log('2. 检查表数据...');
  
  const tables = ['policy_articles', 'health_articles'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('count', { count: 'exact' });
    
    if (error) {
      console.error(`  ${table}: 查询失败 - ${error.message}`);
    } else {
      console.log(`  ${table}: ${data?.length || 0} 条记录`);
    }
  }
}

async function main() {
  const connected = await testConnection();
  
  if (connected) {
    await checkTables();
    
    console.log('');
    console.log('=== 检查完成 ===');
    console.log('');
    console.log('如果表中有数据但用户端无法显示：');
    console.log('1. 确认 RLS 已禁用');
    console.log('2. 确认 GitHub Actions Secrets 配置正确');
    console.log('3. 重新部署前端');
  }
}

main().catch(console.error);