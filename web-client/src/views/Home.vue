<template>
  <div class="about">
    <div class="container">
      <div v-padding="20">
        <div class="h-panel h-panel-no-border">
          <div class="h-panel-bar">
            <span class="h-panel-title">超级中英词典</span>
            <span v-color:gray v-font="13">收录近200万个单词</span>
            <div class="h-panel-right">
              <ButtonGroup style="margin-right: 10px;">
                <div v-width="150"><Select type="object" v-model="search.typeSelect.value" :datas="search.typeSelect.param" :filterable="true"></Select></div>
              </ButtonGroup>
              <ButtonGroup style="margin-right: 10px;">
                <div v-width="80"><Select type="object" v-model="search.mateSelect.value" :datas="search.mateSelect.param" :filterable="true"></Select></div>
              </ButtonGroup>
              <Search placeholder="输入要搜索的内容" @search="onSearch()" v-model="search.value" v-width="200"></Search>
              <i class="h-split"></i>
              <button class="h-btn h-btn-green h-btn-m" @click="onSearch()">超级搜</button>
            </div>
          </div>
          <div class="h-panel-bar filter-warp">
            <div v-width="400">
              <Form
                ref="form"
                :label-position="filter.labelPosition"
                :label-width="90"
                :model="filter.model"
              >
                <FormItem label="显示字段" prop="password">
                  <Select v-model="filter.model.select" :datas="filter.param" type="object" :multiple="true"></Select>
                </FormItem>
                <FormItem>
                  <Button color="primary" @click="filterConfirm">应用</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <div class="h-panel-body bottom-line">
            <Table :datas="datas" :columns="columns">
              <template slot-scope="props">
                <template v-for="(i, idx) in columns" >
                  <td v-if="i.prop ==='sn'" :key="idx">{{props.index}}</td>
                  <td v-if="i.prop !=='sn'" :key="idx">
                    <div v-if="i.isHtml===false||i.isHtml===undefined">{{props.data[i.prop]}}</div>
                    <div v-if="i.isHtml===true" v-html="props.data[i.prop]"></div>
                  </td>
                </template>
              </template>
            </Table>
          </div>
          <div class="h-panel-bar">
            <!-- <Pagination
              :cur="page.cur"
              :total="datasTotal"
              :small="true"
              align="right"
              @change="currentChange"
            ></Pagination> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import fly from 'flyio'

const dataModel = [
  { title: "序号", prop: "sn", width: 50 },
  { title: "单词", prop: "word", sortProp: 'word', sort: 'auto'},
  { title: "英文释义", prop: "definition", isHtml: true},
  { title: "中文释义", prop: "translation", isHtml: true},
  { title: "词语位置", prop: "pos" },
  { title: "柯林斯星级", prop: "collins" },
  { title: "牛津三千核心词", prop: "oxford" },
  { title: "词类", prop: "tag" },
  { title: "英国国家语料库词频顺序", prop: "bnc" },
  { title: "当代语料库词频顺序", prop: "frq" },
  { title: "词型变化", prop: "exchange"},
];
export default {
  data() {
    return {
      search: {
        value: 'cet4',
        typeSelect: {
          param: this.getFilterOptions(),
          value: this.getFilterOptions()[7]
        },
        mateSelect: {
          param: [{
            title: '精准',
            key: 'precision'
          }, {
            title: '模糊',
            key: 'fuzzy'
          }, {
            title: '前匹配',
            key: 'front'
          }, {
            title: '尾匹配',
            key: 'behind'
          }],
          value: {
            title: '模糊',
            key: 'fuzzy'
          }
        }
      },
      filter: {
        isLoading: false,
        labelPosition: "left",
        labels: {
          left: "Label左对齐",
          right: "Label右对齐"
        },
        param: this.getFilterOptions(),
        model: {
          select: this.getDefaultFilterOptions()
        }
      },
      page: {
        cur: 1
      },
      columns: this.getTableColumns(),
      datas: [],
      datasTotal: 0,
      //datas: [{"word":"about","phonetic":"ә'baut","definition":"s. on the move<br />. all around or on all sides<br />. in the area or vicinity<br />. used of movement to or among many different places or in no particular direction","translation":"prep. 在...周围, 大约, 有关, 关于\\nadv. 大约, 四处, 在附近, 周围","pos":"","collins":"5","oxford":"1","tag":"zk gk","bnc":"63","frq":"46","exchange":"","detail":"","audio":""}]
    };
  },
  mounted() {
    this.filterConfirm();
  },
  methods: {
    currentChange(page) {
      this.page.cur = page.cur;
    },

    update() {
      this.select = [0, 4];
    },

    getTableColumns() {
      return _.cloneDeep(dataModel);
    },

    getFilterOptions() {
      let dm = _.cloneDeep(dataModel);
      dm.forEach(i => {
        i.key = i.prop;  
      });
      return dm;
    },

    getDefaultFilterOptions() {
      let select = this.getFilterOptions().filter(i => {
        if ( i.title === '序号' || i.title === '单词' || i.title === '中文释义' ) {
          return i;
        }
      });
      return select;
    },

    filterConfirm() {
      let dm = _.cloneDeep(this.filter.model.select);
      dm.forEach(i => {
        i.prop = i.key;
        delete i.key;  
      });
      this.columns = dm;
    },

    async onSearch() {
      let res = await fly.get(`http://127.0.0.1:3000/api/serach?field=${this.search.typeSelect.value.key}&keywords=${this.search.value}&mate=${this.search.mateSelect.value.key}`);
      if ( res.data.code === 0) {
        let datas = res.data.data;
        datas.forEach(item => {
          item.definition = item.definition.replace(/\\n/g, '<br />');
          item.translation = item.translation.replace(/\\n/g, '<br />');
        });
        this.datas = res.data.data;
        this.datasTotal = this.datas.length;
      } else {
        this.$Notice.error(res.data.msg);
      }
    },

    check(props) {
      console.log(props);
    }
  },
  components: {}
};
</script>

<style lang="less">
.container {
  width: 960px;
  height: auto;
  margin: 0px auto;

  .filter-warp {
    padding: 0px;
    padding-top: 24px;
  }

  .h-panel-body {
    padding: 0px;
  }

  .words-list {
    padding: 20px;
  }
}
</style>
