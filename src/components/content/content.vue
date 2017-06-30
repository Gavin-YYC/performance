<template lang="html">
  <section class="main-content">
      <div class="timeline__date">
        <label class="timeline__date-label">
          <span>选择日志时间：</span>
          <input type="date" class="timeline__input" v-model="date">
        </label>
      </div>

      <div id="main" style="width: 600px;height:400px;"></div>

      <!--时间轴-->
      <div class="timeline__wrap">
        <p class="timeline__title">页面加载时间轴</p>
        <div class="timeline__count">
          平均总加载时间：{{average_time}}
        </div>
        <table class="timeline__table">
          <tr class="timeline__tr timeline__head">
            <td class="timeline__td" v-for="title in titles">{{title}}</td>
          </tr>
          <tr class="timeline__tr" v-for="(timing, index) in durations" @click="handleClick(index)">
            <td class="timeline__td" v-for="(data, name) in timing.timeline">{{data}}</td>
          </tr>
        </table>
      </div>

      <!--瀑布流-->
      <div class="waterfall-wrap">
        <ul class="waterfall__list">
          <li class="waterfall__item" v-for="(data, name) in activityTiming">
            <span class="waterfall__title">{{titles[name]}}</span>
            <span class="waterfall__length" :style="'width:' + (data / 2) + 'px;'">{{data}}</span>
          </li>
        </ul>
      </div>
  </section>
</template>

<script>
export default {
  data: function () {
    return {
      activeMenuIndex: 0,
      activityTiming: {},
      date: '',
      timings: [],
      titles: {
        total: "总加载时间",
        redirect: "重定向耗时",
        appcache: "appcache",
        dns: "DNS查询耗时",
        tcp: "TCP连接耗时",
        whitescreen: "白屏耗时",
        request: "request请求耗时",
        dombuild: "DOM树解析耗时",
        ready: "ready时间",
        onload: "onload时间"
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      var myChart = echarts.init(document.getElementById('main'));
      // 指定图表的配置项和数据
      var option = {
          title: {
              text: '堆叠区域图'
          },
          tooltip : {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  label: {
                      backgroundColor: '#6a7985'
                  }
              }
          },
          legend: {
              data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  boundaryGap : false,
                  data : ['周一','周二','周三','周四','周五','周六','周日']
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'邮件营销',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[120, 132, 101, 134, 90, 230, 210]
              },
              {
                  name:'联盟广告',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[220, 182, 191, 234, 290, 330, 310]
              },
              {
                  name:'视频广告',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[150, 232, 201, 154, 190, 330, 410]
              },
              {
                  name:'直接访问',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[320, 332, 301, 334, 390, 330, 320]
              },
              {
                  name:'搜索引擎',
                  type:'line',
                  stack: '总量',
                  label: {
                      normal: {
                          show: true,
                          position: 'top'
                      }
                  },
                  areaStyle: {normal: {}},
                  data:[820, 932, 901, 934, 1290, 1330, 1320]
              }
          ]
      };

      myChart.setOption(option);
    })
  },

  watch: {
    date( newVal, val ) {
      let date = newVal.replace(/[-\/]/g, '');
      this.$http.get('/static/data/' + date + '.json').then(response => {
        if ( response.status >= 200 && response.status < 300 || response.status === 304 ) {
          this.timings = response.body;
        }
      }, error => {
        this.timings = [];
      });
    }
  },

  computed: {
    durations: function () {
      return this.timings.map(function (timing) {
        return {
          timeline: {
            total: timing.loadEventEnd - timing.fetchStart,
            redirect: timing.redirectEnd - timing.redirectStart,
            appcache: timing.domainLookupStart - timing.fetchStart,
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            whitescreen: null,
            request: timing.responseEnd - timing.requestStart,
            dombuild: timing.domInteractive - timing.responseEnd,
            ready: timing.domComplete - timing.domInteractive,
            onload: timing.loadEventEnd - timing.loadEventStart
          },
          waterfall: {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            request: timing.responseEnd - timing.responseStart,
            dombuild: timing.domComplete - timing.domInteractive,
            whitescreen: timing.responseStart - timing.navigationStart,
            ready: timing.domContentLoadedEventEnd - timing.navigationStart,
            onload: timing.loadEventEnd - timing.navigationStart
          }
        }
      })
    },
    average_time: function () {
      let nanNum = 0;
      let length = this.durations.length;
      if ( length ) {
        let total = this.durations.reduce((cur, next) => {
          let num = next.timeline.total;
          if ( typeof cur === 'object' ) {
            cur = 0;
          }
          if ( isNaN(num) ) {
            nanNum++;
            num = 0;
          }
          return cur + num;
        });
        return total / (length - nanNum);
      } else {
        return 0;
      }
    }
  },
  methods: {
    handleClick: function ( index ) {
      this.activityTiming = this.durations[ index ].waterfall;
    }
  }
}
</script>

<style lang="less">
@import "../../libs/css/var.less";
.main-content {
  width: 100px;
  padding: 20px 40px;
  .flex-full-space;
}
.timeline__date-label{
  .flex-row;
}
.timeline__date {
  height: 30px;
  line-height: 30px;
  margin-top: 50px;
}
.timeline__input {
  width: inherit;
  height: inherit;
  font-size: 18px;
}

/* 表格视图 */
.timeline__wrap {
  margin-top: 50px;
  cursor: pointer;
  overflow-x: scroll;
}
.timeline__title {
  text-align: center;
  font-size: 18px;
}
.timeline__td {
  text-align: center;
  padding: 5px 10px;
  border: 1px solid #a3a3a3;
}
.timeline__tr:nth-child(2n+2) {
  background-color: #f5f5f5;
}
.timeline__head {
  background-color: #f3f3f3;
}
.timeline__tr:hover {
  background-color: #ebf2fc;
}

/* 瀑布流视图 */
.waterfall-wrap {
  margin-left: 100px;
  margin-top: 20px;
}
.waterfall__item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.waterfall__title,
.waterfall__length {
  height: 30px;
  line-height: 30px;
}
.waterfall__title {
  width: 150px;
  text-align: right;
}
.waterfall__title::after {
  content: "："
}
.waterfall__length {
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  padding-left: 10px;
  background-color: #03a9f4;
}
</style>
