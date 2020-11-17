import React, { useState, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import style from '../../assets/global-style';

const ToastWrapper = styled.div`
    position: fixed;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    height: 50px;
    /*background: ${style['highlight-background-color']};*/
    &.drop-enter{
        opacity:0;
        transform: translate(0, 100%, 0);
    };
    &.drop-enter-active{
        opacity: 1;
        transition: all 0.3s;
        transform: translate3d(0,0,0)
    }
    &.drop-exit-active{
        opacity: 0;
        translate: all 0.3s;
        transform: translate3d(0, 100%, 0);
    }
    .text{
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: ${style['font-size-m']}
    }
`

//外面组件要拿到这个函数组件的ref，因此需要用forward

const Toast = forwardRef((props, ref) => {
    const [show, setShow] = useState(false);
    const [timer, setTimer] = useState('');
    const { text } = props;

    //外面组件能通过ref拿到什么方法
    //是用useImperativeHandle这个hook控制的，这个方法返回一个对象
    useImperativeHandle(ref, () => ({
        //这个方法就是把状态改为显示，而且做了防抖处理
        show() {
            //做防抖处理
            if (timer) clearTimeout(timer);
            setShow(true);
            //停止点击之后三秒开始隐藏
            setTimer(setTimeout(() => {
                setShow(false)
            }, 3000))
        }
    }))

    return (
        <CSSTransition in={show} timeout={300} classNames='drop' unmountOnExit>
            <ToastWrapper>
                <div className='text'>{text}</div>
            </ToastWrapper>
        </CSSTransition>
    )
});

export default React.memo(Toast);