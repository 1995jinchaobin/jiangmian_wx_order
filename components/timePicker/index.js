// pages/timePicker/timePicker.js
Component({
  data:{
    time:'',
    date: '2018-01-01',//默认起始时间
    date2: '2018-01-24',//默认结束时间
    index: 0
  },
  behaviors: ['wx://component-export'],
  attached: function () {
    let time = this.formatTime(new Date());
    this.setData({
      date:time,
      date2: time,
      time: time
    })
  },
  methods:{
    bindDateChange(e) {
      let that = this;
      that.setData({
        date: e.detail.value,
        date2: this.data.date,
        index: 1
      })
    },
    bindDateChange2(e) {
      let that = this;
      that.setData({
        date2: e.detail.value,
        index:1
      })
    },
    resetTime(){
      this.setData({
        date: this.data.time,
        date2: this.data.time,
        index: 0
      })
    },
    formatTime(date){
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      return [year, month, day].map(this.formatNumber).join('-')
    },
    formatNumber(n){
      n = n.toString()
      return n[1] ? n : '0' + n
    },
    searchData(){
      let index = this.data.index
      var myEventDetail = { stratTime: this.data.date, endTime: this.data.date2, flag: index} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('searchData', myEventDetail, myEventOption)
    }
  },
  export() {
    return { stratTime: this.data.date,endTime: this.data.date2,index: this.data.index }
  }
})