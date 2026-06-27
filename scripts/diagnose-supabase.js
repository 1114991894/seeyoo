const { createClient } = require('@supabase/supabase-js');

// 手动测试用的配置
// 请替换为你实际的 Supabase 配置
const SUPABASE_URL = 'https://你的项目ID.supabase.co';
const SUPABASE_ANON_KEY = '你的anon-key';

console.log('=== Supabase 深度诊断 ===');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '已配置 (' + SUPABASE_ANON_KEY.substring(0, 20) + '...)' : '未配置');
console.log('');

async function runDiagnostics() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ 错误：请先填写正确的 SUPABASE_URL 和 SUPABASE_ANON_KEY');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. 测试连接
  console.log('1. 测试数据库连接...');
  try {
    const { data, error } = await supabase.from('policy_articles').select('*').limit(1);
    if (error) {
      console.error('   ❌ 连接失败:', error.message);
      if (error.message.includes('permission')) {
        console.error('   ⚠️ 可能是 RLS 问题，请执行：ALTER TABLE policy_articles DISABLE ROW LEVEL SECURITY;');
      }
      return;
    }
    console.log('   ✅ 连接成功！');
  } catch (err) {
    console.error('   ❌ 连接异常:', err.message);
    return;
  }

  // 2. 测试写入
  console.log('');
  console.log('2. 测试写入文章...');
  try {
    const testArticle = {
      title: '测试文章 ' + Date.now(),
      content: '这是一篇测试文章',
      category: 'insurance',
      cover_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('policy_articles').insert([testArticle]);
    if (error) {
      console.error('   ❌ 写入失败:', error.message);
      if (error.message.includes('permission')) {
        console.error('   ⚠️ RLS 阻止了写入，请执行：ALTER TABLE policy_articles DISABLE ROW LEVEL SECURITY;');
      }
      return;
    }
    console.log('   ✅ 写入成功！');
  } catch (err) {
    console.error('   ❌ 写入异常:', err.message);
    return;
  }

  // 3. 测试读取
  console.log('');
  console.log('3. 测试读取文章...');
  try {
    const { data, error } = await supabase.from('policy_articles').select('*');
    if (error) {
      console.error('   ❌ 读取失败:', error.message);
      return;
    }
    console.log('   ✅ 读取成功！');
    console.log('   📊 文章数量:', data.length);
    if (data.length > 0) {
      console.log('   📝 最新文章:', data[0].title);
    }
  } catch (err) {
    console.error('   ❌ 读取异常:', err.message);
    return;
  }

  console.log('');
  console.log('=== 诊断完成 ===');
  console.log('如果所有测试都通过，但用户端仍然看不到文章，请检查：');
  console.log('1. GitHub Secrets 是否正确配置');
  console.log('2. GitHub Actions 是否成功运行');
  console.log('3. 用户端是否已经重新部署');
}

runDiagnostics().catch(console.error);