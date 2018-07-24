angular.module('hrchatbotAdminApp')
.directive('modalStyle', function($document){
  return function(scope, element, attr) {
    var e = element.parent();
    e.css('border-radius', '0');
    element= element.parent().parent(); 
    element.css({
        "cursor": 'move',
        "width": '400px'
    });
    element.draggable();
  }; 
});