<template>
  <div class="app-container">
    <el-row type="flex" align="middle">
      <span style="font-weight:600;font-size:30px;cursor: pointer;" @click="showSearchCond">评论舆情</span>
      <!-- <el-button type="text" style="margin-right:0px;margin-left:auto;line-height:24px;" @click="settingDialogVisible = true">
        <i class="el-icon-setting" style="font-size:28px;color:#606266;" />
      </el-button>-->
    </el-row>

    <el-collapse-transition>
      <div v-show="headerSettingIsShow" id="header-setting">
        <el-form
          ref="form"
          :model="form"
          align
          label-width="100px"
          size="medium"
          label-position="right"
        >
          <el-form-item label="关键词:">
             <!-- 本品组 -->
            <el-row :gutter="22" v-for="(item,zeroId) in carData">
              <el-col :span="2" :style="!zeroId?'padding:0px':''">
                <el-checkbox v-model="form.ownBrandFlag[item.id]" @change="allIsTrue(item.id)">{{item.name}}:</el-checkbox>
              </el-col>
              <el-col :span="20" :style="!zeroId?'padding:0px':''">
                <el-checkbox-group v-model="ownBrandNow[item.id]">
                  <!-- item.id是本品组id -->
                  <el-checkbox v-for="carId in ownBrand[item.id]" :key="carId" :label="carId" @change="carItemChange(item.id)">{{ carNameIndex[carId] }}</el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>

            <!-- 所有的竞品组都展示，只不过控制显隐 -->
            <el-row :gutter="22" v-for="item in Object.keys(comBrand)" v-show="ownIdTotal.includes(item)" :key="item">
                <el-col :span="2">
                  <el-checkbox v-model="comBrandFlag[item]" @change="comAllIsTrue(item)">{{ comIndex[item] }}:</el-checkbox>
                </el-col>
                <el-col :span="20">
                  <el-checkbox-group v-model="comBrandNow[item]" @change="comCarItemChange(item)">
                      <el-checkbox v-for="carId in comBrand[item]" :key="carId" :label="carId">{{ carNameIndex[carId] }}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="媒体级别:">
            <el-checkbox-group v-model="form.mediaRank">
              <el-checkbox label="0" @change="mediaRank(1)">全部</el-checkbox>
              <el-checkbox label="1" @change="mediaRank()">A级</el-checkbox>
              <el-checkbox label="2" @change="mediaRank()">B级</el-checkbox>
              <el-checkbox label="3" @change="mediaRank()">C级</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="媒体类型:">
            <el-checkbox-group v-model="form.mediaType">
              <el-checkbox label="0" @change="mediaType(1)">全部</el-checkbox>
              <el-checkbox
                v-for="item in MediaList"
                :key="item.id + 'MediaList'"
                :label="item.id"
                @change="mediaType(0,item)"
              >{{ item.name }}</el-checkbox>
              <!-- <el-checkbox label="6" @change="selfMediaTypeSelect() || form.mediaType.includes('0') && form.mediaType.shift()">自媒体</el-checkbox> -->
              <el-dialog
                v-for="item in MediaList"
                :key="item.name + item.key"
                :title="item.name"
                :visible.sync="form.mediaType.includes(item.id) && item.flag"
                width="60%"
                :show-close="false"
                center
              >
                <el-checkbox-group v-model="form.mediaSelectType[item.id]">
                  <el-checkbox
                    label="99999"
                    @change="mediaTypeItem(1,item.id)"
                  >全部&#12288;</el-checkbox>
                  <el-checkbox
                    v-for="listItem in item.monitor"
                    :key="listItem.id + 'monitorItem'"
                    :label="listItem.id"
                    @change="mediaTypeItem(0,item.id)"
                  >{{ listItem.name }}</el-checkbox>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="mediaTypeItemCancel(item)" style="margin-right:30px;">取 消</el-button>
                  <el-button
                    type="primary"
                    @click="mediaTypeItemConfirm(item)"
                  >确 定</el-button>
                </span>
              </el-dialog>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="文章分类:">
            <el-checkbox-group v-model="form.articleType">
              <el-checkbox label="0" @change="articleType(1)">全部</el-checkbox>
              <el-checkbox
                v-for="item in ArticleClassifyList"
                :key="item.id + 'ArticleClassifyList'"
                :label="item.id"
                @change="articleType(0)"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            v-show="form.mediaType.includes(videoTypeId) || form.mediaType.includes('0')"
            label="短视频分类:"
          >
            <el-checkbox-group v-model="form.videoType">
              <el-checkbox label="0" @change="videoType(1)">全部</el-checkbox>
              <el-checkbox
                v-for="item in VideoClassifyList"
                :key="item.id + 'VideoClassifyList'"
                :label="item.id"
                @change="videoType(0)"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="热点话题:">
            <el-checkbox-group v-model="form.hotTopic">
              <el-checkbox label="0" @change="hotTopic(1)">全部</el-checkbox>
              <el-checkbox
                v-for="item in hotTopicList"
                :key="item.id + 'hotTopicList'"
                :label="item.id"
                @change="hotTopic(0)"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="调性:">
            <el-checkbox-group v-model="form.property">
              <el-checkbox label="999" @change="property(1)">全部</el-checkbox>
              <el-checkbox label="1" @change="property()">正面</el-checkbox>
              <el-checkbox label="0" @change="property()">中性</el-checkbox>
              <el-checkbox label="2" @change="property()">负面</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="排序方式:">
            <el-radio-group v-model="form.sortType">
              <el-radio label="2,1">按文章发布顺序降序排列</el-radio>
              <el-radio label="1,1">按文章采集时间降序排列</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否去重:">
            <el-radio-group v-model="form.deduplication">
              <el-radio label="0">不去重</el-radio>
              <el-radio label="1">去重</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间选择:">
            <el-col>
              <el-date-picker
                v-model="form.date1"
                type="datetime"
                default-time="['00:00:00']"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间"
                style="width: 200px;"
              />至
              <el-date-picker
                v-model="form.date2"
                type="datetime"
                default-time="['23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择结束时间"
                style="width: 200px;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="内容筛选:">
            <el-radio-group v-model="form.contentFilter">
              <el-radio label="0">不限位置</el-radio>
              <el-radio label="1">仅在标题中</el-radio>
              <el-radio label="2">仅在内容中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键词设置:">
            <el-row style="margin-bottom:10px;">
              <div style="display:inline-block;margin-bottom:10px;">
                包含以下全部关键词：
                <el-input v-model="form.keywordAll" style="width:200px;" placeholder="关键词请以空格分开" />
              </div>&#12288;&#12288;&#12288;
              <div style="display:inline-block;margin-bottom:10px;">
                包含以下任一关键词：
                <el-input v-model="form.keywordOne" style="width:200px;" placeholder="关键词请以空格分开" />
              </div>&#12288;&#12288;&#12288;
              <div style="display:inline-block;">
                不包含以下关键词：
                <el-input
                  v-model="form.keywordExclude"
                  style="width:200px;"
                  placeholder="关键词请以空格分开"
                />
              </div>
            </el-row>
            <!-- <el-row>
              不包含以下关键词：<el-input v-model="form.keywordExclude" style="width:200px;margin-right:10px;" placeholder="关键词请以空格分开" />
              标题/链接搜索：<el-input v-model="form.searchKeyword4" style="width:200px;" placeholder="请输入标题或链接" />
            </el-row>-->
          </el-form-item>

          <!-- <el-form-item label="常用模版:" /> -->
          <div class="flex-box">
            <!-- <el-checkbox>是否保存为常用模版</el-checkbox> -->
            <el-button size="middle" type="primary" v-throttle="{callback:onSubmit,time:3000}">搜索</el-button>
          </div>
        </el-form>
      </div>
    </el-collapse-transition>

    <el-row type="flex" justify="center" align="middle">
      <i
        :class="headerSettingIsShow?'el-icon-arrow-up':'el-icon-arrow-down'"
        style="font-size:60px;cursor: pointer;"
        @click="showSearchCond"
      />
    </el-row>
  </div>
