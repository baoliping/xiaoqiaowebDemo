'use strict';

/**
 * @ngdoc function
 * @name hrchatbotAdminApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hrchatbotAdminApp
 */
angular.module('hrchatbotAdminApp')
  .controller('LoginCtrl', function ($scope, $state, internetService, storage, $http, $rootScope,myWebsocket) {
    $scope.login = {
      name: null,
      password: null,
      messageError: null,
      visible: true
    }
    $scope.submit = function () {
      var data = {
        userName: $scope.login.name,
        password: $scope.login.password
      }
      if ($scope.login.name && $scope.login.password) {
        internetService.login(data).then(function (response) {
          if (response.data.userId != -1) {
            if(response.data.status == 400) {
              $scope.login.messageError = response.data.message;
            }else {
              $rootScope.user = response.data;
              storage.set('token', $rootScope.user.userId);
              $http.defaults.headers.common["Authorization"] = response.data.userId;
              storage.setObject('user', response.data);
              $state.go('main');
            }
          } else {
            $scope.login.messageError = 'Please enter a correct username and password. Note that both fields may be case-sensitive.';
          }
        }, function (error) {
          $scope.login.messageError = 'Network error. Please try again later!';
        })
      } else {
        $scope.login.messageError = 'Username or password cannot be empty!';
      }
    }
    $scope.visibleLogin = function () {
      $scope.login.visible = false;
    }
  });
