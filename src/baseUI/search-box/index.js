import React, {useRef, useState, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { debounce } from './../../api/utils';

const SearchBox = (props) => {
    const queryRef = useRef();
    const [query, setQuery] = useState('') //是否需要询问

    //从父组件 热门搜索 中拿到新的关键词（用于placeHolder）
    const { newQuery } = props;
    const { handleQuery } = props;
    //根据关键字是否存在决定清空按钮的显示/隐藏
    const displayStyle = query ? { display: 'block' } : { display: 'none' };

    //进场出现光标
    useEffect(() => {
        queryRef.current.focus();
    }, []);

    //【监听input框的内容，query改变时执行回调】
    const handleChange = (e) => {
        setQuery (e.currentTarget.value);
      };     
      // 缓存方法
    let handleQueryDebounce = useMemo (() => {
        return debounce (handleQuery, 500);
    }, [handleQuery]);     
    useEffect (() => {
        // 注意防抖
        handleQueryDebounce (query);
    }, [query]);
    
    //当父组件点击热门搜索的关键字，newQuery更新
    useEffect(() => {
        if (newQuery !== query) {
            setQuery(newQuery)
        }
    }, [newQuery])
    
    //清空的逻辑
    const clearQuery = () => {
        setQuery('');
        queryRef.current.focus();
    }

    return (
        <SearchBoxWrapper>
            <i className='iconfont icon-back' onClick={() => props.back()}>&#xe655;</i>
            <input
                ref={queryRef}
                className='box'
                placeholder='搜索歌手、歌曲、专辑'
                value={query} //默认值是获取到的query
                onChange={handleChange}
            />
            <i
                className='iconfont icon-delete'
                onClick={clearQuery}
                style={displayStyle}
            >&#xe600;</i>
        </SearchBoxWrapper>
    )
};

export default SearchBox;

//searchBoxWrapper的样式部分
const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${style["theme-color"]};
  .icon-back {
    font-size: 24px;
    color: ${style["font-color-light"]};
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style["theme-color"]};
    color: ${style["highlight-background-color"]};
    font-size: ${style["font-size-m"]};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style["border-color"]};
    &::placeholder {
      color: ${style["font-color-light"]};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${style["background-color"]};
  }
`