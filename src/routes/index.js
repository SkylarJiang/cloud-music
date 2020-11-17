import React from 'react';
import { Redirect } from 'react-router-dom';
import Home from '../application/Home';
import Recommend from '../application/Recommend';
import Rank from '../application/Rank';
import Singer from '../application/Singer';
import Album from '../application/Album';
import SingerDetail from '../application/SingerDetail';
import Search from '../application/Search';

export default [
    {
        path: '/',
        component: Home,
        // home对应的是公共组件
        routes: [
            {
                path: '/',
                exact: true,
                render: () => (
                    <Redirect to={'/recommend'}/>
                )
            },
            {
                path: '/recommend',
                component: Recommend,
                routes: [
                    {
                        path: '/recommend/:id',
                        component: Album
                    }
                ]
            },
            {
                path: '/singer/',
                component: Singer,
                keys: 'singer',
                routes: [
                    {
                        path: '/singer/:id',
                        component: SingerDetail
                    }
                ]
            },
            {
                path: '/rank/',
                component: Rank,
                key: 'rank',
                routes: [
                    {
                        path: '/rank/:id',
                        component: Album
                    }
                ]
            }, {
                path: "/album/:id",
                exact: true,
                key: "album",
                component: Album
            },
            {
                path: "/search",
                exact: true,
                key: "search",
                component: Search
            }
        ]
    }
]