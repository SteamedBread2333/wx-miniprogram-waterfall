// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    showPop: false,
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    // 瀑布流数据 - 使用风景图片
    waterfallList: [
      {
        id: 1,
        image: 'https://picsum.photos/400/600?random=1',
        title: '美丽的山景'
      },
      {
        id: 2,
        image: 'https://picsum.photos/400/500?random=2',
        title: '宁静的湖泊'
      },
      {
        id: 3,
        image: 'https://picsum.photos/400/700?random=3',
        title: '森林小径'
      },
      {
        id: 4,
        image: 'https://picsum.photos/400/550?random=4',
        title: '秋日风景'
      },
      {
        id: 5,
        image: 'https://picsum.photos/400/650?random=5',
        title: '海边日落'
      },
      {
        id: 6,
        image: 'https://picsum.photos/400/580?random=6',
        title: '雪山风光'
      },
      {
        id: 7,
        image: 'https://picsum.photos/400/620?random=7',
        title: '田园风光'
      },
      {
        id: 8,
        image: 'https://picsum.photos/400/540?random=8',
        title: '山谷美景'
      },
      {
        id: 9,
        image: 'https://picsum.photos/400/680?random=9',
        title: '星空下的风景'
      },
      {
        id: 10,
        image: 'https://picsum.photos/400/590?random=10',
        title: '壮丽的山脉'
      },
      {
        id: 11,
        image: 'https://picsum.photos/400/630?random=11',
        title: '晨曦美景'
      },
      {
        id: 12,
        image: 'https://picsum.photos/400/560?random=12',
        title: '自然风光'
      }
    ]
  },
  onLoad(query) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const { scene } = wx.getLaunchOptionsSync();
    if(scene === 1154) {
      console.log('scene1154', query, scene)
    }
  },
  onShareTimeline() {
    return {
      title: '标题标题标题标题',
      imageUrl: '',
      query: 'a=123&b=456'
    };
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e: any) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  tap() {
    this.setData({'showPop': !this.data.showPop})
  },
  // 瀑布流点击事件
  onWaterfallItemTap(e: any) {
    const { item } = e.detail
    console.log('点击了瀑布流项:', item)
    wx.showToast({
      title: item.title || '点击了图片',
      icon: 'none'
    })
  },
  // 注意：onWaterfallImageLoad 和 onWaterfallItemHeightMeasured 方法已移除
  // 这些事件现在由 waterfall 组件内部处理，如果需要自定义处理，可以通过 waterfall 组件的事件来监听
})
