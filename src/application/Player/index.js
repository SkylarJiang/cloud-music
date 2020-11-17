import React,{useState, useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import {
    changePlayingState,
    changeShowPlayList,
    changeCurrentIndex,
    changeCurrentSong,
    changePlayList,
    changePlayMode,
    changeFullScreen
} from './store/actionCreator';
import MiniPlayer from './minPlayer'
import NormalPlayer from './normalPlayer';
import PlayList from './play-list';
import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils'
import Toast from '../../baseUI/Toast';
import { playMode } from '../../api/config';

function Player(props) {
    //记录当前的歌曲，以便重新渲染时比对是否同一首歌
    const [preSong, setPreSong] = useState({});

    //记录当前播放模式的文字
    const [modeText, setModeText] = useState('');
    const toastRef = useRef();

    //目前播放时间
    const [currentTime, setCurrentTime] = useState(0);
    //歌曲总时长
    const [duration, setDuration] = useState(0);
    //歌曲播放进度
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
    
    const {
        playing,
        currentSong:immutableCurrentSong,
        currentIndex,
        playList:immutablePlayList,
        mode,//播放模式
        sequencePlayList:immutableSequencePlayList,//顺序列表
        fullScreen
    } = props;
      
    const {
        togglePlayingDispatch,
        changeCurrentIndexDispatch,
        changeCurrentDispatch,
        changePlayListDispatch,//改变playList
        changeModeDispatch,//改变mode
        toggleFullScreenDispatch,
        togglePlayListDispatch
    } = props;
      
      const playList = immutablePlayList.toJS();
      const sequencePlayList = immutableSequencePlayList.toJS();
      const currentSong = immutableCurrentSong.toJS();


    const audioRef = useRef();
    const songReady = useRef(true);

    const clickPlaying = (e, state)=>{
        e.stopPropagation();
        togglePlayingDispatch(state);
    }

    useEffect(() => {
        if (
            !playList.length ||
            currentIndex === -1 ||
            !playList[currentIndex] ||
            playList[currentIndex].id === preSong.id ||
            !songReady.current
            )
            return;
        let current = playList[currentIndex];
        changeCurrentDispatch(current);//赋值currentSong
        setPreSong(current);
        songReady.current = false; //把标志位置设置为false，表示还没缓冲完成
        audioRef.current.src = getSongUrl(current.id);
        setTimeout(() => {
            audioRef.current.play().then(() => {
                songReady.current = true;
            });
        });
        togglePlayingDispatch(true);//播放状态
        setCurrentTime(0);//从头开始播放
        setDuration((current.dt / 1000) | 0);//时长
    }, [playList, currentIndex]);

    useEffect(() => {
        playing ? audioRef.current.play() : audioRef.current.pause();
    }, [playing]);

    const updateTime = e => {
        setCurrentTime(e.target.currentTime);
    };

    const onProgressChange = curPercent => {
        const newTime = curPercent * duration;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
        //时间放在新时间，如果没在播放就开始播放
        if (!playing) {
            togglePlayingDispatch(true);
        }
    };

    // 【上下曲切换逻辑】
    //从头开始直接播放当前歌曲
    const handleLoop = () => {
        audioRef.current.currentTime = 0;
        changePlayingState(true);
        audioRef.current.play();
      };
    //播放上一首：那么就播放初始化，把index-1
    //如果前面没有了，就播放最后一首，如果只有一首就播放当前歌曲
    const handlePrev = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
          handleLoop();
          return;
        }
        let index = currentIndex - 1;
        if (index < 0) index = playList.length - 1;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
      };
      
    //播放下一首
    const handleNext = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
          handleLoop();
          return;
        }
        let index = currentIndex + 1;
        if (index === playList.length) index = 0;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    };

    // 【切换播放模式】
    const changeMode = () => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
          //顺序模式
          changePlayListDispatch(sequencePlayList);
          let index = findIndex(currentSong, sequencePlayList);
            changeCurrentIndexDispatch(index);
            setModeText("顺序循环");
        } else if (newMode === 1) {
          //单曲循环
            changePlayListDispatch(sequencePlayList);
            setModeText("单曲循环");
        } else if (newMode === 2) {
          //随机播放
          let newList = shuffle(sequencePlayList);
          let index = findIndex(currentSong, newList);
          changePlayListDispatch(newList);
            changeCurrentIndexDispatch(index);
            setModeText("随机播放");
        }
        changeModeDispatch(newMode);
        toastRef.current.show();
    };

    //播放完毕之后播放下一首的逻辑
    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop()
        } else {
            handleNext();
        }
    }
    
    //播放器异常处理
    const handleError = () => {
        songReady.current = true;
        alert('播放出错')
    }


    return (
        <div>
            {isEmptyObject(currentSong) ? null :
                <MiniPlayer
                    song={currentSong}
                    fullScreen={fullScreen}
                    toggleFullScreen={toggleFullScreenDispatch}
                    playing={playing}
                    clickPlaying={clickPlaying}
                    percent={percent}
                    togglePlayList={togglePlayListDispatch}
                />
            }
            {isEmptyObject(currentSong) ? null :
                <NormalPlayer
                    song={currentSong}
                    fullScreen={fullScreen}
                    playing={playing}
                    duration={duration}//总时长
                    currentTime={currentTime}//播放时间
                    percent={percent}//进度
                    toggleFullScreen={toggleFullScreenDispatch}
                    clickPlaying={clickPlaying}
                    onProgressChange={onProgressChange}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    mode={mode}
                    changeMode={changeMode}
                    togglePlayList={togglePlayListDispatch}//播放列表是否展示
              />
            }
            <audio
                ref={audioRef}
                onTimeUpdate={updateTime}
                onEnded={handleEnd}
                onError={handleError}
            ></audio>
            <PlayList></PlayList>
            <Toast text={modeText} ref={toastRef}></Toast>
        </div>
    )
}

const mapStateToProps = state => ({
    fullScreen: state.getIn(['player', 'fullScreen']),
    playing: state.getIn(["player", "playing"]),
    currentSong: state.getIn(["player", "currentSong"]),
    showPlayList: state.getIn(["player", "showPlayList"]),
    mode: state.getIn(["player", "mode"]),
    currentIndex: state.getIn(["player", "currentIndex"]),
    playList: state.getIn(["player", "playList"]),
    sequencePlayList: state.getIn(["player", "sequencePlayList"])
});

const mapDispatchToProps = (dispatch) => {
    return {
        togglePlayingDispatch(data) {
            dispatch(changePlayingState(data));
        },
        toggleFullScreenDispatch(data) {
            dispatch(changeFullScreen(data));
        },
        togglePlayListDispatch(data) {
            dispatch(changeShowPlayList(data));
        },
        changeCurrentIndexDispatch(index) {
            dispatch(changeCurrentIndex(index));
        },
        changeCurrentDispatch(data) {
            dispatch(changeCurrentSong(data));
        },
        changeModeDispatch(data) {
            dispatch(changePlayMode(data));
        },
        changePlayListDispatch(data) {
            dispatch(changePlayList(data));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))