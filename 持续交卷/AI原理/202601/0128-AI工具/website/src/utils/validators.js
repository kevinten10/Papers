/**
 * 验证工具对象是否符合 schema 定义
 * @param {Object} tool - 工具对象
 * @returns {boolean} 是否有效
 */
export function validateTool(tool) {
  if (!tool || typeof tool !== 'object') return false

  const requiredFields = ['id', 'name', 'category', 'developer']
  for (const field of requiredFields) {
    if (!tool[field]) return false
  }

  // 验证 category 是否为有效值
  const validCategories = ['IDE', 'CLI', 'LLM', 'APP']
  if (!validCategories.includes(tool.category)) return false

  // 验证 versions 是否为数组
  if (!Array.isArray(tool.versions)) return false

  return true
}

/**
 * 验证版本对象
 * @param {Object} version - 版本对象
 * @returns {boolean} 是否有效
 */
export function validateVersion(version) {
  if (!version || typeof version !== 'object') return false

  const requiredFields = ['type', 'pricing', 'models']
  for (const field of requiredFields) {
    if (!version[field]) return false
  }

  // 验证 type 是否为有效值
  const validTypes = ['CN', 'Global']
  if (!validTypes.includes(version.type)) return false

  return true
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function validateEmail(email) {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证 URL 格式
 * @param {string} url - URL 地址
 * @returns {boolean} 是否有效
 */
export function validateUrl(url) {
  if (!url || url === '#') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
