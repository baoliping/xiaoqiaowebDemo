angular.module('hrchatbotAdminApp')
    .directive('funfiltertab', function ($document) {
        return {
            restrict: 'EA',
            compile: function(tElem, tAttrs){
              console.log(name + ': compile');
              return {
                  pre: function(scope, iElem, iAttrs){
                      var pageFuntion = scope.pageFuntion;
                      var activefun = "scope." + iAttrs["ngClick"];
                      if (pageFuntion != null && pageFuntion != undefined) {
                          if (angular.isArray(pageFuntion)) {
                              for (var idx in pageFuntion) {
                                  if (pageFuntion[idx].name == iAttrs[this.name]) {
                                      if (pageFuntion[idx].is_active) {
                                          if (activefun != null && eval(activefun + "==null")) {
                                              eval(activefun)
                                          }
                                      } else {
                                         iElem[0].replaceWith()
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
					  	 		 if(iAttrs[this.name]== str){
					  	 		 	isfound = true;
                       		 		if( tag=='R'){
					  	 		 	 iElem.find("md-content").find('[ng-click]').css('display','none');
					  	 		 	 iElem.find("md-content").find('[ ng-blur]').css('display','none');
					  	 		 	 iElem.find("md-content").find('input').css('display','none');
					  	 		 	 iElem.find("md-content").find('textarea').css('display','none');
					  	 		 	 iElem.find("md-content").find('select').css('display','none');
					  	 		 	 iElem.find("md-content").find('div.form-bottom').hide();
					  	 		    }else{
					  	 		   	 
					  	 		   }
                                   break;
                       		 	}
					  	 		 
                       		 }
                       		 
                       		 if(!isfound){
                       		 	iElem[0].replaceWith()
                       		 }
                       	}
                       }
                      
                     //
                  },
                  post: function(scope, iElem, iAttrs){
                    console.log(name + ': post link');
                  }
              }
            },
        }
    }).directive('menufiltertab', function ($document) {
      return {
            restrict: 'EA',
            compile: function(tElem, tAttrs){
              console.log(name + ': compile');
              return {
                  pre: function(scope, iElem, iAttrs){
                      
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
					  	 		 if(iAttrs[this.name]== str){
					  	 		 	isfound = true;
                       		 		if( tag=='R'){
					  	 		 	 iElem.find("md-content").find('[ng-click]').css('display','none');
					  	 		 	 iElem.find("md-content").find('[ ng-blur]').css('display','none');
					  	 		 	 iElem.find("md-content").find('input').css('display','none');
					  	 		 	 iElem.find("md-content").find('textarea').css('display','none');
					  	 		 	 iElem.find("md-content").find('select').css('display','none');
					  	 		 	 iElem.find("md-content").find('div.form-bottom').hide();
					  	 		    }else{
					  	 		   	 
					  	 		   }
                                   break;
                       		 	}
					  	 		 
                       		 }
                       		 
                       		 if(!isfound){
                       		 	iElem[0].replaceWith()
                       		 }
                       	}
                       }
                      
                     //
                  },
                  post: function(scope, iElem, iAttrs){
                    console.log(name + ': post link');
                  }
              }
            },
        }
    })
