'use strict';

/**
 * @ngdoc function
 * @name hrchatbotAdminApp.factory:myWebsocket
 * @description
 * # MainCtrl
 * Controller of the hrchatbotAdminApp
 */


angular.module('hrchatbotAdminApp')
    .factory('cacheRepository', function (internetService, $rootScope, CacheFactory, CHATBOT_CONSTANTS) {
        function cacherepo() {
            this.loadCache = function () {
                var reqs = {}
                reqs["page function"] = internetService.getPageFun();
                for (var idx in reqs){
                    reqs[idx].then(function (response) {
                        if (idx == "page function") {
                            $rootScope.pageFuntion = response.data.result;
                        }
                        console.log("load " + idx + " successful.")
                    }, function (error) {
                        console.log("load " + idx + " failed.")
                    })
                }
            }
        }

        return new cacherepo()
       
    })