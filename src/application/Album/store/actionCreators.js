import { CHANGE_ENTER_LOADING, CHANGE_CURRENT_ALBUM } from './constants';
import { getAlbumDetailRequest } from '../../../api/request';
import { fromJS } from 'immutable';

const changeCurrentLoading = (data) => ({
    type: CHANGE_CURRENT_ALBUM,
    data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

export const getAlbumList = (id) => {
    return dispatch => {
        getAlbumDetailRequest(id).then(res => {
            let data = res.playlist;
            console.log(data)
            dispatch(changeCurrentLoading(data));
            dispatch(changeEnterLoading(false))
        }).catch(() => {
            console.log('获取album数据失败')
        })
    }
}