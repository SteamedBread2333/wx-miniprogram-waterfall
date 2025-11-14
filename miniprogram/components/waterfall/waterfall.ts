import { waterfallBehavior } from '../../behaviors/waterfall-behavior'

Component({
  behaviors: [waterfallBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
    // 数据列表
    list: {
      type: Array,
      value: []
    },
    // 列间距
    columnGap: {
      type: Number,
      value: 20
    },
    // 行间距
    rowGap: {
      type: Number,
      value: 20
    },
    // 自定义模板名称（需要在页面中定义 template）
    itemTemplate: {
      type: String,
      value: ''
    },
    // 是否使用 slot（如果为 true，则使用 slot 内容，否则使用模板）
    useSlot: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'list': function(list: any[]) {
      if (list && list.length > 0) {
        // 重置已加载图片记录和高度记录
        this.setData({
          loadedImages: {},
          itemHeights: {},
          isMeasuring: false
        })
        // 异步调用 distributeItems
        this.distributeItems(list)
      } else {
        // 使用 behavior 中的重置方法
        this.resetWaterfall()
      }
    }
  },

  lifetimes: {
    attached() {
      // 组件初始化
    }
  }
})

