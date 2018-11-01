<template>
  <div class="statistics-index">
    <lc-row>
      <lc-panel>
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="site_id" placeholder="请选择站点" multiple @change="selectSite">
              <el-option
                v-for="item in siteList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchQuery.plat_id" placeholder="请选择短信平台">
              <el-option
                v-for="item in platFormList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchQuery.buttonDay" placeholder="阶段时间">
              <el-option :value="1" label="今日"/>
              <el-option :value="2" label="最近7日"/>
              <el-option :value="3" label="最近30日"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="time_stage"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="momentTime"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData">搜索</el-button>
          </el-form-item>
        </el-form>
      </lc-panel>
    </lc-row>
    <lc-row>
      <lc-panel title="短信发送情况">
        <el-table
          v-loading="loading"
          :data="list"
          border
          stripe
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column prop="cdate" label="时间"/>
          <el-table-column prop="site_name" label="站点"/>
          <el-table-column prop="plat_name" label="短信平台"/>
          <el-table-column prop="send_num" label="发送数"/>
          <el-table-column prop="send_rate" label="送达率"/>
          <el-table-column prop="send_success" label="发送成功数"/>
          <el-table-column prop="send_fail" label="发送失败数"/>
        </el-table>
        <el-pagination
          :current-page.sync="page"
          :page-size="pageSize"
          :total="total"
          style="margin-top: 20px;"
          layout="prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </lc-panel>
    </lc-row>
    <lc-row>
      <lc-panel>
        <div style="margin-bottom: 20px">
          <el-radio-group v-model="send_type" size="mini" @change="changeChart">
            <el-radio-button label="send_num">发送总数</el-radio-button>
            <el-radio-button label="send_rate">送达率</el-radio-button>
            <el-radio-button label="send_fail">发送失败数</el-radio-button>
          </el-radio-group>
        </div>
        <div
          v-loading="chartLoading"
          style="height: 400px"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
        >
          <div id="chart" class="charts" style="height:100%;width:100%"/>
        </div>
      </lc-panel>
    </lc-row>
  </div>
</template>
<script>
import echarts from 'echarts'
import moment from 'moment'
import statistics from '@/api/statistics'
import configplatform from '@/api/configplatform'
import lcRow from '@/components/Layout/lcRow.vue'
import lcPanel from '@/components/Layout/lcPanel.vue'
export default {
  components: {
    lcRow,
    lcPanel
  },
  data() {
    return {
      send_type: 'send_num',
      site_id: '',
      time_stage: '',
      pageSize: 10,
      loading: false,
      chartLoading: false,
      searchQuery: {
        site_id: '',
        plat_id: '',
        buttonDay: 3,
        chooseDay: '',
        page: 1
      },
      siteList: [],
      platFormList: [],
      list: [],
      allList: {},
      chart: null,
      page: 1,
      total: 1
    }
  },
  mounted() {
    this.initSelect()
    this.getData()
  },
  methods: {
    handleSizeChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val })
      this.changePageData()
    },
    handleCurrentChange(val) {
      this.searchQuery = Object.assign(this.searchQuery, { page: val })
      this.changePageData()
    },
    changeChart(val) {
      this.initChartData()
    },
    selectSite(val) {
      let str = ''
      val.forEach((value, index) => {
        if (index === 0) {
          str += value
        } else {
          str += ',' + value
        }
      })
      this.searchQuery.site_id = str
    },
    momentTime(val) {
      let str = ''
      if (val === undefined || val === null || val === '') {
        this.sendtime = ''
        return
      }
      val.forEach((value, index) => {
        if (index === 0) {
          str += moment(value).format('YYYY-MM-DD')
        } else {
          str += `~${moment(value).format('YYYY-MM-DD')}`
        }
      })
      this.searchQuery.chooseDay = str
    },
    initSelect() {
      configplatform.allselect().then(res => {
        this.siteList = res.data.site
        this.platFormList = res.data.plat
      })
    },
    getData() {
      this.loading = true
      this.chartLoading = true
      statistics.getData().then(res => {
        this.chartLoading = false
        this.loading = false
        if (res.data.list) {
          this.searchQuery.plat_id = res.data.list[0].plat_id || 0
          this.list = res.data.list
          this.allList = res.data.all_list
          this.total = parseInt(res.data.total) || 1
          this.pageSize = parseInt(res.data.pagesize) || 10
          this.initChartData()
        }
      }, error => {
        this.chartLoading = false
        this.loading = false
      })
    },
    changePageData() {
      this.loading = true
      statistics.getData(this.searchQuery).then(res => {
        this.loading = false
        this.list = res.data.list
        this.total = parseInt(res.data.total) || 1
      }, error => {
        this.loading = false
      })
    },
    searchData() {
      this.chartLoading = true;
      this.loading = true;
      this.searchQuery.page = 1;
      statistics.getData(this.searchQuery).then(res => {
        this.chartLoading = false
        this.loading = false
        this.list = res.data.list
        this.allList = res.data.all_list
        this.total = parseInt(res.data.total) || 1
        this.initChartData()
      }, error => {
        this.chartLoading = false
        this.loading = false
      })
    },
    initChartData() {
      const data = this.allList || [];
      const chartData = []
      const colorList = ['#D2A05F', '#FDE23D', '#00B8AC', '#D8C0B5', '#00AAEE', '#67C23A', '#E6A23C', '#F56C6C', '#409EFF']
      const resultData = {
        date: data.date,
        series: [],
        site_name: [],
        type: this.send_type === 'send_rate' ? '%' : '条'
      }
      if(data.list != undefined){
        data.list.forEach((value, index) => {
          const seriesData = {}
          seriesData.data = []
          resultData.site_name.push(value.site_name)
          seriesData.name = value.site_name
          seriesData.rgb = colorList[index];
          if(value.data != undefined){
             value.data.forEach((item, index) => {
              seriesData.data.push(item[this.send_type])
            })
          }
          resultData.series.push(this.initSeries(seriesData))
        })
      }
      this.initChart(resultData)
    },
    initSeries(i) {
      return {
        name: i.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        itemStyle: {
          normal: {
            color: i.rgb
          }
        },
        data: i.data
      }
    },
    initChart(chartData) {
      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.clear()
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '发送统计图',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: chartData.site_name,
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: chartData.date
        }],
        yAxis: [{
          type: 'value',
          name: chartData.type,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: chartData.series
      })
    }
  }
}
</script>