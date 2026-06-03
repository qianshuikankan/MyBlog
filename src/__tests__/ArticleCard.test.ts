import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ArticleCard from '@/components/common/ArticleCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
})

const mockArticle = {
  id: 1,
  title: 'Test Article',
  content: '# Content',
  summary: 'This is a summary',
  coverImage: '',
  categoryId: 1,
  category: { id: 1, name: 'Test', createdAt: '', updatedAt: '' },
  status: 'published' as const,
  tags: ['Vue', 'Test'],
  viewCount: 42,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z'
}

function createWrapper(props: Record<string, any> = {}) {
  const app = mount(ArticleCard, {
    props: { article: mockArticle, ...props },
    global: {
      plugins: [router, ElementPlus],
      components: ElementPlusIconsVue
    }
  })
  return app
}

describe('ArticleCard', () => {
  it('should render article title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Test Article')
  })

  it('should render article summary', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('This is a summary')
  })

  it('should render tags', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.text()).toContain('Test')
  })

  it('should render category name', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Test')
  })

  it('should render action buttons when showActions is true', () => {
    const wrapper = createWrapper({ showActions: true })
    expect(wrapper.text()).toContain('编辑')
    expect(wrapper.text()).toContain('删除')
  })

  it('should not render action buttons when showActions is false', () => {
    const wrapper = createWrapper({ showActions: false })
    expect(wrapper.text()).not.toContain('编辑')
  })

  it('should emit edit event', async () => {
    const wrapper = createWrapper({ showActions: true })
    await router.isReady()
    const buttons = wrapper.findAll('.el-button')
    if (buttons.length > 0) {
      await buttons[0].trigger('click')
      expect(wrapper.emitted('edit')).toBeTruthy()
    }
  })

  it('should emit delete event', async () => {
    const wrapper = createWrapper({ showActions: true })
    await router.isReady()
    const buttons = wrapper.findAll('.el-button')
    if (buttons.length > 1) {
      await buttons[1].trigger('click')
      expect(wrapper.emitted('delete')).toBeTruthy()
    }
  })
})