</template>

<script>
import {
  YuqingKeywordList,
  YuqingMediaList,
  ArticleClassifyList,
  VideoClassifyList,
  YuqingHotTopicList
} from "@/api/EventTotalView";
import md5 from "js-md5";

export default {
  name: "EventTotalView",
  data() {
    return {
      headerSettingIsShow: true,
      list: null,
      listLoading: true,

      form: {
        ownBrandFlag: {},
        mediaRank: ["0", "1", "2", "3"], // 媒体等级：全部/A/B/C
        mediaAll: true, // 媒体类型全部选中
        mediaTitle: [], // 媒体类型第一级分类，全部选中的全集
        mediaType: ["0"], // 媒体类型选中的id
        mediaSelectType: [], // 每个媒体类型选择的对象
        mediaIndex: [], // key:[],每个一级分类对应的所有id
        mediaIndexAll: [], // key:[]，每个一级分类的全集，包括99999
        articleType: ["0"],
        videoType: ["0"], // 短视频分类：全部/剧情/评测/旅游/用车/说车
        hotTopic: ["0"],
        property: ["999", "0", "1", "2"], // 调性：全部/正面/中性/负面
        date1: "", // 日期范围选择start
        date2: "", // 日期范围选择end
        contentFilter: "0", // 内容筛选012
        keywordAll: "", // 包含全部关键词
        keywordOne: "", // 包含以下任一关键词
        keywordExclude: "", // 不包含以下关键词
        // searchKeyword4: '', // 标题/链接搜索
        deduplication: "0", // 是否去重
        sortType: "2,1" // 1,1采集时间-降序
      },

      mediaTypeAll: [], // 媒体类型全选
      articleTypeAll: [], // 文章分类全选
      videoTypeAll: [], // 短视频全选
      hotTopicListAll: [], // 热点话题全选

      formParams: {
        keyword_id: "", // 车型ID列表: 用 | 隔开，例如 1|2|3
        level: "", // 媒体等级列表: 用 | 隔开，例如 1|2|3, 1-A 2-B 3-C
        media: "", // 媒体类型列表: 例如 1#|2#21,22|3#30,31,35
        articleType: "", // 文章分类
        videoType: "", // 视频分类
        hottopic: "", // 热点话题
        property: "", // 调性
        starttime: "",
        endtime: "",
        content_type: "", // 内容筛选类型
        content_all: "", // 包含全部关键词
        content_one: "", // 包含以下任一关键词
        content_exclude: "", // 不包含以下关键词// 标题/链接搜索
        ordertype: "2,1", // 排序方式x,y
        de_duplication: 0 // 是否去重
      },

      // 从服务器请求来的车辆数据
      carData: [], // 车辆总数据

      ownBrand: {}, // 本品组id:[本品车型id]
      comBrand: {}, // 竞品组id:[竞品车型id]
      comBrandFlag: {}, // 存在竞品的车id:Boolean
      ownBrandNow: {}, // 本品组当前选择状态——本品组id:[选中车id]
      comBrandNow: {}, // 竞品组当前选择状态——存在竞品车id:[选中车id]
      carNameIndex: {}, // 车id:车名
      comIndex: {}, // 存在竞品的车id:竞品组名称
      ownIdTotal: [], // 本品车被选中的id集合
      comIdTotal: [], // 竞品车被选中的id集合

      MediaList: [],
      VideoClassifyList: [],
      ArticleClassifyList: [],
      hotTopicList: [],
      videoTypeId: null // 短视频在媒体类型中的id，用于控制短视频类目的显隐
    };
  },
  created() {
    const params = {};
    params.method = "YuqingKeywordList";
    params.timestamp = +new Date();
    params.sign = md5(params.method + params.timestamp);
    // 关键词接口
    YuqingKeywordList(params).then(response => {
      this.carData = response.data;
      this.carData.sort((a, b) => {
        return a.id - b.id;
      });

      // 每个本品组的控制flag
      this.carData.forEach(item => {
        this.$set(this.form.ownBrandFlag, item.id, false);
      });
      // console.log('本品状态Flag: ',this.form.ownBrandFlag);

      // ownBrand——key:value——本品组id:[本品车型id]
      this.carData.forEach(item => {
        let arr = [];
        item.data.forEach(i => {
          arr.push(i.id);
        });
        this.ownBrand[item.id] = arr;
      });
      // console.log('本品全选控制ownBrand: ',this.ownBrand);

      // carNameIndex——key:value——所有车型id:'车名'
      this.carNameIndex = {};
      let tempArr = [];
      this.carData.forEach(item => {
        tempArr = tempArr.concat(item.data);
      });
      tempArr.forEach(item => {
        // 本品车型
        this.carNameIndex[item.id] = item.content;
        // 竞品状态Flag——comBrandFlag
        if (item.compete.length !== 0) {
          this.$set(this.comBrandFlag, item.id, false);
          this.$set(this.comIndex, item.id, item.compete_name);
          let arr = [];
          item.compete.forEach(item => {
            // 竞品车型
            this.carNameIndex[item.id] = item.content;
            arr.push(item.id);
          });
          this.$set(this.comBrand, item.id, arr);
        }
      });
      // console.log('车名索引carNameIndex: ',this.carNameIndex);
      // console.log('竞品状态Flag——comBrandFlag: ',this.comBrandFlag);

      // 本品组当前选择状态——存在竞品车id:[选中车id]
      Object.keys(this.form.ownBrandFlag).forEach(item => {
        this.$set(this.ownBrandNow, item, []);
      });
      // console.log('本品组当前选择状态——ownBrandNow: ',this.ownBrandNow);

      // 竞品组当前选择状态——本品组id:[选中车id]
      Object.keys(this.comBrandFlag).forEach(item => {
        this.$set(this.comBrandNow, item, []);
      });
      // console.log('竞品组当前选择状态——comBrandNow: ',this.comBrandNow);

      // 默认选中前三项,少于三项则选中第一项
      for (let i = 0; i < 3; i++) {
          let index = Object.keys(this.ownBrand)[0]
          let target = this.ownBrand[index]
          this.ownBrandNow[index] = target.length <= 3 ? target : target.slice(0,3)
          if(target.length <= 3){
            this.form.ownBrandFlag[index] = true;
          }
          this.ownIdTotal = this.ownBrandNow[index];  // 初始选中
      }

      // 先给下方的车型筛选下拉框初始化数据
      let arr = [];
      this.ownIdTotal.forEach(item => {
        arr.push(item);
      });
      arr = arr.join("|");
      const carListSelect = [
        {
          name: "全部",
          id: arr
        }
      ];
      this.ownIdTotal.forEach((item, index) => {
        // 选择汽车的的关键词名称，传给展示组件用于选择车型
        this.$set(carListSelect, index + 1, {
          name: this.carNameIndex[item],
          id: item
        });
      });
      this.bus.$emit("carListSelect_commentEvent", carListSelect);
    });

    // 媒体类型接口
    YuqingMediaList().then(response => {
      this.MediaList = response.data;
      this.MediaList.sort((a, b) => {
        return a.id - b.id;
      });

      // 获取短视频在媒体类型中的id
      this.videoTypeId = this.MediaList.find(item => {
        return item.name === "短视频";
      }).id;

      this.MediaList.forEach(item => {
        this.$set(item, "flag", false);
      });

      // 把媒体类型的一级标题存储
      for (let i = 0; i < this.MediaList.length; i++) {
        this.$set(this.form.mediaTitle, i, this.MediaList[i].id);
      }

      // 一级标题存储对应所有monitor的id
      for (let i = 0; i < this.MediaList.length; i++) {
        const arr = [];
        this.MediaList[i].monitor.forEach(item => {
          arr.push(item.id);
        });
        this.$set(this.form.mediaIndexAll, this.MediaList[i].id, ["99999"].concat(arr));
        this.$set(this.form.mediaIndex, this.MediaList[i].id, arr);
      }

      // 创建容器，key:[]，key为每个一级标题的名字
      for (let i = 0; i < this.MediaList.length; i++) {
        let id = this.MediaList[i].id
        this.$set(this.form.mediaSelectType, id, this.form.mediaIndexAll[id]);
      }
      console.log(this.form.mediaSelectType)

      this.MediaList.forEach(item => {
        this.form.mediaType.push(item.id);
      });

      this.mediaTypeAll = Object.keys(this.form.mediaType);
    });

    ArticleClassifyList().then(response => {
      this.ArticleClassifyList = response.data;
      this.ArticleClassifyList.sort((a, b) => {
        return a.id - b.id;
      });
      this.ArticleClassifyList.forEach(item => {
        this.form.articleType.push(item.id);
      });
      this.articleTypeAll = this.form.articleType;
    });
    VideoClassifyList().then(response => {
      this.VideoClassifyList = response.data;
      this.VideoClassifyList.sort((a, b) => {
        return a.id - b.id;
      });
      this.VideoClassifyList.forEach(item => {
        this.form.videoType.push(item.id);
      });
      this.videoTypeAll = this.form.videoType;
    });

    YuqingHotTopicList().then(response => {
      this.hotTopicList = response.data;
      this.hotTopicList.sort((a, b) => {
        return a.id - b.id;
      });
      this.hotTopicList.forEach(item => {
        this.form.hotTopic.push(item.id);
      });
      this.hotTopicListAll = this.form.hotTopic;
    });
  },
  mounted() {},
  methods: {
    showDialog(obj) {
      obj.flag = true;
    },

    // 获取本品组中选中的车id
    findOwnId() {
      // 本品id构成的数组
      let ownIdTotal = [];
      let group = Object.keys(this.form.ownBrandFlag);
      group.forEach(item => {
        if (this.form.ownBrandFlag[item]) {
          ownIdTotal = ownIdTotal.concat(this.ownBrand[item]);
        } else {
          ownIdTotal = ownIdTotal.concat(this.ownBrandNow[item]);
        }
      });
      this.ownIdTotal = ownIdTotal;
      this.createcarList();
    },

    // 获取竞品组中选中的车id
    findComId() {
      // 竞品id构成的数组
      let comIdTotal = [];
      let group = Object.keys(this.comBrandFlag);
      group.forEach(item => {
        if (this.comBrandFlag[item]) {
          comIdTotal = comIdTotal.concat(this.comBrand[item]);
        } else {
          comIdTotal = comIdTotal.concat(this.comBrandNow[item]);
        }
      });
      this.comIdTotal = comIdTotal;
      this.createcarList();
    },

    createcarList() {
      let arr = [];
      this.ownIdTotal.forEach(item => {
        arr.push(item);
      });
      this.comIdTotal.forEach(item => {
        arr.push(item);
      });
      arr = arr.join("|");
      const carListSelect = [
        {
          name: "全部",
          id: arr
        }
      ];
      
      let allCar = []
      allCar = this.ownIdTotal.concat(this.comIdTotal)
      allCar.forEach((item, index) => {
        // 选择汽车的的关键词名称，传给展示组件用于选择车型
        this.$set(carListSelect, index + 1, {
          name: this.carNameIndex[item],
          id: item
        });
      });
      this.bus.$emit("carListSelect_commentEvent", carListSelect);
    },
    clearChoose(ownBrandId) {
      this.ownBrand[ownBrandId].forEach(item => {
        if (!this.ownBrandNow[ownBrandId].includes(item)) {
          this.comBrandFlag[item] = false;
          this.comBrandNow[item] = [];
        }
        this.findOwnId();
      });
    },

    // 关键词全部按钮选中
    allIsTrue(ownBrandId) {
      this.$data.ownBrandNow[ownBrandId] = this.$data.form.ownBrandFlag[
        ownBrandId
      ]
        ? this.$data.ownBrand[ownBrandId]
        : [];
      this.clearChoose(ownBrandId);
    },

    // 本车车型选项变动时，检测是否已满，改变全部和
    carItemChange(ownBrandId) {
      if (this.ownBrandNow[ownBrandId].length == 0) {
        this.$data.form.ownBrandFlag[ownBrandId] = false;
      } else {
        this.$data.form.ownBrandFlag[ownBrandId] =
          this.ownBrandNow[ownBrandId].length ===
          this.ownBrand[ownBrandId].length;
      }
      this.clearChoose(ownBrandId);
    },
    // 汽车竞品被点击
    comAllIsTrue(comBrandId) {
      this.$data.comBrandNow[comBrandId] = this.$data.comBrandFlag[comBrandId]
        ? this.$data.comBrand[comBrandId]
        : [];
      this.findComId();
    },
    // 竞品项元素被点击
    comCarItemChange(comBrandId) {
      if (this.comBrandNow[comBrandId].length == 0) {
        this.$data.comBrandFlag[comBrandId] = false;
        this.findComId();
      } else {
        this.$data.comBrandFlag[comBrandId] =
          this.comBrandNow[comBrandId].length ===
          this.comBrand[comBrandId].length;
        this.findComId();
      }
    },
    // 舆情概况按钮，显示搜索条件设置面板
    showSearchCond() {
      this.headerSettingIsShow = !this.headerSettingIsShow;
    },
    // 表单提交
    onSubmit() {
      // 关键词：获取关键词id构成的数组
      let arr = [];
      this.ownIdTotal.forEach(item => {
        arr = this.ownIdTotal.concat(this.comBrandNow[item]);
      });

      // 数组去重
      let keywords = arr.join("|");

      // 媒体等级
      let mediaRank = [];
      if (this.form.mediaRank.includes("0")) {
        // mediaRank = '1|2|3'
        mediaRank = "";
      } else {
        mediaRank = this.form.mediaRank.join("|");
      }

      // 媒体类型：获取媒体类型id构成的数组
      let mediaIds = [];
      if (this.form.mediaType.includes("0")) {
        // this.form.mediaTitle.forEach(item => {
        //   mediaIds.push(item + '#')
        // })
      } else {
        this.form.mediaType.forEach(item => {
          if (this.form.mediaSelectType[item].includes("99999")) {
            mediaIds.push(item + "#");
          } else {
            const arr = item + "#" + this.form.mediaSelectType[item].join(",");
            mediaIds = mediaIds.concat(arr);
          }
        });
      }
      mediaIds = mediaIds.join("|");

      // 文章分类
      let articleType = [];
      if (this.form.articleType.includes("0")) {
        // this.ArticleClassifyList.forEach(item => {
        //   articleType.push(item.id)
        // })
      } else {
        articleType = this.form.articleType;
      }
      articleType = articleType.join("|");

      // 短视频分类
      let videoType = [];
      if (
        this.form.mediaType.includes(this.videoTypeId) ||
        this.form.mediaType.includes("0")
      ) {
        if (this.form.videoType.includes("0")) {
          // this.VideoClassifyList.forEach(item => {
          //   videoType.push(item.id);
          // });
        } else {
          videoType = this.form.videoType;
        }
      }
      videoType = videoType.join("|");

      // 热点话题
      let hotTopic = [];
      if (this.form.hotTopic.includes("0")) {
        // this.hotTopicList.forEach(item => {
        //   hotTopic.push(item.id)
        // })
      } else {
        hotTopic = this.form.hotTopic;
      }
      hotTopic = hotTopic.join("|");

      // 调性
      let property = [];
      if (this.form.property.includes("999")) {
        // property = ''
      } else {
        property = this.form.property.join("|");
      }

      // 内容位置筛选
      this.formParams.keyword_id = keywords;
      this.formParams.level = mediaRank; // 媒体等级
      this.formParams.media = mediaIds; // 媒体类型
      this.formParams.articleType = articleType; // 文章类型和媒体类型都传递给下一级，不同页面各取所需即可
      this.formParams.videoType = videoType;
      this.formParams.hottopic = hotTopic;
      this.formParams.property = property; // 调性
      this.formParams.starttime = this.form.date1;
      this.formParams.endtime = this.form.date2;
      this.formParams.content_type = this.form.contentFilter; // 内容位置筛选
      this.formParams.content_all = this.form.keywordAll;
      this.formParams.content_one = this.form.keywordOne;
      this.formParams.content_exclude = this.form.keywordExclude;
      this.formParams.ordertype = this.form.sortType;
      this.formParams.de_duplication = this.form.deduplication; // 去重

      // console.log(this.formParams);
      if (keywords === "") {
        this.$notify.error({
          title: "提示",
          message: "请至少选择一个车型关键词",
          type: "error",
          duration: 1500
        });
      } else if (!this.form.mediaRank.includes("0") && mediaRank === "") {
        this.$notify.error({
          title: "提示",
          message: "请至少选择一个媒体级别",
          type: "error",
          duration: 1500
        });
      } else if (!this.form.mediaType.includes("0") && mediaIds === "") {
        this.$notify.error({
          title: "提示",
          message: "请至少选择一个媒体类型",
          type: "error",
          duration: 1500
        });
      } else if (!this.form.articleType.includes("0") && articleType === "") {
        this.$notify.error({
          title: "提示",
          message: "请至少选择一个文章分类",
          type: "error",
          duration: 1500
        });
      } else if (
        (!this.form.mediaType.includes(this.videoTypeId) ||
        !this.form.mediaType.includes("0")) && !this.form.videoType.includes("0") && videoType === ""
      ) {
          this.$notify.error({
            title: "提示",
            message: "请至少选择一个短视频分类",
            type: "error",
            duration: 1500
          });
      } else if (!this.form.hotTopic.includes("0") && hotTopic === "") {
        this.$notify.error({
          title: "提示",
          message: "请至少选择一个热点话题",
          type: "error",
          duration: 1500
        });
      } else if (!this.form.property.includes("999") && property === "") {
        this.$notify.error({
          title: "提示",
          message: "请至少选择一个调性",
          type: "error",
          duration: 1500
        });
      } else {
        this.bus.$emit("form_submit_commentEvent", this.$data.formParams);
      }
    },

    // 对话框关闭
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done()
    //     })
    //     .catch(_ => {});
    // },

    mediaRank(e) {
      if (e) {
        if(this.form.mediaRank.length == 3 && !this.form.mediaRank.includes("0")){
          this.form.mediaRank = [];
        } else {
          this.form.mediaRank = ["0", "1", "2", "3"];
        }
      } else {
        if (this.form.mediaRank.includes("0")) {
          this.form.mediaRank.shift();
        }
        if (this.form.mediaRank.length == 3) {
          this.form.mediaRank = ["0", "1", "2", "3"];
        }
      }
    },

    mediaType(e, item) {
      if (e) {
        if(this.form.mediaType.length == this.mediaTypeAll.length - 1 && !this.form.mediaType.includes("0")){
          this.form.mediaType = [];
        } else {
          this.form.mediaType = this.mediaTypeAll;
          this.MediaList.forEach(item => {
            item.flag = false;
          })
        }
      } else {
        if (this.form.mediaType.includes("0")) {
          this.form.mediaType.shift();
        }
        this.showDialog(item);
      }
    },

    mediaTypeItem(e,id){
      if(e) {
        if(this.form.mediaSelectType[id].length === this.form.mediaIndexAll[id].length - 1 && !this.form.mediaSelectType[id].includes("99999")){
          this.form.mediaSelectType[id] = [];
        } else {
          this.form.mediaSelectType[id] = this.form.mediaIndexAll[id];
        }
      } else {
          this.form.mediaSelectType[id].includes("99999") && this.form.mediaSelectType[id].shift()
          if (this.form.mediaSelectType[id].length === this.form.mediaIndexAll[id].length - 1) {
            this.form.mediaSelectType[id] = this.form.mediaIndexAll[id];
          }
      }
    },

    property(e) {
      if (e) {
        this.form.property =
          this.form.property.length == 3 && !this.form.property.includes("999") ? [] : ["999", "0", "1", "2"];
      } else {
        if (this.form.property.includes("999")) {
          this.form.property.shift();
        }
        if (this.form.property.length == 3) {
          this.form.property = ["999", "0", "1", "2"];
        }
      }
    },
    hotTopic(e) {
      if (e) {
        this.form.hotTopic =
          this.form.hotTopic.length === this.hotTopicListAll.length - 1 && !this.form.hotTopic.includes("0")
            ? []
            : this.hotTopicListAll;
      } else {
        if (this.form.hotTopic.includes("0")) {
          this.form.hotTopic.shift();
        }
        if (this.form.hotTopic.length === this.hotTopicListAll.length - 1) {
          this.form.hotTopic = this.hotTopicListAll;
        }
      }
    },

    videoType(e) {
      if (e) {
        this.form.videoType =
          this.form.videoType.length === this.videoTypeAll.length - 1 && !this.form.videoType.includes("0")
            ? []
            : this.videoTypeAll;
      } else {
        if (this.form.videoType.includes("0")) {
          this.form.videoType.shift();
        }
        if (this.form.videoType.length === this.videoTypeAll.length - 1) {
          this.form.videoType = this.videoTypeAll;
        }
      }
    },

    articleType(e) {
      if (e) {
        this.form.articleType =
          this.form.articleType.length === this.articleTypeAll.length - 1 && !this.form.articleType.includes("0")
            ? []
            : this.articleTypeAll;
      } else {
        if (this.form.articleType.includes("0")) {
          this.form.articleType.shift();
        }
        if (this.form.articleType.length === this.articleTypeAll.length - 1) {
          this.form.articleType = this.articleTypeAll;
        }
      }
    },

    mediaTypeItemCancel(item){
      item.flag = false;
      if(this.form.mediaType.indexOf(item.id) !== -1){
        this.form.mediaType.splice(this.form.mediaType.indexOf(item.id),1);
      }
      this.form.mediaSelectType[item.id] = this.form.mediaIndexAll[item.id]
    },
    mediaTypeItemConfirm(item){
      item.flag = false;
      this.form.mediaType.includes(item.id) || this.form.mediaType.push(item.id);
      if(this.form.mediaType.length == this.mediaTypeAll.length - 1 && !this.form.mediaType.includes("0")){
          this.form.mediaType = this.mediaTypeAll;
      }
    }
  }
};
</script>
<style scoped>
#header-setting {
  margin: 10px auto 0px;
  padding: 25px 0;
  border-top: 1px solid #e9d6cf;
  border-bottom: 1px solid #e9d6cf;
}
.flex-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-checkbox {
  margin-right: 10px;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>

