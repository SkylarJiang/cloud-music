import React from 'react';
import { Provider } from 'react-redux'
import { GlobalStyle } from './style'
import { renderRoutes } from 'react-router-config';
// renderRoutes 读取路由配置转化为 route 标签
import routes from './routes/index.js';
import { HashRouter } from 'react-router-dom'
import store from './store';
import { Data } from './application/Singer/data'
import { IconStyle } from './assets/iconfont/iconfont';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {/*这样子被Data包裹下的路由（即所有组件）都能使用这个数据*/}
        <Data>
        { renderRoutes(routes) }
        </Data> 
      </HashRouter>
    </Provider>
  );
}

export default App;
