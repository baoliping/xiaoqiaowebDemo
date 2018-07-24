
angular.module('hrchatbotAdminApp')
  .factory("authHttpInterceptor", function ($q, $injector, storage) {
    var $http = null, $state = null;
    var getHttp = function () {
        if (!$http) {
            $http = $injector.get('$http');
        }
        return $http;
    };
    var getState = function () {
        if (!$state) {
            $state = $injector.get('$state');
        }
        return $state;
    }
    return {
        // 拦截成功的请求
        'request': function (config) {
          if (sessionStorage.token) {
            config.headers.Authorization = sessionStorage.token;
            } 
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        // 拦截失败的请求
        'requestError': function (rejection) {
            return $q.reject(rejection);
        },
        // 拦截成功的响应
        'response': function (response) {
        	response.config.responseTimestamp = new Date().getTime();
            return response;
        },
        // 对失败的响应进行处理
        'responseError': function (rejection) {
            if (rejection.status == 401) {
                //getMsg().error("未登录,请登陆后使用.");
                // alert('401了');
                storage.remove('user');
                storage.remove('token');
                getHttp().defaults.headers.common["Authorization"] = undefined;
                getState().go('login');
                return $q.reject(rejection);
            }
            if (rejection.status = 400) {
                //getState().go('errorPage');
                //self.location = 'error404.html';
                return $q.reject(rejection);
            }

            return $q.reject(rejection);
        }
    }
});