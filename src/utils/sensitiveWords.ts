// 敏感词列表
const sensitiveWords = [
  // 政治敏感词
  '习近平', '李克强', '毛泽东', '邓小平', '江泽民', '胡锦涛',
  '共产党', '国民党', '台独', '藏独', '疆独', '港独',
  '法轮功', '邪教', '反动', '颠覆', '暴乱',
  // 辱骂词汇
  '傻逼', '蠢货', '废物', '垃圾', '去死', '混蛋', '王八蛋',
  '他妈的', '草泥马', '滚蛋', '脑残', '白痴', '神经病',
  // 违法相关
  '毒品', '赌博', '色情', '卖淫', '嫖娼', '杀人', '抢劫',
  '诈骗', '传销', '走私', '黑客', '盗取', '伪造',
];

/**
 * 检查文本是否包含敏感词
 * @param text 要检查的文本
 * @returns 包含的敏感词列表，如果没有则返回空数组
 */
export function checkSensitiveWords(text: string): string[] {
  if (!text) return [];

  const foundWords: string[] = [];
  for (const word of sensitiveWords) {
    if (text.includes(word)) {
      foundWords.push(word);
    }
  }
  return foundWords;
}

/**
 * 检查文本是否包含敏感词（简化版）
 * @param text 要检查的文本
 * @returns 是否包含敏感词
 */
export function hasSensitiveWords(text: string): boolean {
  return checkSensitiveWords(text).length > 0;
}

/**
 * 获取敏感词提示信息
 * @param text 要检查的文本
 * @returns 提示信息，如果没有敏感词则返回空字符串
 */
export function getSensitiveWordsWarning(text: string): string {
  const foundWords = checkSensitiveWords(text);
  if (foundWords.length === 0) return '';

  return `含有违法或敏感词：${foundWords.join('、')}，无法发表`;
}