import React, { createContext, useReducer } from 'react';
import { fromJS } from 'immutable';

export const CategoryDateContext = createContext({});

//constant
export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

// reducer 纯函数
const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_CATEGORY:
            return state.set('category', action.data);
        case CHANGE_ALPHA:
            return state.set('alpha', action.data);
        default:
    }
}

// provider 组件

export const Data = props => {
    // 第二个参数传入初始值
    // 就是说我们用useReducer传入reducer函数和初始值
    // 就会返回相应的处理好的data及dispatch方法
    const [data, dispatch] = useReducer(reducer, fromJS({
        category: '',
        alpha: ''
    }));
    return (
        // 向下层组件提供了data和相应的dispatch方法
        // 那么我们在App组件中使用Data的Provider组件来包裹子组件
        <CategoryDateContext.Provider value={{ data, dispatch }}>
            {props.children}
        </CategoryDateContext.Provider>
    )
}