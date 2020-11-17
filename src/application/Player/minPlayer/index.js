import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { getName } from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import ProgressCircle from '../../../baseUI/progress-circle'

function MiniPlayer(props) {
    const { song, fullScreen, playing, percent } = props;
    const { toggleFullScreen, clickPlaying, togglePlayList } = props;

    const miniPlayerRef = useRef();

    //切换播放列表展示状态
    const handleTogglePlayList = (e) => {
        togglePlayList(true);
        e.stopPropagation();
    }

    return (
        <CSSTransition 
            in={!fullScreen} 
            timeout={400} 
            classNames="mini" 
            onEnter={() => {
            miniPlayerRef.current.style.display = "flex";
            }}
            onExited={() => {
            miniPlayerRef.current.style.display = "none";
            }}
        >
            <MiniPlayerContainer ref={miniPlayerRef} onClick={() => toggleFullScreen(true)}>
                {/* 屏幕底部的播放器 */}
                <div className='icon'>
                    <div className='imgWrapper'>
                        {/* 暂停的时候停止旋转 */}
                        <img className={`play ${playing ? "": "pause"}`} src={song.al.picUrl} width='40' height='40' alt='img' />
                    </div>
                </div>
                {/* 描述部分 */}
                <div className='text'>
                    <h2 className='name'>{song.name}</h2>
                    <p className='desc'>{getName(song.ar)}</p>
                </div>
                {/* 控制部分的icon */}
                <div className='control'>
                    <ProgressCircle radius={32} percent={percent}>
                        {playing ?
                            <i className="icon-mini iconfont icon-pause" onClick={e=>clickPlaying(e, false)}>&#xe650;</i>
                            :
                            <i className="icon-mini iconfont icon-play" onClick={e=>clickPlaying(e, true)}>&#xe61e;</i>
                        } 
                    </ProgressCircle>                 
                </div>
                <div className='control' onClick={handleTogglePlayList}>
                    <i className='iconfont'>&#xe640;</i>
                </div>
            </MiniPlayerContainer>
        </CSSTransition>

    )
};

export default React.memo(MiniPlayer)