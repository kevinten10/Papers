import { ref, computed } from 'vue'
import toolsData from '../data/tools.json'

export function useTools() {
  const tools = ref(toolsData)
  const searchQuery = ref('')
  const selectedCategory = ref('全部')
  const selectedVersion = ref('全部') // 全部, CN, Global
  const isDarkMode = ref(false)
  const compareSelection = ref([])

  const categories = ['全部', 'IDE', 'CLI', 'LLM', 'APP', 'DESKTOP']
  const versions = ['全部', 'CN', 'Global']

  const filteredTools = computed(() => {
    return tools.value.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
      const matchesCategory =
        selectedCategory.value === '全部' || tool.category === selectedCategory.value
      const matchesVersion =
        selectedVersion.value === '全部' ||
        tool.versions.some((v) => v.type.includes(selectedVersion.value))
      return matchesSearch && matchesCategory && matchesVersion
    })
  })

  const toggleCompare = (tool) => {
    const index = compareSelection.value.findIndex((t) => t.id === tool.id)
    if (index > -1) {
      compareSelection.value.splice(index, 1)
    } else if (compareSelection.value.length < 3) {
      compareSelection.value.push(tool)
    }
  }

  // Tool Matcher Logic
  const matcherStep = ref(0)
  const matcherAnswers = ref({
    purpose: '',
    budget: '',
    region: '',
    scale: ''
  })

  const matchResult = computed(() => {
    if (matcherStep.value < 5) return null

    return tools.value
      .filter((t) => {
        let score = 0
        if (
          matcherAnswers.value.purpose === 'coding' &&
          (t.category === 'IDE' || t.category === 'CLI')
        )
          score += 2
        if (matcherAnswers.value.purpose === 'research' && t.category === 'APP') score += 2
        if (matcherAnswers.value.purpose === 'desktop' && t.category === 'DESKTOP') score += 3

        if (
          matcherAnswers.value.budget === 'free' &&
          t.versions.some((v) => v.pricing.includes('免费'))
        )
          score += 2
        if (
          matcherAnswers.value.budget === 'pro' &&
          t.versions.some((v) => v.pricing.includes('$20') || v.pricing.includes('订阅'))
        )
          score++

        if (matcherAnswers.value.region === 'cn' && t.versions.some((v) => v.type === 'CN'))
          score += 2
        if (matcherAnswers.value.region === 'global' && t.versions.some((v) => v.type === 'Global'))
          score += 2

        if (matcherAnswers.value.scale === 'large' && t.tags.includes('大项目利器')) score += 2
        if (matcherAnswers.value.scale === 'fast' && t.tags.includes('原型利器')) score += 2

        return score >= 2
      })
      .sort((a, b) => (b.personal_experience?.rating || 0) - (a.personal_experience?.rating || 0))
      .slice(0, 3)
  })

  const resetMatcher = () => {
    matcherStep.value = 0
    matcherAnswers.value = { purpose: '', budget: '', region: '', scale: '' }
  }

  return {
    tools,
    searchQuery,
    selectedCategory,
    selectedVersion,
    isDarkMode,
    compareSelection,
    categories,
    versions,
    filteredTools,
    toggleCompare,
    matcherStep,
    matcherAnswers,
    matchResult,
    resetMatcher
  }
}
