import { RankTypes } from "./config";

export const getCount = (count) => {
    if (count < 0) return;
    if (count < 10000) {
        return count;
    } else if (Math.floor(count / 1000)) {
        return Math.floor(count / 1000) / 10 + "万";
    } else {
        return Math.floor(count/10000000)/10 + "亿"
    }
}

//拼接歌手名字
export const getName = list => {
    let str = '';
    list.map((item, index) => {
        //如果是第一个歌手就直接往字符串中拼接名字，后面的就在名字前还要加一个斜杠
        str += index === 0 ? item.name : '/' + item.name;
        return item
    });
    return str;
}

//防抖函数

export const debounce = (func, delay) => {
    let timer;
    // 不是，这个arg怎么来的呀
    return function (...args) {
        if (timer) {
            clearTimeout(timer) //有计时器就清除计时器
        }
        timer = setTimeout(() => {
            // 在哪里调用this，this就指向哪里
            // 把func的this绑定并且执行
            func.apply(this, args)
            clearTimeout(timer)           
        },delay)
    }    
}

export const filterIndex = rankList => {
    for (let i = 0; i < rankList.length; i++){
        //某一个数据有track而他的下一个没有，那么他就是我们要找得分界点
        if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
            return i + 1;
        }
    }
}

//找出排行榜的编号

export const filterIdx = name => {
    for (var key in RankTypes) {
        if (RankTypes[key] === name) return key;
    };
    return null
}

// 判断对象是否为空：先用 Object.key 方法取出对象所有属性，再判断是否为空
export const isEmptyObject = obj => Object.keys(obj).length === 0;

let elementStyle = document.createElement('div').style;

let vendor = (() => {
    //先通过transition判断是何种浏览器
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'Transform'
    };
    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key;
        }
    };
    return false;
})();//是一个立即执行函数诶

export function prefixStyle(style) {
    if (vendor === false) {
        return false;
    }
    if (vendor === 'standard') {
        return style;
    }
    return vendor+style.charAt(0).toUpperCase()+style.substr(1)
};

export const getSongUrl = (id) => {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
};

export const formatPlayTime = interval => {
    interval = interval | 0; // |0表示向下取整(位运算)
    const minute = (interval / 60) | 0;
    const second = (interval % 60).toString().padStart(2, '0')
    //padStart用于尾部补全，此处为两位，不够两位的在前面用0补全
    return `${minute}:${second}`;
};

//定义一个随机输出指定范围内数字的函数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//随机算法
export function shuffle(arr) {
    let new_arr = [];
    arr.forEach(item => {
      new_arr.push(item);
    });
    for (let i = 0; i < new_arr.length; i++) {
      let j = getRandomInt(0, i);
      let t = new_arr[i];
      new_arr[i] = new_arr[j];
      new_arr[j] = t;
    }
    return new_arr;
}
//找到当前歌曲的索引
export const findIndex = (song, list) => {
    return list.findIndex(item => {
      return song.id === item.id;
    });
};

