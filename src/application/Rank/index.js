import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getRankList } from './store'
import { filterIndex, filterIdx } from '../../api/utils';
import { Container, List, ListItem, SongList } from './style';
import Scroll from '../../baseUI/scroll/index';
import Loading from '../../baseUI/loading/index';
import { renderRoutes } from 'react-router-config';
    
function Rank(props) {
    const { rankList: list, loading, songsCount } = props;
    const { getRankDataDispatch } = props;
    let rankList = list ? list.toJS() : [];

    //didMount的时候发送ajax请求
    useEffect(() => {
        getRankDataDispatch()
    }, [])
    
    // 由于排名榜单分为官方榜和全球榜两部分
    //官方部分有tracks数据，全球榜没有，需要分开处理
    //定义一个函数找到两部分数据的分界点
    let globalStarIndex = filterIndex(rankList);
    let officialList = rankList.slice(0, globalStarIndex);
    let globalList = rankList.slice(globalStarIndex);
    
    // 查询某个名字的位置
    const enterDetail = (detail) => {
        props.history.push(`/rank/${detail.id}`)
    }
    //渲染榜单列表函数，传入global变量来区分不同的布局方式
    const renderRankList = (list, global) => {
        return (
            // List在写样式的时候可以从props中拿到这个global变量进行判断
            <List globalRank={global}>
                {
                    list.map((item) => {
                        return (
                            <ListItem
                                key={item.coverImgId}
                                tracks={item.tracks}
                                onClick={() => enterDetail(item)}
                            >
                                <div className='img_wrapper'>
                                    <img src={item.coverImgUrl} alt='' />
                                    <div className='decorate'></div>
                                    <span className='update_frequency'>{item.updateFrequency}</span>
                                </div>
                                {renderSongList(item.tracks)}
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };

    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={item.first}>{index + 1}.{item.first}-{item.second}</li>
                    })
                }
            </SongList>
        ) : null;
    }

    //榜单数据加载出来之前都给隐藏
    let displayStyle = loading ? { 'display': 'none' } : { 'display': '' };

    return (
        <Container play={songsCount}>
            <Scroll>
                <div>
                    <h1 className='official' style={displayStyle}>官方榜</h1>
                    {renderRankList(officialList)}
                    <h1 className='global' style={displayStyle}>全球榜</h1>
                    {renderRankList(globalList, true)}
                    {loading? <Loading></Loading>:null}
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </Container>
    )
};



const mapStateToProps = (state) => ({
    rankList: state.getIn(['rank', 'rankList']),
    loading: state.getIn(['rank', 'loading']),
    songsCount: state.getIn (['player', 'playList']).size,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getRankDataDispatch() {
            dispatch(getRankList());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))