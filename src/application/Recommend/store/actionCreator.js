// 编写具体的action

import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';

//这个方法是接收一些参数，返回一个对象，到时候在reducer中再作处理
const changeBannerList = (data) => ({
    type: actionTypes.CHANGE_BANNER,
    data: fromJS(data)
});

const changeRecommendList = (data) => ({
    type: actionTypes.CHANGE_RECOMMEND_LIST,
    data: fromJS(data)
});

const changeEnterLoading = (data) => ({
    type: actionTypes.CHANGE_ENTER_LOADING,
    data
})

//这里的dispatch方法是待会在index里引用的时候被传进来的
export const getBannerList = () => {
    return (dispatch) => {
        getBannerRequest().then(data => {
            dispatch(changeBannerList(data.banners))
        }).catch(() => {
            console.log("轮播图数据传输错误")
        })
    }
};

export const getRecommendList = () => {
    return (dispatch) => {
        getRecommendListRequest().then(data => {
            dispatch(changeRecommendList(data.result));
            //获取推荐歌单之后把loading状态改为false
            dispatch(changeEnterLoading(false))
        }).catch(() => {
            console.log("推荐列表获取错误")
        })
    }
};
