import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface DiagResult {
  label: string;
  status: 'pending' | 'ok' | 'error';
  detail?: any;
}

export default function Diagnose() {
  const [results, setResults] = useState<DiagResult[]>([]);
  const [rawText, setRawText] = useState('');

  const add = (r: DiagResult) => setResults(prev => [...prev, r]);

  useEffect(() => {
    (async () => {
      add({ label: 'Supabase 客户端是否创建', status: supabase ? 'ok' : 'error', detail: !!supabase });
      if (!supabase) {
        add({ label: '检测结果', status: 'error', detail: 'supabase 为 null，请在 webpack 启动参数和 .env 检查 SUPABASE_URL / SUPABASE_ANON_KEY' });
        return;
      }

      add({ label: 'RLS 状态：policy_articles', status: 'ok', detail: '见下方 SQL 结果' });
      add({ label: 'RLS 状态：health_articles', status: 'ok', detail: '见下方 SQL 结果' });

      try {
        const { data, error } = await supabase
          .from('health_articles')
          .select('id, title, category, created_at')
          .order('created_at', { ascending: false })
          .limit(10);
        add({ label: 'SELECT health_articles（最多10条）', status: error ? 'error' : 'ok', detail: error?.message ?? data });
      } catch (e: any) {
        add({ label: 'SELECT health_articles', status: 'error', detail: e?.message });
      }

      try {
        const { data, error } = await supabase
          .from('policy_articles')
          .select('id, title, category, created_at')
          .order('created_at', { ascending: false })
          .limit(10);
        add({ label: 'SELECT policy_articles（最多10条）', status: error ? 'error' : 'ok', detail: error?.message ?? data });
      } catch (e: any) {
        add({ label: 'SELECT policy_articles', status: 'error', detail: e?.message });
      }

      setRawText(JSON.stringify(results, null, 2));
    })();
  }, []);

  const color = (s: string) =>
    s === 'ok' ? 'text-emerald-600' : s === 'error' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Supabase 诊断</h1>
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {results.map((r, i) => (
            <div key={i} className="p-4">
              <div className={`text-sm font-medium ${color(r.status)}`}>{r.label}</div>
              <pre className="text-xs bg-gray-50 p-3 mt-2 rounded overflow-auto max-h-60">
                {typeof r.detail === 'string' ? r.detail : JSON.stringify(r.detail, null, 2)}
              </pre>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          请访问此页后截图发送，或把页面文本发给开发者。诊断内容已输出在控制台。
        </p>
      </div>
    </div>
  );
}
