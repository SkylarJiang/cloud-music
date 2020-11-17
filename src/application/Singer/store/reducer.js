import { fromJS } from 'immutable';
import * as actionTypes from './constants'

const defaultState = fromJS({
    singerList: [],
    enterLoading: true, // 控制入场动画，默认有，进场完毕之后设置为false
    pullUpLoading: false, // 控制上拉加载动画，默认没有，检测到下拉的时候改变
    pullDownLoading: false, //下拉
    pageCount: 0 //当前页数，为了实现分页功能
})

export default (state = defaultState , action) => {
    switch (action.type) {
        case actionTypes.CHANGE_SINGER_LIST:
            return state.set('singerList', action.data);
        case actionTypes.CHANGE_ENTER_LOADING:
            return state.set('enterLoading', action.data);
        case actionTypes.CHANGE_PULL_UP_LOADING:
            return state.set('pullUpLoading', action.data);
        case actionTypes.CHANGE_PULL_DOWN_LOADING:
            return state.set('pullDownLoading', action.data);
        case actionTypes.CHANGE_PAGE_COUNT:
            return state.set('pageCount', action.data); 
        default:
            return state;
    }
}