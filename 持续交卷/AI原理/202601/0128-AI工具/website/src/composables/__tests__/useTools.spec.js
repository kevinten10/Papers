import { describe, it, expect, beforeEach } from 'vitest'
import { useTools } from '../useTools'

describe('useTools', () => {
  let tools

  beforeEach(() => {
    tools = useTools()
  })

  describe('初始化状态', () => {
    it('should initialize with default values', () => {
      expect(tools.searchQuery.value).toBe('')
      expect(tools.selectedCategory.value).toBe('全部')
      expect(tools.selectedVersion.value).toBe('全部')
      expect(tools.isDarkMode.value).toBe(false)
      expect(tools.compareSelection.value).toEqual([])
      expect(tools.matcherStep.value).toBe(0)
    })

    it('should have correct categories and versions', () => {
      expect(tools.categories).toEqual(['全部', 'IDE', 'CLI', 'LLM', 'APP', 'DESKTOP'])
      expect(tools.versions).toEqual(['全部', 'CN', 'Global'])
    })
  })

  describe('搜索过滤', () => {
    it('should filter tools based on search query', () => {
      tools.searchQuery.value = 'Cursor'
      const hasCursor = tools.filteredTools.value.some(t => t.name.includes('Cursor'))
      expect(hasCursor).toBe(true)
    })

    it('should filter tools case-insensitively', () => {
      tools.searchQuery.value = 'cursor'
      const hasCursor = tools.filteredTools.value.some(t => 
        t.name.toLowerCase().includes('cursor')
      )
      expect(hasCursor).toBe(true)
    })

    it('should filter tools by tags', () => {
      tools.searchQuery.value = '推荐'
      const hasRecommended = tools.filteredTools.value.some(t => 
        t.tags.some(tag => tag.includes('推荐'))
      )
      expect(hasRecommended).toBe(true)
    })

    it('should return empty array for non-matching search', () => {
      tools.searchQuery.value = 'NonExistentTool12345'
      expect(tools.filteredTools.value).toEqual([])
    })
  })

  describe('分类过滤', () => {
    it('should filter tools based on category IDE', () => {
      tools.selectedCategory.value = 'IDE'
      const allIDE = tools.filteredTools.value.every(t => t.category === 'IDE')
      expect(allIDE).toBe(true)
      expect(tools.filteredTools.value.length).toBeGreaterThan(0)
    })

    it('should filter tools based on category CLI', () => {
      tools.selectedCategory.value = 'CLI'
      const allCLI = tools.filteredTools.value.every(t => t.category === 'CLI')
      expect(allCLI).toBe(true)
    })

    it('should filter tools based on category LLM', () => {
      tools.selectedCategory.value = 'LLM'
      const allLLM = tools.filteredTools.value.every(t => t.category === 'LLM')
      expect(allLLM).toBe(true)
    })

    it('should filter tools based on category DESKTOP', () => {
      tools.selectedCategory.value = 'DESKTOP'
      const allDESKTOP = tools.filteredTools.value.every(t => t.category === 'DESKTOP')
      expect(allDESKTOP).toBe(true)
      expect(tools.filteredTools.value.length).toBeGreaterThan(0)
    })

    it('should show all tools when category is 全部', () => {
      tools.selectedCategory.value = '全部'
      expect(tools.filteredTools.value.length).toBeGreaterThan(0)
    })
  })

  describe('版本过滤', () => {
    it('should filter tools by CN version', () => {
      tools.selectedVersion.value = 'CN'
      // 验证过滤逻辑：如果结果非空，则所有结果都应该包含 CN 版本
      // 使用 includes 是因为版本类型可能是 "CN" 或 "CN/Global"
      if (tools.filteredTools.value.length > 0) {
        const allHaveCN = tools.filteredTools.value.every(t => 
          t.versions.some(v => v.type.includes('CN'))
        )
        expect(allHaveCN).toBe(true)
      }
    })

    it('should filter tools by Global version', () => {
      tools.selectedVersion.value = 'Global'
      if (tools.filteredTools.value.length > 0) {
        const allHaveGlobal = tools.filteredTools.value.every(t => 
          t.versions.some(v => v.type.includes('Global'))
        )
        expect(allHaveGlobal).toBe(true)
      }
    })

    it('should show all tools when version is 全部', () => {
      tools.selectedVersion.value = '全部'
      expect(tools.filteredTools.value.length).toBeGreaterThan(0)
    })
  })

  describe('组合过滤', () => {
    it('should filter by category and search query', () => {
      tools.selectedCategory.value = 'IDE'
      tools.searchQuery.value = 'Cursor'
      const result = tools.filteredTools.value
      expect(result.every(t => t.category === 'IDE')).toBe(true)
      expect(result.some(t => t.name.includes('Cursor'))).toBe(true)
    })

    it('should filter by version and category', () => {
      tools.selectedCategory.value = 'IDE'
      tools.selectedVersion.value = 'CN'
      const result = tools.filteredTools.value
      expect(result.every(t => t.category === 'IDE')).toBe(true)
      // 如果有过滤结果，验证版本过滤
      if (result.length > 0) {
        expect(result.every(t => t.versions.some(v => v.type.includes('CN')))).toBe(true)
      }
    })
  })

  describe('对比功能', () => {
    it('should add tool to compare selection', () => {
      const testTool = tools.tools.value[0]
      tools.toggleCompare(testTool)
      expect(tools.compareSelection.value).toContain(testTool)
    })

    it('should remove tool from compare selection when toggled again', () => {
      const testTool = tools.tools.value[0]
      tools.toggleCompare(testTool)
      tools.toggleCompare(testTool)
      expect(tools.compareSelection.value).not.toContain(testTool)
    })

    it('should limit compare selection to 3 tools', () => {
      // 先清空选择
      tools.compareSelection.value = []
      const testTools = tools.tools.value.slice(0, 4)
      testTools.forEach(tool => tools.toggleCompare(tool))
      expect(tools.compareSelection.value.length).toBeLessThanOrEqual(3)
    })

    it('should not add duplicate tools', () => {
      // 先清空选择
      tools.compareSelection.value = []
      const testTool = tools.tools.value[0]
      tools.toggleCompare(testTool)
      // 再次添加同一个工具应该被移除
      tools.toggleCompare(testTool)
      expect(tools.compareSelection.value.filter(t => t.id === testTool.id).length).toBe(0)
    })
  })

  describe('智能匹配', () => {
    it('should return null when matcher step is less than 5', () => {
      tools.matcherStep.value = 4
      expect(tools.matchResult.value).toBeNull()
    })

    it('should return matching tools when all answers provided', () => {
      tools.matcherStep.value = 5
      tools.matcherAnswers.value = {
        purpose: 'coding',
        budget: 'pro',
        region: 'global',
        scale: 'large'
      }
      expect(tools.matchResult.value).toBeInstanceOf(Array)
      expect(tools.matchResult.value.length).toBeGreaterThan(0)
    })

    it('should sort results by rating', () => {
      tools.matcherStep.value = 5
      tools.matcherAnswers.value = {
        purpose: 'coding',
        budget: 'pro',
        region: 'global',
        scale: 'large'
      }
      const results = tools.matchResult.value
      for (let i = 1; i < results.length; i++) {
        const prevRating = results[i - 1].personal_experience?.rating || 0
        const currRating = results[i].personal_experience?.rating || 0
        expect(prevRating).toBeGreaterThanOrEqual(currRating)
      }
    })

    it('should limit results to top 3', () => {
      tools.matcherStep.value = 5
      tools.matcherAnswers.value = {
        purpose: 'coding',
        budget: 'free',
        region: 'cn',
        scale: 'fast'
      }
      expect(tools.matchResult.value.length).toBeLessThanOrEqual(3)
    })
  })

  describe('重置功能', () => {
    it('should reset matcher state', () => {
      tools.matcherStep.value = 5
      tools.matcherAnswers.value = {
        purpose: 'coding',
        budget: 'pro',
        region: 'global',
        scale: 'large'
      }
      tools.resetMatcher()
      expect(tools.matcherStep.value).toBe(0)
      expect(tools.matcherAnswers.value).toEqual({
        purpose: '',
        budget: '',
        region: '',
        scale: ''
      })
    })
  })

  describe('暗黑模式', () => {
    it('should toggle dark mode', () => {
      const initialValue = tools.isDarkMode.value
      tools.isDarkMode.value = !initialValue
      expect(tools.isDarkMode.value).toBe(!initialValue)
    })
  })
})
