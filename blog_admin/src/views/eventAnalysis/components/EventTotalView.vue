<template>
  <div class="app-container" style="padding-top: 0;position: relative">
    <el-button size="middle" type="primary" class="download-button">下 载</el-button>
    <!--<el-collapse-transition>-->
      <div v-show="headerSettingIsShow">
        <el-form ref="form" :model="form" align label-width="100px" size="medium" label-position="right">
          <el-form-item label="本品:" style="margin-bottom: 1%">
              <el-checkbox-group v-model="checkAll">
                <el-col :span="19">
                  <!--<el-checkbox v-for="item in cars" :key="item.content" :label="item.id" @change="carItemChange()">{{ item.content }}</el-checkbox>-->
                  <el-checkbox >智跑</el-checkbox>
                  <p style="margin:0;font-size: 12px;color: #CCCCCC;">注：本品只能选一个</p>
                </el-col>
              </el-checkbox-group>

            <!--<el-row v-for="carItem in carComProIndex" v-show="checkedCars.includes(carItem.id)" :key="carItem.id">-->
                <!--<el-col :span="2">-->
                  <!--<el-checkbox v-model="carComPro[carItem.content]" @change="carComProChange(carItem.content)">{{ carItem.content }}竞品：</el-checkbox>-->
                <!--</el-col>-->
                <!--<el-checkbox-group v-model="form.carIds[carItem.content]" @change="carComProItemChange(carItem.content)">-->
                  <!--<el-col :span="19">-->
                    <!--&lt;!&ndash;<el-checkbox v-for="item in carItem.compete" :key="item.content" :label="item.id">{{ item.content }}</el-checkbox>&ndash;&gt;-->
                    <!--<el-checkbox @change="carItemChange()">逍客</el-checkbox>-->
                    <!--<el-checkbox @change="carItemChange()">RX5</el-checkbox>-->
                    <!--<el-checkbox @change="carItemChange()">GS4</el-checkbox>-->
                    <!--<el-checkbox @change="carItemChange()">博越</el-checkbox>-->
                  <!--</el-col>-->
                <!--</el-checkbox-group>-->
            <!--</el-row>-->
          </el-form-item>

          <el-form-item label="竞品:" style="margin-bottom: 1%">
            <el-checkbox-group v-model="checkedCars">
              <el-col :span="19">
                <el-checkbox  v-for="cars in carComProIndex" :label="cars" :key="cars" >{{cars}}</el-checkbox>
                <!--<el-checkbox >RX5</el-checkbox>-->
                <!--<el-checkbox >GS4</el-checkbox>-->
                <!--<el-checkbox >博越</el-checkbox>-->
                <p style="margin:0;font-size: 12px;color: #CCCCCC;">注：竞品最多选择三个</p>
              </el-col>
            </el-checkbox-group>

          </el-form-item>

          <el-form-item label="媒体类型:" style="margin-bottom: 1%">
            <el-checkbox-group v-model="form.mediaType">
              <el-checkbox label="0" @change="form.mediaType = ['0']">全部</el-checkbox>
              <el-checkbox checked="true" v-for="item in MediaList" :key="item.name+item.id" :label="item.id" @change="showDialog(item) || (form.mediaType.includes('0') && form.mediaType.shift())">{{ item.name }}</el-checkbox>
              <!-- <el-checkbox label="6" @change="selfMediaTypeSelect() || form.mediaType.includes('0') && form.mediaType.shift()">自媒体</el-checkbox> -->
              <el-dialog
                v-for="item in MediaList"
                :key="item.name+item.key"
                :title="item.name"
                :visible.sync="form.mediaType.includes(item.id) && item.flag"
                width="50%"
                :before-close="handleClose"
                center
              >
                <el-checkbox-group v-model="form.mediaSelectType[item.id]">
                  <el-checkbox  label="99999" @change="form.mediaSelectType[item.id] = ['99999']">全部&#12288;</el-checkbox>
                  <el-checkbox checked="true" v-for="listItem in item.monitor" :key="listItem.name+listItem.id" :label="listItem.id" @change="form.mediaSelectType[item.id].includes('99999') && form.mediaSelectType[item.id].shift()">{{ listItem.name }}</el-checkbox>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="item.flag = false">取 消</el-button>
                  <el-button type="primary" @click="item.flag = false; form.mediaType.includes(item.id) || form.mediaType.push(item.id)">确 定</el-button>
                </span>
              </el-dialog>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="文章调性:" style="margin-bottom: 1%">
            <el-checkbox-group v-model="form.articleEvaluation">
              <el-checkbox checked="true" label="0" @change="form.articleEvaluation = ['0']">全部</el-checkbox>
              <el-checkbox checked="true" label="1" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">正面</el-checkbox>
              <el-checkbox checked="true" label="2" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">中性</el-checkbox>
              <el-checkbox checked="true" label="3" @change="form.articleEvaluation.includes('0') && form.articleEvaluation.shift()">负面</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="常用模版:" /> -->
          <div class="flex-box">
            <!-- <el-checkbox>是否保存为常用模版</el-checkbox> -->
            <el-button size="middle" type="primary" style="" @click="onSubmit">搜索</el-button>
          </div>
        </el-form>
      </div>
    <!--</el-collapse-transition>-->

    <!--<el-row type="flex" justify="center" align="middle">-->
      <!--<i :class="headerSettingIsShow?'el-icon-arrow-up':'el-icon-arrow-down'" style="font-size:60px;cursor: pointer;" @click="showSearchCond" />-->
    <!--</el-row>-->
  </div>
