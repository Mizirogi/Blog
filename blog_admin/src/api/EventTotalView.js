import request from '@/utils/request'
import md5 from 'js-md5';
var timestamp = +new Date();

//  参数生成器
function paramsCreator(name){
  let params = {}
  params.method = name;
  params.timestamp = +new Date();
  params.sign = md5(params.method + params.timestamp);
  return params
}

// 接口2.1: 实时舆情车型列表
export function YuqingKeywordList(data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 接口2.2: 实时舆情媒体类型列表
export function YuqingMediaList() {
  let data = paramsCreator('YuqingMediaList')
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 接口2.3.1: 实时舆情文章分类列表
export function ArticleClassifyList() {
  let data = {};
  data.method = "YuqingClassifyList";
  data.timestamp = +new Date();
  data.sign = md5(data.method + data.timestamp);
  data.type = 1;
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 接口2.3.2: 实时舆情文章分类列表
export function VideoClassifyList() {
  let data = {};
  data.method = "YuqingClassifyList";
  data.timestamp = +new Date();
  data.sign = md5(data.method + data.timestamp);
  data.type = 2;
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 接口2.4: 实时舆情热点话题列表
export function YuqingHotTopicList() {
  let data = paramsCreator('YuqingHotTopicList')
  return request({
    url: '',
    method: 'post',
    data
  })
}
