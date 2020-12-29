const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formaData = () =>{
  let date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const formatTime2 = date => {
  let time = new Date(date);
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatTime3 = date => {
  let time = new Date(date);
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  return [month, day].map(formatNumber).join('月') + '日 ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//判断是否为手机号码
const isPhoneAvailable = poneInput=> {
  var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!myreg.test(poneInput)) {
    return false;
  } else {
    return true;
  }
}
//判断是否为数字
const isNumAvailable = numInput => {
  var myreg = new RegExp("[0-9]+");
  var patternChina = new RegExp("[\u4E00-\u9FA5]+");
  var patternEnglish = new RegExp("[A-Za-z]+");
  if (!myreg.test(numInput) || patternChina.test(numInput) || patternEnglish.test(numInput)||numInput.indexOf('。')>-1) {
    return false;
  } else {
    return true;
  }
}
const fmoney = money => {
  money = String(money);
  var left = money.split('.')[0];
  var right = money.split('.')[1];
  right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00'; 
  var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
  return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
}

module.exports = {
  formatTime: formatTime,
  formaData: formaData,
  isPhoneAvailable: isPhoneAvailable,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  fmoney: fmoney,
  isNumAvailable: isNumAvailable
}
