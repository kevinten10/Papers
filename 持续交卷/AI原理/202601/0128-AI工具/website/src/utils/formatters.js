/**
 * 格式化价格为显示文本
 * @param {string} pricing - 定价信息
 * @returns {string} 格式化后的价格文本
 */
export function formatPricing(pricing) {
  if (!pricing) return '未知'
  if (pricing.includes('免费')) return '免费'
  if (pricing.includes('$')) return pricing
  return pricing
}

/**
 * 截断文本到指定长度
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 将评分转换为星级显示数组
 * @param {number} rating - 评分 (0-5)
 * @returns {Array<{filled: boolean, half: boolean}>} 星级状态数组
 */
export function getStarArray(rating = 0) {
  return Array.from({ length: 5 }, (_, i) => ({
    filled: i < Math.floor(rating),
    half: i === Math.floor(rating) && rating % 1 >= 0.5
  }))
}

/**
 * 格式化日期为本地字符串
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
