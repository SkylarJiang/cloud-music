import React, { useState, useRef, useEffect, memo } from 'react';
import styled from 'styled-components';
import Scroll from '../scroll';
import { PropTypes } from 'prop-types';
import style from '../../assets/global-style';

// 先分析基础组件需要接受什么参数

function Horizon(props) {
    const { list, oldVal, title } = props;
    const { handleClick } = props;
    const Category = useRef(null);

    useEffect(() => {
        let categoryDOM = Category.current;
        let tagElements = categoryDOM.querySelectorAll('span');
        let totalWidth = 0;
        //计算出所有span的长度和
        Array.from(tagElements).forEach(ele => {
            totalWidth += ele.offsetWidth
        });
        categoryDOM.style.width = `${totalWidth}px`
    }, []);

    return (
        <Scroll direction={'horizontal'}>
            <div ref={Category}>
                <List>
                    <span>{title}</span>
                    {
                        list.map((item) => {
                            return (
                                <ListItem
                                    key={item.key}
                                    className={oldVal === item.key ? 'selected' : ''}
                                    onClick={()=>handleClick(item.key)}
                                >
                                    {item.name}
                                </ListItem>
                            )
                        })
                    }
                </List>
            </div>
        </Scroll>
    )
};

// 首先考虑需要接受的参数
// List 为接受的列表数据
// oldVal 为当前的item值
// title为列表左边的标题
// handleClick为点击不同item接受的方法

Horizon.defaultProps = {
    list: [],
    oldVal: '',
    title: '',
    handleClick: null
};

Horizon.propTypes = {
    list: PropTypes.array,
    oldVal: PropTypes.string,
    title: PropTypes.string,
    handleClick: PropTypes.func
};

// 把样式也写在这里好了

const List = styled.div`
    display: flex;
    align-item: center;
    height: 30px;
    overflow: hidden;
    >span: first-of-type{
        display: block;
        flex: 0 0 auto;
        padding: 5px 0;
        color: grey;
        font-size: ${style['font-size-m']};
        vertical-align: middle;
    }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`

export default memo(Horizon)