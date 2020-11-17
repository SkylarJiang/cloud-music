import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreator';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll';
import { Content } from './style';
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading/index';
import { renderRoutes } from 'react-router-config'

function Recommend(props) {
    const { bannerList, recommendList, enterLoading } = props;
    const { songsCount } = props;
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;
    useEffect(() => {
        if (!bannerList.size) {
            getBannerDataDispatch();
        };     
    },[bannerList.size, getBannerDataDispatch]);


    useEffect(() => {
        if (!recommendList.size) {
            getRecommendListDataDispatch();
        }
    },[recommendList.size,getRecommendListDataDispatch])
      

    const bannerListJS = bannerList ? bannerList.toJS() : [];
    const recommendListJS = recommendList ? recommendList.toJS() : [];

    return (
        <Content play={songsCount}>
            <Scroll className="list" onScroll={forceCheck}>
                <div>
                    <Slider bannerList={bannerListJS}></Slider>
                    <RecommendList recommendList={recommendListJS}></RecommendList>
                     
                </div>           
            </Scroll> 
            {enterLoading ? <Loading></Loading> : null}
            { renderRoutes (props.route.routes) }
        </Content>
    )
};
// 映射 redux 全局的state到组件的props中
//从合并的reducer中取数据到我们的props中
//如当前我们组件要用的bannerList就是从recommend这个reducer中取到recommendList这个数据
const mapStateToProps = (state) => ({
    // 不要在这里toJS
    // 不然每次diff比对props时都是不一样的引用，还是导致不必要的渲染
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading']),
    songsCount: state.getIn(['player','playList']).size
})

//映射dispatch到props中，把那两个方法传给props
const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch() {
            dispatch(actionTypes.getBannerList())
        },
        getRecommendListDataDispatch() {
            dispatch(actionTypes.getRecommendList())
        }
    }
}

// 连接组件和这两个方法
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));