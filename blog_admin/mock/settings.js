import Mock from 'mockjs'

const List = []
const ruleList = []
const count = 28

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    name: '@first',
    weight: '@integer(1, 5)',
    title: '@title(1, 2)',
    'articleSwitch|1': ['0', '1'],
    'commentSwitch|1': ['0', '1'],
    'frequency|1': ['30min', '1h', '1.5h'],
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['君威', '起亚', '迈腾', '帕萨特'],
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    'mediaLevel|1': ['A', 'B', 'C'],
    'mediaType|1': ['门户', '自媒体', '视频', '新闻'],
    'group|1': ['本品组', '竞品组'],
    domain: '@domain',
    keywords: '特征词'
  }))
}

for (let i = 0; i < 14; i++) {
  ruleList.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    name: '@first',
    'type|1': ['君威', '起亚', '迈腾', '帕萨特'],
    domain: '@domain',
    'keywords|1-3': ['@string'],
    'contKeywords|1-3': ['@string'],
    'authorKeywords|1-3': ['@string'],
    noKeywords: '排除SSSS',
    weight: '@integer(1, 5)'
  }))
}

export default [
  {
    url: '/settings/list',
    type: 'get',
    response: config => {
      const { articleSwitch, commentSwitch, mediaLevel, title, type, page = 1, limit = 20 } = config.query

      const mockList = List.filter(item => {
        if (articleSwitch && item.articleSwitch !== articleSwitch) return false
        if (commentSwitch && item.commentSwitch !== commentSwitch) return false
        if (mediaLevel && item.mediaLevel !== mediaLevel) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

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
    url: '/settings/rulelist',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = ruleList.filter(item => {
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
    url: '/settings/detail',
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
    url: '/settings/pv',
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
    url: '/settings/create',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/settings/update',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]

