import axios from 'axios';
// import { logout } from './slices/auth';
// import store from './store';

const isPro = true //window.location.hostname === 'upme.cloud';
const request = axios.create({
  baseURL: isPro ? 'https://api.upme.cloud/' : 'https://api-test.upme.cloud/',
});

request.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.common['authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const requestEzDesk = axios.create({
  baseURL: isPro
    ? 'https://api.ezdesk.work/api/v1'
    : 'http://103.3.246.33:5000/api/v1',
});

requestEzDesk.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// let isAlreadyFetchingAccessToken = false;
// let subscribers = [];

// function onAccessTokenFetched(token) {
//   subscribers = subscribers.filter((callback) => callback(token));
// }

// function addSubscriber(callback) {
//   subscribers.push(callback);
// }

// request.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   async function (error) {
//     const {
//       config,
//       response: { status },
//     } = error;
//     const originalRequest = config;
//
//     if (status === 401) {
//       if (!isAlreadyFetchingAccessToken) {
//         isAlreadyFetchingAccessToken = true;
//
//         axios
//           .post(`${process.env.REACT_APP_API_BASE_URL}token/refresh`, {
//             refreshToken: localStorage.getItem('refreshToken'),
//           })
//           .then(({ data }) => {
//             console.log(data);
//             isAlreadyFetchingAccessToken = false;
//
//             localStorage.setItem('token', data.token);
//             localStorage.setItem('refreshToken', data.refreshToken);
//
//             onAccessTokenFetched(data.token);
//           })
//           .catch(() => {
//             store.dispatch(logout());
//           });
//       }
//
//       return new Promise((resolve) => {
//         addSubscriber((token) => {
//           originalRequest.headers.Authorization = 'Bearer ' + token;
//           resolve(axios(originalRequest));
//         });
//       });
//     }
//
//     return Promise.reject(error);
//   }
// );

export { request, requestEzDesk };
