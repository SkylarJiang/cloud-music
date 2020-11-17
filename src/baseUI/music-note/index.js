import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { prefixStyle } from '../../api/utils';
import style from '../../assets/global-style';

const Container = styled.div`
.icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform: translate3d(0, 0, 0);
    >div {
      transition: transform 1s;
    }
}
`

const MusicNote = forwardRef((props, ref) => {
    const iconsRef = useRef();
      // 容器中有 3 个音符，也就是同时只能有 3 个音符下落
    const ICON_NUMBER = 3;

    const transform = prefixStyle("transform");
    
      // 原生 DOM 操作，返回一个 DOM 节点对象
    const createNode = (txt) => {
        const template = `<div class='icon_wrapper'>${txt}</div>`;
        let tempNode = document.createElement('div');
        tempNode.innerHTML = template;
        return tempNode.firstChild;
    };

    useEffect(() => {
        //在iconRef里创建三个 icon-wrapper，里面均放一个icon
        for (let i = 0; i < ICON_NUMBER; i++) {
            let node = createNode(`<div class="iconfont">&#xe642;</div>`);
            iconsRef.current.appendChild(node);
        };
        //这个icon-wrapper中的东西是类数组，将其转换成数组
        //将数组的slice方法应用到对象上并截取出来，截出来的部分就是数组了
        let domArray = [].slice.call(iconsRef.current.children);
        domArray.forEach(item => {
            item.running = false;
            item.addEventListener('transitionend', function () {
                this.style['display'] = 'none';
                this.style[transform] = `translate3d(0,0,0)`;
                this.running = false;

                let icon = this.querySelector('div');
                icon.style[transform] = `translate3d(0,0,0)`
            }, false)
        })
    }, []);

    //动画下落逻辑

    const startAnimation = ({ x, y }) => {
        for (let i = 0; i < ICON_NUMBER; i++){
            let domArray = [].slice.call (iconsRef.current.children)
            let item = domArray[i];
            //选择一个空闲元素开始动画
            if (item.running === false) {
                // 从哪里点，动画就从哪里出来
                item.style.left = x + 'px';
                item.style.top = y + "px";
                item.style.display = "inline-block";
            };
            setTimeout(() => {
                item.running = true;
                item.style[transform] = `translate3d(0, 750px, 0)`;
                let icon = item.querySelector("div");
                icon.style[transform] = `translate3d(-40px, 0, 0)`;
            }, 20);
            break;
        }
    }
    //外界调用的ref方法

    useImperativeHandle(ref, () => ({
        startAnimation
    }))

    return (
        <Container ref={iconsRef}></Container>
    )
});

export default React.memo(MusicNote);