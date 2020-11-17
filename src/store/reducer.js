import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index';
import { reducer as singersListReducer } from '../application/Singer/store';
import { reducer as rankLisReducer } from '../application/Rank/store';
import { reducer as albumReducer } from '../application/Album/store';
import { reducer as singerDetailReducer } from '../application/SingerDetail/store'
import { reducer as playerReducer } from '../application/Player/store';
import { reducer as searchReducer } from '../application/Search/store';

export default combineReducers({
    recommend: recommendReducer,
    singers: singersListReducer,
    rank: rankLisReducer,
    album: albumReducer,
    singerDetail: singerDetailReducer,
    player: playerReducer,
    search: searchReducer
})

