angular.module('hrchatbotAdminApp')
    .directive('funfilter', function ($document) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                var pageFuntion = scope.pageFuntion;
                var activetab = null;
                try {
                    if (element.parent().attr("class").indexOf("tab-ul") != -1) {
                        var arr = element.attr("ng-class").split(/[:}=]+/)
                        activetab = "scope." + arr[1].trim();
                        if(pageFuntion == null || pageFuntion == undefined || pageFuntion.length == 0){
                          if (activetab != null && eval(activetab + "==null")) {
                              eval(activetab + "=" + arr[2])
                              eval("scope." + element.children().attr("ng-click"))
                          }
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
                if (pageFuntion != null && pageFuntion != undefined) {
                    if (angular.isArray(pageFuntion)) {
                        for (var idx in pageFuntion) {
                            if (pageFuntion[idx].name == attrs[this.name]) {
                                if (pageFuntion[idx].is_active) {
                                    if (activetab != null && eval(activetab + "==null")) {
                                        eval(activetab + "=" + arr[2])
                                        eval("scope." + element.children().attr("ng-click"))
                                    }
                                } else {
                                    element[0].replaceWith()
                                }
                                break;
                            }
                        }
                    }
                }
                 //
                     var menuFuntion = scope.menuFuntion;
                     if (menuFuntion != null && menuFuntion != undefined) {
                       	if (angular.isArray(menuFuntion)) {
                       		 var isfound = false;
                       		 for (var i=0;i< menuFuntion.length;i++) {
                       		 	var str=menuFuntion[i]
                       		 	 str=str.split('_');
					  	 		 var tag=str.pop();
					  	 		 str=str.join('_');
					  	 		 if(attrs[this.name]== str){
					  	 		 	isfound = true;
                       		 		if( tag=='R'){
					  	 		 	
					  	 		    }else{
					  	 		   	 
					  	 		   }
                                   break;
                       		 	}
					  	 		 
                       		 }
                       		 
                       		 if(!isfound){
                       		 	element[0].replaceWith()
                       		 }
                       	}
                       }
                      
                     //
                 
            }
        }
    });
