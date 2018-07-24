'use strict';

/**
 * @ngdoc overview
 * @name hrchatbotAdminApp
 * @description
 * # hrchatbotAdminApp
 *
 * Main module of the application.
 */
angular.module('hrchatbotAdminApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    //'ngRoute',
    'ui.router',
    'ui.router.state.events',
    'ngSanitize',
    'ngTouch',
    'ngWebSocket',
    'angular-loading-bar',
    'ui.bootstrap',
    'LocalStorageModule',
    'custom-template',
    'toaster',
    'tm.pagination',
    'ngTagsInput',
    'angular-cache',
    'angularjs-dropdown-multiselect',
    'ngMaterial'
  ])
.config(function ($httpProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.latencyThreshold = 500;
  var token = window.sessionStorage.token;
  if (token) {
    $httpProvider.defaults.headers.common['Authorization'] = token;
  }
  $httpProvider.interceptors.push('authHttpInterceptor');
})
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        prefetchTemplate:false
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        prefetchTemplate:false
      });
    if (sessionStorage.token) {
      $urlRouterProvider.otherwise('/main');
    } else {
      $urlRouterProvider.otherwise('/login');
    }
  })
  .run(function ($rootScope, $state, $location, storage, $http, CacheFactory, cacheRepository, CHATBOT_CONSTANTS,
      CHATBOT_URLS) {
    //add cache
   CacheFactory(CHATBOT_CONSTANTS.CACHE_REPO_NAME, {
        maxAge: 2 * 60 * 1000, // Items added to this cache expire after 15 minutes
        cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
        storageMode: 'localStorage',
        onExpire: function (key, value) {
            var _this = this; // "this" is the cache in which the item expired
            angular.injector(['ng']).get('$http').get(key).then(function (response) {
                if (key == CHATBOT_CONSTANTS.BASE_URL + CHATBOT_URLS.PAGE_FUN.GET_PAGE_FUN) {
                    $rootScope.pageFuntion = response.data.result;
                }
                var new_arr = [];
                new_arr[0] = response.status;
                new_arr[1] = response.data;
                new_arr[2] = { "content-type": response.headers("content-type") };
                new_arr[3] = response.statusText;
                new_arr[4] = response.xhrStatus;
                _this.put(key, new_arr);
            });
        }
    });
    //load cache data
    cacheRepository.loadCache();

    $rootScope.$on('$stateChangeStart', function (event, toState,transition) {
        if (toState.name == 'login') return;// 如果是进入登录界面则允许
        // 如果用户不存在
        if (!sessionStorage['token']) {
            event.preventDefault();// 取消默认跳转行为
            $state.go("login");//跳转到登录界面
        }
        if (toState.name != 'main') {
          storage.remove('manRecords');
          storage.remove('robotRecords');
      }
    });

    $rootScope.isWatched = function (exp) {
        var watchers = this.$$watchers;
        if (watchers == null || watchers == undefined) {
            return false;
        }
        var flag = false;
        for (var idx in watchers) {
            if (watchers[idx].exp == exp) {
                flag = true;
                break;
            }
        }
        return flag;
    };
  })