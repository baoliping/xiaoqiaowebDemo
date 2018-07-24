'use strict';

/**
 * @ngdoc function
 * @name hrchatbotAdminApp.factory:Common
 * @description
 * # Common
 * factory of the hrchatbotAdminApp
 */

angular.module('custom-template', []).run(function ($templateCache) {
　　$templateCache.put("template/modal/confirmModelTemplate.html",
　　'<div id="youModel" class="m-c">\n' +
　　' <div class="modal-header">\n' +
　　' <h4 class="modal-title">{{modalTitle}}</h4>\n' +
　　' </div>\n' +
　　' <div class="modal-body">{{modalContent}}</div>\n' +
　　' <div class="modal-footer" style="text-align: center;">\n' +
　　' <button type="button" class="btn btn-primary" ng-click="ok()">Ok</button>\n' +
　　' <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button>\n' +
　　' </div>\n' +
　　'</div>\n' +
　　"");
});

angular.module('hrchatbotAdminApp').factory('Common', 
　　function ($http, $q, $uibModal) {
　　　　return {
　　　　　　openConfirmWindow: function (modalTitle, modalContent, modalInstance) {
　　　　　　var deferred = $q.defer();
　　　　　　var confirmModal = $uibModal.open({
　　　　　　backdrop: 'static',
　　　　　　templateUrl: 'template/modal/confirmModelTemplate.html', // 指向确认框模板
　　　　　　controller: 'ConfirmCtrl',// 初始化模态控制器
　　　　　　windowClass: "confirmModal",// 自定义modal上级div的class
　　　　　　size: 'sm', //大小配置
　　　　　　resolve: {
　　　　　　　　data: function () {
　　　　　　　　return { modalTitle: modalTitle, modalContent: modalContent };//surgeonSug: $scope.surgeonSug,
　　　　　　}
　　　　}
　　});
　　// 处理modal关闭后返回的数据
　　confirmModal.result.then(function () {
　　　　if (!!modalInstance) {
　　　　　　modalInstance.dismiss('cancel');
　　　　}
　　　　deferred.resolve();
　　　　　　}, function () {
　　　　});
　　　　return deferred.promise;
　　　　}
　　}
});

angular.module('hrchatbotAdminApp')
.controller('ConfirmCtrl', function ($scope, $uibModalInstance, data) {
　　$scope.modalTitle = data.modalTitle;
　　$scope.modalContent = data.modalContent;
　　$scope.ok = function () {
　　$uibModalInstance.close(true);
　　};
　　//关闭邮件框
　　$scope.cancel = function () {
　　　　$uibModalInstance.dismiss('cancel');
　　};
});