</template>

<script>
  import { YuqingKeywordList, YuqingMediaList, ArticleClassifyList, VideoClassifyList, YuqingHotTopicList } from '@/api/EventTotalView'
  import md5 from 'js-md5';

  export default {
    name: 'EventTotalView',
    data() {
      return {
        headerSettingIsShow: true,
        list: null,
        listLoading: true,

        form: {
          allCarIsTrue: false,
          carIds: {}, // 维护的参数对象

          mediaRank: ['0'], // 媒体等级：全部/A/B/C
          mediaAll: true, // 媒体类型全部选中
          mediaTitle: [], // 媒体类型第一级分类，全部选中的全集
          mediaType: ['0'], // 媒体类型选中的id
          mediaSelectType: [], // 每个媒体类型选择的对象
          mediaIndex: [], // key:[],每个一级分类对应的所有id

          articleType: ['0'],
          videoType: ['0'], // 短视频分类：全部/剧情/评测/旅游/用车/说车
          hotTopic: ['0'],
          articleEvaluation: ['0'], // 调性：全部/正面/中性/负面
          sortType: ['0'], // 排序方式0/1
          deduplication: 'false', // 是否去重
          date1: '', // 日期范围选择start
          date2: new Date(), // 日期范围选择end
          contentFilter: '0', // 内容筛选
          searchKeyword1: '', // 包含全部关键词
          searchKeyword2: '', // 包含以下任一关键词
          searchKeyword3: '', // 不包含以下关键词
          searchKeyword4: '' // 标题/链接搜索
        },

        formParams: {
          keywords: null,
          mediaRank: null,
          mediaIds: null, // 媒体类型id集合
          articleType: null,
          videoType: null,
          hotTopic: null,
          articleEvaluation: null,
          sortType: null,
          date1: null,
          date2: null,
          contentFilter: null,
          searchKeyword1: null, // 包含全部关键词
          searchKeyword2: null, // 包含以下任一关键词
          searchKeyword3: null, // 不包含以下关键词
          searchKeyword4: null  // 标题/链接搜索
        },

        // 从服务器请求来的车量数据
        cars: [],
        checkAll:true,
        checkedCars: ['逍客','RX5','GS4'],
        carName: [], // 所有汽车的名字，用于全选赋值
        carComPro: {}, // key:value->竞品：boolean，竞品中元素选中状态
        carComProIndex: ['逍客','RX5','GS4','博越'],
        carComProAllIndex: {}, // key:value->竞品：竞品元素名字，竞品全选时候用于判断

        MediaList: [],
        VideoClassifyList: [],
        ArticleClassifyList: [],
        hotTopicList: [],
        videoTypeId: null, // 短视频在媒体类型中的id，用于控制短视频类目的显隐
        carListSelect:[] // 选择汽车的的关键词名称，传给展示组件用于选择车型
      }
    },
    created() {
      const params = {}
      params.method = 'YuqingKeywordList'
      params.timestamp = +new Date()
      params.sign = md5(params.method + params.timestamp)
      // 关键词接口
      YuqingKeywordList(params).then(response => {
        this.cars = response.data
      //  新建checkedCars对象，默认选中前三项
        this.cars.sort((a, b) => {
          return a.id - b.id
        })

        // checkedCars，存储前三项的id
        for (let i = 0; i < 3; i++) {
          this.checkedCars[i] = this.cars[i].id
        }
        //新建carName对象，存储全选时的id
        for (let i = 0; i < this.cars.length; i++) {
          this.carName[i] = this.cars[i].id
        }
        // 新建竞品选择对象carComPro
        for (let i = 0; i < this.cars.length; i++) {
          if (this.cars[i].compete.length !== 0) {
            const name = this.cars[i].content
            this.$set(this.carComPro, name, false)
          }
        }
       // 新建竞品选择对象carComProIndex,name:[id]
        for (let i = 0; i < this.cars.length; i++) {
          if (this.cars[i].compete.length !== 0) {
            const name = this.cars[i].content
            this.carComProAllIndex[name] = []
            for (let j = 0; j < this.cars[i].compete.length; j++) {
              this.carComProAllIndex[name].push(this.cars[i].compete[j].id)
            }
          }
        }
        this.carComProIndex = this.cars.filter((item) => {
          return item.compete.length !== 0
        })
       // 新建carIds对象
        for (let i = 0; i < this.cars.length; i++) {
          this.$set(this.form.carIds, this.cars[i].content, [])
        }
      })

      // 媒体类型接口
      YuqingMediaList().then(response => {
        this.MediaList = response.data
        this.MediaList.sort((a, b) => {
          return a.id - b.id
        })

        // 获取短视频在媒体类型中的id
        this.videoTypeId = this.MediaList.find(item => {
          return item.name === '短视频'
        }).id

        this.MediaList.forEach(item => {
          this.$set(item, 'flag', false)
        })

        // 创建容器，key:[]，key为每个一级标题的名字
        for (let i = 0; i < this.MediaList.length; i++) {
          this.$set(this.form.mediaSelectType, this.MediaList[i].id, ['99999'])
        }

        // 把媒体类型的一级标题存储
        for (let i = 0; i < this.MediaList.length; i++) {
          this.$set(this.form.mediaTitle, i, this.MediaList[i].id)
        }

        // 一级标题存储对应所有monitor的id
        for (let i = 0; i < this.MediaList.length; i++) {
          const arr = []
          this.MediaList[i].monitor.forEach(item => {
            arr.push(item.id)
          })
          this.$set(this.form.mediaIndex, this.MediaList[i].id, arr)
        }
      })

      ArticleClassifyList().then(response => {
        this.ArticleClassifyList = response.data
        this.ArticleClassifyList.sort((a, b) => {
          return a.id - b.id
        })
      })
      VideoClassifyList().then(response => {
        this.VideoClassifyList = response.data
        this.VideoClassifyList.sort((a, b) => {
          return a.id - b.id
        })
      })
      YuqingHotTopicList().then(response => {
        this.hotTopicList = response.data
        this.hotTopicList.sort((a, b) => {
          return a.id - b.id
        })
      })
    },
    mounted() {
    },
    methods: {
      showDialog(obj) {
        obj.flag = true
        return false
      },
      // 关键词全部按钮选中
      allIsTrue() {
        this.$data.checkedCars = this.$data.form.allCarIsTrue ? this.$data.carName : []
      },
      // 本车车型选项变动时，检测是否已满，改变全部和
      carItemChange() {
        this.$data.form.allCarIsTrue = this.$data.checkedCars.length === this.$data.carName.length;
        this.$data.checkedCars.forEach((item,index) => {
          this.$set(this.$data.carListSelect,index,{
            name:this.cars[Number(item)-1].content,
            id:item
          })
        })
        this.bus.$emit('carListSelect', this.$data.carListSelect)
      },
      // 汽车竞品被点击
      carComProChange(name) {
        const carName = name
        this.$data.form.carIds[carName] = this.$data.carComPro[carName] ? this.$data.carComProAllIndex[carName] : []
      },
      // 竞品项元素被点击
      carComProItemChange(name) {
        const carComProName = name
        this.$data.carComPro[carComProName] = this.$data.form.carIds[carComProName].length === this.$data.carComProAllIndex[carComProName].length
      },
      // 舆情概况按钮，显示搜索条件设置面板
      showSearchCond() {
        this.headerSettingIsShow = !this.headerSettingIsShow
      },
      // 表单提交
      onSubmit() {
        // 关键词：获取关键词id构成的数组
        let keywords = Object.values(this.checkedCars)
        for (const item in this.form.carIds) {
          if (this.form.carIds[item].length !== 0) {
            keywords = keywords.concat(this.form.carIds[item])
          }
        }
        // 数组去重
        keywords = Array.from(new Set([...keywords]))

        // 媒体等级

        // 媒体类型：获取媒体类型id构成的数组
        let mediaIds = []
        if (this.form.mediaType.includes('0')) {
          this.form.mediaTitle.forEach(item => {
            mediaIds.push(item + '#')
          })
          mediaIds = mediaIds.join('|')
        } else {
          this.form.mediaType.forEach(item => {
            if (this.form.mediaSelectType[item].includes('99999')) {
              mediaIds.push(item + '#')
            } else {
              let arr = item + '#' + this.form.mediaSelectType[item].join(',')
              mediaIds = mediaIds.concat(arr)
            }
          })
          mediaIds = mediaIds.join('|')
        }

        // 文章分类
        let articleType = []
        if (this.form.articleType.includes('0')) {
          this.ArticleClassifyList.forEach(item => {
            articleType.push(item.id)
          })
        } else {
          articleType = this.form.articleType
        }

        // 短视频分类
        let videoType = []
        if (this.form.mediaType.includes(this.videoTypeId)) {
          if (this.form.videoType.includes('0')) {
            this.VideoClassifyList.forEach(item => {
              videoType.push(item.id)
            })
          } else {
            videoType = this.form.videoType
          }
        }

        // 热点话题
        let hotTopic = []
        if (this.form.hotTopic.includes('0')) {
          this.hotTopicList.forEach(item => {
            hotTopic.push(item.id)
          })
        } else {
          hotTopic = this.form.hotTopic
        }

        this.formParams.keywords = keywords
        this.formParams.mediaIds = mediaIds
        this.formParams.articleType = articleType
        this.formParams.videoType = videoType
        this.formParams.hotTopic = hotTopic

        this.bus.$emit('searchForm', this.$data.formParams)
      },

      // 对话框关闭
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      }
    }
  }
</script>
<style scoped>
  .flex-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .download-button {
    position: absolute;
    right: 2%;
  }
</style>
