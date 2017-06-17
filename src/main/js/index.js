new Vue({
  el: '#app',
  data: function () {
    return {
      activeMenuIndex: 0,
      activityTiming: {},
      date: '20170616',
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

  watch: {
    date( newVal, val ) {
      if ( newVal.length === 8 ) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', '../script/data/' + newVal + '.json', false);
        xhr.send(null);
        if ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 ) {
          this.timings = JSON.parse(xhr.response);
        }
      }
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
})
