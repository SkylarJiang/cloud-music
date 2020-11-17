
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group'
import {
  Container,
  ImageWrapper,
  CollectButton,
  BgLayer,
  SongListWrapper
} from './style';
import Header from '../../baseUI/header';
import SongsList from '../SongList';
import Scroll from '../../baseUI/scroll';
import { HEADER_HEIGHT } from '../../api/config';
import { changeEnterLoading, getSingerInfo } from '../SingerDetail/store/actionCreators';
import { connect } from 'react-redux';
import Loading from '../../baseUI/loading';
import MusicNote from "../../baseUI/music-note/index";

function SingerDetail(props) {
  const [showStatus, setShowStatus] = useState(true);

  const {
    artist: immutableArtist,
    songs: immutableSongs,
    loading,
    songsCount
  } = props;

  const { getSingerDataDispatch } = props;

  const artist = immutableArtist.toJS();
  const songs = immutableSongs.toJS();
  
  //这些元素全部取到干啥呢
  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();
  //图片初始高度
  const initialHeight = useRef(0)

  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;

  useEffect(() => {
    const id = props.match.params.id;
    getSingerDataDispatch(id);
    let h = imageWrapper.current.offsetHeight;
    initialHeight.current = h;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh ();
    //eslint-disable-next-line
  }, []);

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  },[])
  
  //交互主要是滑动屏幕时的逻辑，我们可以直接在scroll基础组件的 onScroll 回调函数中写逻辑
  //待会就直接在onScroll绑定这个函数，还要传入pos，pos是什么呢
  //pos就是滑动事件，滚到哪里了？
  //首先把DOM取出来

  const handleScroll = useCallback(pos => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    //指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);

    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      //这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      //按钮跟着移动且渐渐变透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }, [])

  //动画相关
  const musicNoteRef = useRef ();

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation ({ x, y });
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames='fly'
      appear={true}
      unmountOnExit
      onExited={()=>props.history.goBack()}
    >   
      <Container play={songsCount}>
        <Header
          handleClick={setShowStatusFalse}
          title={artist.name}
          ref={header}
        ></Header>
        <ImageWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImageWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              musicAnimation={musicAnimation}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        {loading ? (<Loading></Loading>) : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
};

const mapStateToProps = state => ({
  artist: state.getIn(['singerDetail', 'artist']),
  songs: state.getIn(['singerDetail', 'songsOfArtist']),
  loading: state.getIn(['singerDetail', 'loading']),
  songsCount: state.getIn (['player', 'playList']).size,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getSingerDataDispatch(id){
      dispatch(changeEnterLoading(true));
      dispatch(getSingerInfo(id))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(React.memo(SingerDetail));