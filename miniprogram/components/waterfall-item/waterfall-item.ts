import { waterfallItemBehavior } from '../../behaviors/waterfall-item-behavior'

Component({
  options: {
    multipleSlots: true // 启用多插槽支持
  },

  behaviors: [waterfallItemBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
    // 数据项
    item: {
      type: Object,
      value: {}
    },
    // 是否已加载
    loaded: {
      type: Boolean,
      value: false
    },
    // 图片容器高度
    imageHeight: {
      type: Number,
      value: 0
    },
    // 图片模式
    imageMode: {
      type: String,
      value: 'aspectFill'
    },
    // 是否显示默认内容
    showDefaultContent: {
      type: Boolean,
      value: true
    },
    // 自定义类名
    customClass: {
      type: String,
      value: ''
    },
    // item 的唯一标识
    itemId: {
      type: String,
      value: ''
    }
  },

})

