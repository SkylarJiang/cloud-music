import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, TopDesc, Menu } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { getCount, isEmptyObject } from '../../api/utils';
import { HEADER_HEIGHT } from './../../api/config';
import style from "../../assets/global-style";
import { connect } from 'react-redux';
import { getAlbumList, changeEnterLoading } from './store/actionCreators';
import Loading from '../../baseUI/loading/index';
import SongsList from '../SongList';
import MusicNote from "../../baseUI/music-note/index";

function Album(props) {
  const { currentAlbum: currentAlbumImmutable, enterLoading, songsCount } = props;
  const { getAlbumDataDispatch } = props;

  //从路由中拿到歌单的id
  const id = props.match.params.id;
  //同时将去到的歌单转换成js对象

  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState('歌单');
  const [isMarquee, setIsMarquee] = useState(false)

  const handleBack = useCallback(() => {
      setShowStatus(false)
  },[])

  useEffect(() => {
    getAlbumDataDispatch(id)
  },[getAlbumDataDispatch, id])
  
  let currentAlbum = currentAlbumImmutable.toJS();

  //滑动过程中header组件逐渐变红，而且文字变成了歌单名，并且呈现出跑马灯效果
  const headerEl = useRef();

  
  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs (pos.y/minScrollY);
    let headerDom = headerEl.current;
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min (1, (percent-1)/2);
      setTitle (currentAlbum.name);
      setIsMarquee (true);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle ("歌单");
      setIsMarquee (false);
    }
  },[currentAlbum])
  //顶部歌单描述部分的渲染

  //动画部分
  const musicNoteRef = useRef ();

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };
  
  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
            <div className="filter"></div>
        </div>
        <div className="img_wrapper">
            <div className="decorate"></div>
            <img src={currentAlbum.coverImgUrl} alt=""/>
            <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{getCount(currentAlbum.subscribedCount)}  </span>
            </div>
        </div>
        <div className="desc_wrapper">
            <div className="title">{currentAlbum.name}</div>
            <div className="person">
            <div className="avatar">
                <img src={currentAlbum.creator.avatarUrl} alt=""/>
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
            </div>
        </div>
      </TopDesc>
    )
  }
  // 评论点赞收藏更多，菜单部分渲染
  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className='iconfont'>&#xe6ad;</i>评论
        </div>
        <div>
          <i className='iconfont'>&#xe86f;</i>点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>更多
        </div>
      </Menu>
    )
  };
  //渲染具体歌单的部分，包括序号、歌名、歌手、专辑
  //以及前面的播放列表，包括顶部播放全部、收藏（icon及人数）


    //通过不显示动画来设置返回?
  return ( 
    <CSSTransition
        in={showStatus}
        timeout={300}
        classNames='fly'
        appear={true}
        unmountOnExit
        //history.goBack返回上一个页面
        onExit={props.history.goBack}
    >            
      <Container play={songsCount}>
        {enterLoading? <Loading></Loading>: null}
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {//非空对象才显示header以外的东西
          !isEmptyObject(currentAlbum) ? (
            <Scroll bounceTop={false} onScroll={handleScroll}>
              <div>
                {renderTopDesc()}
                {renderMenu()}
                <SongsList
                  songs={currentAlbum.tracks}
                  collectCount={currentAlbum.subscribedCount}
                  showCollect={true}
                  showBackground={true}
                  musicAnimation={musicAnimation}
                ></SongsList>            
              </div>
            </Scroll>
          ):null
        }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
};

const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  songsCount: state.getIn (['player', 'playList']).size,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));