/// <reference path="../../typings/index.d.ts" />

/**
 * 瀑布流 Item 组件 Behavior
 * 封装 item 组件的核心逻辑，包括高度测量、图片加载等
 */
export const waterfallItemBehavior = Behavior({
  /**
   * Behavior 的数据
   */
  data: {
    imageLoaded: false,
    heightMeasured: false // 标记是否已测量过高度
  },

  /**
   * Behavior 的生命周期
   */
  lifetimes: {
    ready() {
      // 组件渲染完成后，测量实际高度
      wx.nextTick(() => {
        this.measureHeight()
      })
    }
  },

  /**
   * Behavior 的方法
   */
  methods: {
    /**
     * 测量组件实际渲染高度
     */
    measureHeight() {
      // 避免重复测量
      if (this.data.heightMeasured) {
        return
      }

      const query = this.createSelectorQuery()
      query.select('.waterfall-item').boundingClientRect((rect: any) => {
        if (rect && rect.height && rect.height > 0) {
          // 标记已测量
          this.setData({
            heightMeasured: true
          })
          // 通知父组件实际高度
          // 使用 properties 访问组件属性
          const itemId = (this.properties as any).itemId || ((this.properties as any).item as any)?._imageKey || ''
          this.triggerEvent('heightmeasured', {
            itemId,
            height: rect.height,
            item: (this.properties as any).item
          })
        }
      }).exec()
    },

    /**
     * 图片加载完成
     */
    onImageLoad() {
      this.setData({
        imageLoaded: true
      })
      // 通知父组件图片已加载
      this.triggerEvent('imageload', {
        item: (this.properties as any).item
      })
      // 图片加载完成后测量高度（如果还没测量过）
      // 使用延迟确保图片已完全渲染
      wx.nextTick(() => {
        setTimeout(() => {
          this.measureHeight()
        }, 50)
      })
    },

    /**
     * 点击项
     */
    onItemTap() {
      this.triggerEvent('itemtap', {
        item: (this.properties as any).item
      })
    }
  }
})

