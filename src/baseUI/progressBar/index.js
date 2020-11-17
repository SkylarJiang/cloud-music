import React, {useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from './../../api/utils';

const ProgressBarWrapper = styled.div`
    height: 30px;
    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, .3);
        .progress {
            position: absolute;
            height: 100%;
            background: ${style["theme-color"]};
        }
    .progress-btn-wrapper {
        position: absolute;
        left: -10px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn{
            position: relative;
            top: 7px;
            left: 7px;
            box-sizing: border-box;
            width: 16px;
            height: 16px;
            border: 3px solid ${style["border-color"]};
            border-radius: 50%;
            background: ${style["theme-color"]};
            }
        }
    }
`

function ProgressBar(props) {
    const { percent } = props;
    const { percentChange } = props;

    const progressBar = useRef();
    const progress = useRef();
    const progressBtn = useRef();
    const [touch, setTouch] = useState({});
    //这touch是用来保存触摸状态的:
    //开始滑动时x位置、判断是否开始滑动、上一次的进度条长度

    const transform = prefixStyle('transform');

    
    const progressBtnWidth = 16;

    //监听percent
    useEffect(() => {
        if(percent >= 0 && percent <= 1 && !touch.initiated) {
          const barWidth = progressBar.current.clientWidth - progressBtnWidth;
          const offsetWidth = percent * barWidth;
          progress.current.style.width = `${offsetWidth}px`;
          progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        }
        // eslint-disable-next-line
      }, [percent]);

    //接受滑动距离，进度条变长、btn右移
    const _offset = (offsetWidth) => {
        progress.current.style.width = `${offsetWidth}px`;
        progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
    };

    //获取当前的percent并且传递给父组件
    const _changePercent = () => {
        const barWidth = progressBar.current.clientWidth - progressBtnWidth;
        const curPercent = progress.current.clientWidth / barWidth;
        percentChange(curPercent);
    }
      
    const progressTouchStart = (e) => {
        const startTouch = {};
        startTouch.initiated = true;//initial 为 true 表示滑动动作开始了
        startTouch.startX = e.touches[0].pageX;// 滑动开始时横向坐标
        startTouch.left = progress.current.clientWidth;// 当前 progress 长度
        setTouch(startTouch);   
    }

    const progressTouchMove = (e) => {
        //如果开始滑动了就开始处理后面的事件
        if (!touch.initiated) return;
        //计算滑动距离
        const deltaX = e.touches[0].pageX - touch.startX;
        const barWidth = progressBar.current.clientWidth - progressBtnWidth; 
        //max：如果划回去没超过0的话就滑，比0还小就是0
        //min: 如果划过去没超过最大值就滑，超过了就在最大值处
        const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
        //然后把要滑动的距离传给offset，让他去改变dom
        _offset(offsetWidth);
    };

    const progressTouchEnd = (e) => {
        const endTouch = JSON.parse(JSON.stringify(touch));
        endTouch.initiated = false; //结束滑动
        setTouch(endTouch);
        _changePercent()
    };

    const progressClick = (e) => {
        const rect = progressBar.current.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        _offset(offsetWidth);
        _changePercent()
    }


    return (
        <ProgressBarWrapper>
            <div className='bar-inner' ref={progressBar} onClick={progressClick}>
                <div className='progress' ref={progress}></div>
                <div className='progress-btn-wrapper'
                    ref={progressBtn}
                    onTouchStart={progressTouchStart}
                    onTouchMove={progressTouchMove}
                    onTouchEnd={progressTouchEnd}
                >
                    <div className="progress-btn"></div>
                </div>
            </div>
        </ProgressBarWrapper>
    )
}

export default ProgressBar;