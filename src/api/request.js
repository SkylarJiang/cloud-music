// import { axiosInstance } from './config';

// export const getBannerRequest = () => {
//     return axiosInstance.get('/banner')
// };

// export const getRecommendListRequest = () => {
//     return axiosInstance.get('/personalized')
// };

// // get 到需要的两个接口，到时候直接调用这些函数就能获取到相应数据

import { axiosInstance } from "./config";

export const getBannerRequest = () => {
  return axiosInstance.get ('/banner');
}

export const getRecommendListRequest = () => {
  return axiosInstance.get ('/personalized');
}

export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
}

export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?area=${category}&initial=${alpha.toLowerCase()}&offset=${count}`)
};

export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`)
};

export const getAlbumDetailRequest = id => {
  return axiosInstance.get (`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = id => {
  return axiosInstance.get(`artists?id=${id}`)
};

export const getHotKeyWordsRequest = () => {
  return axiosInstance.get (`/search/hot`);
};

export const getSuggestListRequest = query => {
  return axiosInstance.get (`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = query => {
  return axiosInstance.get (`/search?keywords=${query}`);
};
//获取对应歌曲的id
export const getSongDetailRequest = id => {
  return axiosInstance.get(`/song/detail?ids=${id}`)
}
