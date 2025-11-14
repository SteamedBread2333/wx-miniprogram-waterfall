/// <reference path="../../typings/index.d.ts" />

/**
 * 瀑布流组件 Behavior
 * 封装瀑布流的核心逻辑，包括数据分配、高度测量、事件处理等
 */
export const waterfallBehavior = Behavior({
  /**
   * Behavior 的数据
   */
  data: {
    leftList: [] as any[],
    rightList: [] as any[],
    leftHeight: 0,
    rightHeight: 0,
    loadedImages: {} as Record<string, boolean>, // 记录已加载的图片
    itemHeights: {} as Record<string, number>, // 记录每个 item 的实际渲染高度
    isMeasuring: false // 是否正在测量高度
  },

  /**
   * Behavior 的方法
   */
  methods: {
    /**
     * 分配数据到左右两列（使用 wx.getImageInfo 获取实际图片尺寸）
     */
    async distributeItems(list: any[]) {
      const windowInfo = wx.getWindowInfo()
      const screenWidth = windowInfo.windowWidth
      // 全屏宽度：无左右padding，中间4rpx间距
      // rpx转px: 1rpx = screenWidth / 750
      const rpxToPx = screenWidth / 750
      const leftPadding = 0
      const rightPadding = 0
      const middleGap = 4 * rpxToPx
      const itemWidth = (screenWidth - leftPadding - rightPadding - middleGap) / 2

      // 并行获取所有图片的尺寸信息
      const imageInfoPromises = list.map((item, index) => {
        return new Promise<{ item: any; width: number; height: number; index: number }>((resolve) => {
          wx.getImageInfo({
            src: item.image,
            success: (res) => {
              resolve({
                item,
                width: res.width,
                height: res.height,
                index
              })
            },
            fail: () => {
              // 获取失败时使用默认值（宽高比 4:3）
              resolve({
                item,
                width: 400,
                height: 300,
                index
              })
            }
          })
        })
      })

      // 等待所有图片信息获取完成
      const imageInfos = await Promise.all(imageInfoPromises)

      // 根据实际图片尺寸进行瀑布流分配
      const leftList: any[] = []
      const rightList: any[] = []
      let leftHeight = 0
      let rightHeight = 0

      imageInfos.forEach(({ item, width, height, index }) => {
        // 1. 先根据图片高度进行初步估算（用于快速显示）
        const imageHeight = (height / width) * itemWidth
        // 暂时使用图片高度作为估算高度，实际高度会在渲染后测量
        const estimatedHeight = imageHeight

        // 将计算的高度存储到item中
        const itemWithHeight = {
          ...item,
          _estimatedHeight: estimatedHeight,
          _imageHeight: imageHeight, // 单独保存图片高度
          _itemWidth: itemWidth,
          _imageKey: `${item.id || index}`, // 用于标识图片的唯一key
          _actualWidth: width,
          _actualHeight: height
        }

        // 根据当前列高度决定放入哪一列
        // 注意：这里加上的是 item 容器高度 + rowGap（行间距）
        if (leftHeight <= rightHeight) {
          leftList.push(itemWithHeight)
          leftHeight += estimatedHeight + this.data.rowGap
        } else {
          rightList.push(itemWithHeight)
          rightHeight += estimatedHeight + this.data.rowGap
        }
      })

      this.setData({
        leftList,
        rightList,
        leftHeight,
        rightHeight
      })
      // 注意：不再主动调用 measureItemHeights，改为由 waterfall-item 组件自动测量并上报高度
    },

    /**
     * 接收 item 组件测量的实际高度
     */
    onItemHeightMeasured(e: any) {
      const { itemId, height } = e.detail || {}
      if (!itemId || !height) {
        return
      }

      // 只更新高度记录，不重新分配布局，避免页面闪烁
      // 初始分配已经基于图片高度，基本合理，重新分配会导致布局跳动
      const itemHeights = { ...this.data.itemHeights }
      itemHeights[itemId] = height

      this.setData({
        itemHeights
      })
    },

    /**
     * 根据实际测量的高度重新分配布局（可选方法，当前不使用以避免闪烁）
     */
    redistributeItems() {
      const allItems = [...this.data.leftList, ...this.data.rightList]
      const itemHeights = this.data.itemHeights

      // 如果还有未测量的 item，等待
      if (allItems.length > 0 && Object.keys(itemHeights).length < allItems.length) {
        return
      }

      const leftList: any[] = []
      const rightList: any[] = []
      let leftHeight = 0
      let rightHeight = 0

      allItems.forEach((item) => {
        const imageKey = item._imageKey || `${item.id}`
        // 使用实际测量的高度，如果没有则使用估算高度
        const actualHeight = itemHeights[imageKey] || item._estimatedHeight || 300

        // 更新 item 的实际高度
        const itemWithHeight = {
          ...item,
          _estimatedHeight: actualHeight,
          _actualRenderedHeight: actualHeight
        }

        // 根据当前列高度决定放入哪一列
        if (leftHeight <= rightHeight) {
          leftList.push(itemWithHeight)
          leftHeight += actualHeight + this.data.rowGap
        } else {
          rightList.push(itemWithHeight)
          rightHeight += actualHeight + this.data.rowGap
        }
      })

      this.setData({
        leftList,
        rightList,
        leftHeight,
        rightHeight,
        isMeasuring: false
      })
    },

    /**
     * 图片加载完成（来自模板中的组件）
     */
    onImageLoad(e: any) {
      const { item } = e.detail || e.currentTarget.dataset || {}
      if (item && item._imageKey) {
        // 标记图片已加载
        const loadedImages = { ...this.data.loadedImages }
        loadedImages[item._imageKey] = true
        this.setData({
          loadedImages
        })
      }
    },

    /**
     * 点击项（来自模板中的组件）
     */
    onItemTap(e: any) {
      const { item } = e.detail || e.currentTarget.dataset || {}
      this.triggerEvent('itemtap', { item })
    },

    /**
     * 重置瀑布流数据
     */
    resetWaterfall() {
      this.setData({
        leftList: [],
        rightList: [],
        leftHeight: 0,
        rightHeight: 0,
        loadedImages: {},
        itemHeights: {},
        isMeasuring: false
      })
    }
  }
})

