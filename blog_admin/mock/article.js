import Mock from 'mockjs'

const List = []
const count = 1000

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    'title|1': ['起亚K3降价0.70万售重庆', '起亚KX3傲跑11月22日上市 K3纯电动车\/FUTURON概念车同期亮相', '10万级别家轿,日产轩逸和大众斯柯达明锐选哪个'],
    'media|1': ['亚讯车网', '东方财富网', '汽车之家', '中国汽车质量网', '汽车网', '汽车之友', '车讯网', '车来车往', '易车网'],
    'car_type|1': ['起亚K3', '起亚K5', '起亚KX3', '福特领界', '日产轩逸'],
    'article_evaluation|1': ['正', '中', '负', '不良'],
    'article_type|1': ['新车上市', '车展新闻', '新车上市', '试驾体验', '促销优惠', '竞品狙击', '车主口碑'],
    'author|1': ['亚讯车网', '东方财富网', '汽车之家', '中国汽车质量网', '汽车网', '汽车之友', '车讯网', '车来车往', '易车网'],
    'display_time': /201[8-9]-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) ([0-1][0-9]|2[0-3]):[0-5][0-9]/,
    video_cover: 'https://s2.ax1x.com/2019/11/22/MTYOYR.jpg',
    reviewer: '@cname',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU', 'ALL'],
    'status|1': ['published', 'draft', 'deleted'],
    comment_disabled: true,
    image_uri,
    platforms: ['a-platform']
  }))
}

export default [
  {
    url: '/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 200,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]

