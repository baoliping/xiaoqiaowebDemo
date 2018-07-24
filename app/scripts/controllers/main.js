﻿'use strict';

/**
 * @ngdoc function
 * @name hrchatbotAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hrchatbotAdminApp
 */
angular.module('hrchatbotAdminApp')
  .controller('MainCtrl', function ($scope, $uibModal,$http, internetService, storage, $state,
      myWebsocket, $interval, toaster, Common, $rootScope, CacheFactory, CHATBOT_URLS) {

    $scope.chatbot_letter_url = CHATBOT_URLS.CHATBOT_LETTER_URL;
    $rootScope.menuFuntion=[];
    $scope.user = JSON.parse(storage.get('user'));
    var list_arr=$scope.user.menus_list;
    if(list_arr.length>0){
  	 	$rootScope.menuFuntion=list_arr;
  	 }
    console.log('$scope.menus_list>>',$rootScope.menuFuntion);
    myWebsocket.openWebSocket($scope.user.userName);
    $scope.toaster = {
      type: 'success',
      title: 'Prompt',
      text: 'Message'
    };
    $("html").on("click", function(e) {
		if(!/imgicon/.test(e.target.className)) {
			 $scope.objimg={
       		"display":"none"
       		}
		}
	});
	$scope.download_url = CHATBOT_URLS.DOWNLOAD_PATH;
	$scope.bgImgFun=function(img_url,$event){

        $scope.imgurl=img_url
       $scope.objimg={
       	"display":"block"
       }
     }
     $scope.colsespan=function(){
       $scope.objimg={
       	"display":"none"
       }
     }
    angular.element(document).ready(function(){
      angular.element('#sidebar').mCustomScrollbar({
        theme: "minimal"
      });


      //获取当前时间，格式YYYY-MM-DD
      var tdate = new Date();
      var seperator1 = "-";
      var year = tdate.getFullYear();
      var month = tdate.getMonth() + 1;
      var strDate = tdate.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      var today = currentdate.split('-');//当前时间
      var nowDate = today[0] + '-' + today[1] + '-' + today[2];
      $scope.month = today[0] + '-' + today[1] + '-' + today[2];
      laydate.render({
        elem: '#exportDate', //指定元素
        max: nowDate,
        lang: 'en',
        range: '~'
      });

      //右键菜单
      $('#contextMenu').contextMenu('myMenu1',
      {
        //菜单样式
        menuStyle: {
          border: '1px solid #333',
          borderRadius: '4px',
        },
        //菜单项样式
        itemStyle: {
          border: 'none'
        },
        shadow : false,
        //菜单项鼠标放在上面样式
        itemHoverStyle: {
          color: '#333',
          backgroundColor: 'rgba(98, 195, 186, 0.5)',
          border: 'none'
        },
        //事件
        // bindings:
        // {
        //   'transfer': function(t) {
        //     alert('Trigger was '+t.id+'\nAction was Open');
        //   },
        //   'email': function(t) {
        //     alert('Trigger was '+t.id+'\nAction was Email');
        //   },
        //   'save': function(t) {
        //     alert('Trigger was '+t.id+'\nAction was Save');
        //   },
        //   'delete': function(t) {
        //     alert('Trigger was '+t.id+'\nAction was Delete');
        //   }
        // }
      });
    })
    $scope.openStatistcsModel = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/statistics.html',
        controller: 'StatisticsCtrl',
        scope: $scope,
        size: 'lg',
        resolve: {
          items: function () {

          }
        }
      });
      $scope.statistics.statisticsTab = null;
      $scope.statistics();
    }

    $scope.exoprt = function () {
      var val = $("#exportDate").val();
      if (val == null || val == "") {
        toaster.pop('warning', 'Warning', 'Date should not be null,please select the date!');
        return;
      }
      var valArr = val.split(" ~ ");
      var start_time = valArr[0];
      var end_time = valArr[1];
      var data = {
        start_time: start_time,
        end_time: end_time,
        login_name: $scope.user.userName
      }
      internetService.exoprt(data).then(function (response) {
        debugger;
        var filename = response.headers()['filename'];
        var contentType = response.headers()['content-type'];
        if ("application/json" == contentType) {
          toaster.pop('warning', 'Warning', 'No Data!');
          return;
        }
        var linkElement = document.createElement('a');
        try {
          var blob = new Blob([response.data], { type: contentType });
          var url = window.URL.createObjectURL(blob);

          linkElement.setAttribute('href', url);
          linkElement.setAttribute("download", filename);

          var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
          });
          linkElement.dispatchEvent(clickEvent);
          $("#exportDate").val("");
        } catch (ex) {

        }
      }, function(error){
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }

    $scope.logout = function () {
      var data = {
        userName: $scope.user.userName
      }
      internetService.logout(data).then(function (respones) {
        storage.remove('user');
        storage.remove('token');
        storage.remove('manRecords');
        storage.remove('robotRecords');
        storage.remove('changeobj');
        $http.defaults.headers.common["Authorization"] = undefined;
        myWebsocket.closeWebSocket();
        myWebsocket.socketStatus = false;
        myWebsocket.human_log_out = true;
        laydate.ready()
        $state.go('login');
      }, function(error){
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }

    $scope.exoprtDatas = {}
    $scope.statistics = function () {
      internetService.statistics().then(function (response) {
        $scope.chatData = response.data;
        var feedback = (($scope.chatData.mark_count / $scope.chatData.session_count) * 100).toFixed(2);
        var nofeedback = (100 - feedback).toFixed(2);
        $scope.exoprtDatas.feedback = 'Feedback: ' + feedback + '%';
        $scope.exoprtDatas.nofeedbock = 'No Feedback: ' + nofeedback + '%';
        $scope.exoprtDatas.mark_one = 'Bad: ' + $scope.chatData.mark_one;
        $scope.exoprtDatas.mark_second = 'Good: ' + $scope.chatData.mark_second;
        $scope.exoprtDatas.mark_threeL = 'Great: ' + $scope.chatData.mark_three;
        $scope.exoprtDatas.average = 'Average: ' + $scope.chatData.average;
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: 'Statistics',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['Great', 'Good','Bad']//打分次数、会话次数、未打分次数
          },
          series: [
              {
                name: 'Score statistics',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: $scope.chatData.mark_one, name: 'Bad' },
                    { value: $scope.chatData.mark_second, name: 'Good' },
                    { value: $scope.chatData.mark_three, name: 'Great' }
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
          ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

      }, function(error){
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }
    $scope.tab = 1;/*设置默认*/
    $scope.statistics.statisticsTab = 1;
    $scope.analysis = function () {
      //$scope.statistics.statisticsTab = 2;
      internetService.analysis().then(function(response){
        $scope.analysisDatamax = response.data.statistics_max;
        $scope.analysisDatamin = response.data.statistics_min;
      }, function(error){
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }
    $scope.openDetail=function(data){
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/detailChat.html',
        controller: 'detailChatCtrl',
        scope: $scope,
        size: 'md',
        resolve: {
          items: function () {

          }
        }
      });
      if(data.id) {
        var data = 'thumb_down_id=' + data.id +
                   '&conversation_name=' + data.conversation_name;
        internetService.thumbDownContext(data).then(function (response) {
          if(response.status == 200) {
            $scope.detailData=response.data;
          }
        }, function(error){
          toaster.pop('error', 'Error', 'Network error. Please try again later!');
        });
      }else {
        internetService.messages(data).then(function(response){
          $scope.detailData=response.data;
        }, function(error){
          toaster.pop('error', 'Error', 'Network error. Please try again later!');
        });
      }
    }
    $scope.setColor = function (status) {
      var p = "";
      if (status) {
          p = 'red';
      }
      return { "border-color": p };
    }

    //获取对话
    $scope.chat = {
      readmessage: [],
      chatContent: [],//聊天内容
      sendTime: null,
      currUserId: null, //当前聊天用户id
      HRName: null
    }
    $scope.chatList = storage.getObject('robotRecords');

    $scope.selectItem = function (key, chatd) {
      $scope.chat.questions = [];
      $scope.chat.currUserId = key;
      $scope.chat.eid = chatd.eid;
      $scope.chat.HRName = chatd.HRName;
      $scope.chat.level = chatd.level;
      $scope.chat.conversationSize = chatd.conversationSize;
      $scope.chat.conversationDate = chatd.conversationDate;
      var inttime;
      clearTimeout(inttime);
      angular.forEach($scope.chatList, function (item, index) {
        if (key == index) {
          item.selected = true;
          item.readMsg = item.messages.length;
          $scope.chat.chatContent = item.messages;
        } else {
          item.selected = false;
        }
      });
      $('#sidebar').removeClass('active');
      $('.overlay').fadeOut();

      $scope.questiondata($scope.chat.eid);
      inttime = setTimeout($scope.questiondata($scope.chat.eid), 541000);
    }
    $scope.questiondata = function (e) {
      var data = {
        eid: e
      }
      internetService.getSpecifiedQuestions(data).then(function(response) {
        $scope.chat.questions = response.data.question_list;
      })
    }
    $scope.setReadMsgs = function (key) {
      if(key){
        var item = $scope.chatList[key];
        if (item) {
          item.selected =true;

          $scope.chat.chatContent = item.messages;
          item.readMsgs = item.messages;
        } else {
          $scope.chat.chatContent = [];
        }
      }else{
        return false;
      }

    }

    //人工接管
    $scope.switchtohr = function(){
      if($scope.chat.HRName){
        return false;
      }
      if(!$scope.chat.currUserId){
        toaster.pop('prompt', 'Prompt', 'Please select one person!');
        return false;
      }
      var data = {
        'userName': $scope.user.userName,
        'conversationName' : $scope.chat.currUserId
      }
      internetService.switchtohr(data).then(function(response){
        $scope.tabtwo();
        if(!jQuery.isEmptyObject(storage.getObject('inform-bot'))) {
          var inform_bot = storage.getObject('inform-bot');
          angular.forEach(inform_bot, function (man, key) {
            if($scope.chat.currUserId == man.conversation_name) {
              inform_bot.splice(key, 1);
            }
          });
          storage.setObject('inform-bot', inform_bot);
        }
      }, function(error){
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }
    //人工服务
    $scope.manchatList = storage.getObject('manRecords');
    $scope.manChat = {
      manreadmessage: [],
      manchatContent: [],//聊天内容
      mansendTime: null,
      sendContent: null,//发送内容
      mancurrUserId: null, //当前聊天用户id
      sessionId: null,
      disabledChat: true,
      visibleOnline: false,
      HRName: null,
      transfervisible: true,
      bothandoffVisible: false,
      messagesInfoVisible1: false,//tab1是否有新的消息显示的红点
      messagesInfoVisible2: false,//tab2是否有新的消息显示的红点
      tabRobotMsg: storage.getObject('robotRecords'),
      tabManMsg: storage.getObject('manRecords'),
      messagesFocus: false,//显示正在输入消息
      isTyping: false
    }
    $scope.tabnoe=function(){
      $scope.tab = 1;
      $scope.manChat.transfervisible = true;
      $scope.manChat.bothandoffVisible = false;
       //点击tab2保存机器人消息
       $scope.manChat.tabRobotMsg = storage.getObject('robotRecords');
      //点击tab2保存机器人消息
      $scope.manChat.messagesInfoVisible1 = false;
    }
    $scope.tabtwo=function(){
      $scope.tab = 2;
      $scope.manChat.transfervisible = false;
      $scope.manChat.bothandoffVisible = true;
      //点击tab1保存人工消息
      $scope.manChat.tabManMsg = storage.getObject('manRecords');
      //判断新消息来时显示tab2的小红点
      $scope.manChat.messagesInfoVisible2 = false;
    }
    /**历史纪录分页**/
    $scope.paginationRcords = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50]
    }
    $scope.statisticsTab1 = function() {
      $scope.statistics.statisticsTab = 1;
    }
    $scope.statisticsTab2 = function() {
      $scope.statistics.statisticsTab = 2;
      $scope.analysis();
    }
    $scope.statisticsTab3 = function() {
      $scope.statistics.statisticsTab = 3;
      $scope.hrtask.hrVisible = false;
      $scope.hrtask.hrQuestion = [];
      if (!$scope.isWatched('paginationConf.currentPage + paginationConf.itemsPerPage')) {
          $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.qshrWorkload);
      }
    }
    $scope.record = {
      eid: '',
      historyRcords: [],
      catogryData: []
    }
    $scope.statisticsTab4 = function() {
      $scope.statistics.statisticsTab = 4;
      if (!$scope.isWatched('paginationRcords.currentPage + paginationRcords.itemsPerPage')) {
          $scope.$watch('paginationRcords.currentPage + paginationRcords.itemsPerPage', $scope.records);
      }
    }
    $scope.statisticsTab5 = function() {
      $scope.statistics.statisticsTab = 5;
      $scope.getCategory();
    }
    $scope.statisticsTab6 = function() {
      $scope.statistics.statisticsTab = 6;
      if (!$scope.isWatched('paginationThunbDown.currentPage + paginationThunbDown.itemsPerPage')) {
        $scope.$watch('paginationThunbDown.currentPage + paginationThunbDown.itemsPerPage', $scope.thumbDownList);
      }
    }
    //thumb Down List
    $scope.paginationThunbDown = {
      currentPage: 1,
      itemsPerPage: 5,
      perPageOptions: [5, 20, 30, 40, 50],
      totalItems: 0
    }
    $scope.thumbDownList = function () {
      var data = 'curPage=' + $scope.paginationThunbDown.currentPage +
                '&pageSize=' + $scope.paginationThunbDown.itemsPerPage;
      internetService.thumbDownList(data).then(function (response) {
        if(response.status == 200) {
          $scope.thnmbDownData = response.data.msgs;
          $scope.paginationThunbDown.totalItems = response.data.count;
        }
      }, function (response) {
        toaster.pop('error', 'Error', 'Network error. Please try again later!')
      })
    }
    $scope.records = function () {
      $('.displayData').css('display', 'none');
      var data = 'eid=' + $scope.record.eid + '&curPage=' + $scope.paginationRcords.currentPage
            + '&pageSize=' + $scope.paginationRcords.itemsPerPage;
      internetService.session(data).then(function (response) {
        $scope.record.historyRcords = response.data.conversation;
        $scope.paginationRcords.totalItems = response.data.count;//总页数
      })
    }
    $scope.getCategory = function () {
      internetService.getCategory().then(function (response) {
        $scope.record.catogryData = response.data;
      })
    }

    $scope.searchEID = function () {
      $scope.records();
    }
    $scope.searchRecords = function (event) {
      if(event.keyCode == 13){
        $scope.records();
      }
    }

    $scope.selectmanItem = function (key,chatd) {
      $scope.chat.questions = [];
      $scope.manChat.mancurrUserId = key;
      $scope.manChat.disabledChat = false;
      $scope.manChat.visibleOnline = false;
      $scope.manChat.sendType = chatd.send_type;
      $scope.chat.eid = chatd.eid;
      $scope.chat.level = chatd.level;
      $scope.chat.conversationSize = chatd.conversationSize;
      $scope.chat.conversationDate = chatd.conversationDate;
      $('.btnsend').addClass('active');
      $scope.manChat.HRName = chatd.HRName;
      if($scope.manChat.HRName && $scope.manChat.HRName != $scope.user.userName){
        $scope.manChat.disabledChat = true;
        //$scope.manChat.transfervisible = true;
        $('.btnsend').removeClass('active');
      }else{
        //$scope.manChat.transfervisible = true;
      }
      angular.forEach($scope.manchatList, function (item, index) {
        if (key == index) {
          item.selected = true;
          item.readMsg = 0;
          if(item.messages){
             item.readMsg = item.messages.length;
          }
          $scope.manChat.manchatContent = item.messages;

          $scope.manChat.sessionId = item.sessionId;
        } else {
          item.selected = false;
        }
      });
      var data = {
        eid: chatd.eid
      }
      internetService.getSpecifiedQuestions(data).then(function(response) {
        $scope.chat.questions = response.data.question_list;
      })
    }
    $scope.setmanReadMsgs = function (key) {
      if(key){
        var item = $scope.manchatList[key];
        if (item) {
          item.selected =true;

          $scope.manChat.manchatContent = item.messages;
          item.readMsgs = item.messages;
        } else {
          $scope.manChat.manchatContent = [];
        }
      }else{
        return false;
      }

    }
    var mark_readMesageFun=function(){
			var messagearr=[];
			angular.forEach($scope.manChat.manchatContent, function(item, index) {
				if(item.id){
					messagearr.push(item.id);
				}

			})
			var data={
				"msg_ids": messagearr
			} ;
			console.log("data",data);
			internetService.mark_readMessage(data).then(function(respones) {

			})
		};
    $scope.sendChat = function(){
      var data = {
        'conversationName' : $scope.manChat.mancurrUserId,
        'text': $scope.manChat.sendContent,
        'sessionId': $scope.manChat.sessionId,
        'mstype':"text",
        'send_type': $scope.manChat.sendType
      };
        if($scope.fileType=='image'){
    		data.mstype=$scope.fileType;
    		data.text=$scope.file_url;
    		data.fileName=$scope.sendname;
    	}
    	if($scope.fileType=='file'){
    		data.mstype=$scope.fileType;
    		data.text=$scope.filedata;
    		data.fileName=$scope.sendname;

    	}
    	if($scope.fileType=='vodio'){
    		data.mstype=$scope.fileType;
    		data.text=$scope.vodio_url;
    		data.fileName=$scope.sendname;
    	}
      if(!$scope.manChat.sendContent && $scope.fileType==''){
        return false;
      }
      myWebsocket.sendMessage(data);
      if(!jQuery.isEmptyObject(storage.getObject('inform-hr'))) {
        var inform_hr = storage.getObject('inform-hr');
        angular.forEach(inform_hr, function (man, key) {
          if($scope.manChat.mancurrUserId == man.conversation_name) {
            inform_hr.splice(key, 1);
          }
        });
        storage.setObject('inform-hr', inform_hr);
      }
      
      $scope.manChat.sendContent = "";
      $scope.fileType='';
      $scope.file_url='';
      $scope.filedata='';
      $scope.vodio_url='';
      $scope.sendname='';
    }
    $scope.keySendChat = function(event){
      if(event.keyCode == 13 && $scope.manChat.sendContent){
        $scope.sendChat();
       /* mark_readMesageFun();*/
      }
    }
    console.log('$scope.manChat.manchatContent',$scope.manChat.manchatContent);
    //$scope.show_inform_man = false;
    //$scope.show_inform_robot = false;
    $scope.setinter = function () {
      var promise = $interval(function () {
        var inform_man = storage.getObject('inform-hr');
        var inform_robot = storage.getObject('inform-bot');
        //robot
       var chatList = $scope.chatList;
       var newRobotRecords = storage.getObject('robotRecords');
       angular.forEach(newRobotRecords,function(item,index){
           if(chatList[index] != null && chatList[index] != undefined){
             item.readMsgs = chatList[index].readMsgs;
             if($scope.chat.currUserId == index){
               $scope.chat.readmessage = item.readMsgs;
             }
           }
       })
       $scope.chatList = newRobotRecords;
       storage.setObject('robotRecords',newRobotRecords);
       //Display message alerts
       if(!jQuery.isEmptyObject(inform_robot)) {
         angular.forEach(inform_robot, function (robot) {
          angular.forEach($scope.chatList, function (item, key) {
            if(key == robot.conversation_name) {
              $scope.chatList[key].show_inform_robot = true;
              $scope.chatList[key].show_inform_text = robot.text; 
            }
           });
         })
        
       }
       
       if (!jQuery.isEmptyObject($scope.chatList)) {
         if ($scope.chat.currUserId) {
             $scope.setReadMsgs($scope.chat.currUserId);
         }
       } else {
         $scope.chat.chatContent = [];
       }
       if($scope.tab == 2){
        //点击tab2保存机器人消息
        //判断新消息来时显示tab1的小红点.robot显示红点jQuery.isEmptyObject()判断是否是一个空对象
        $scope.manChat.messagesInfoVisible2 = false;
        $scope.manChat.tabManMsg = storage.getObject('manRecords');
        if(!jQuery.isEmptyObject($scope.chatList)){
          angular.forEach($scope.chatList, function(item, index){
            //if(item.HRName == $scope.user.userName) {
              if($scope.manChat.tabRobotMsg[index] != null && $scope.manChat.tabRobotMsg[index] != undefined){
                if($scope.manChat.tabRobotMsg[index].name != item.name){
                  $scope.manChat.messagesInfoVisible1 = true;
                }else if(item.messages && item.messages.length != 0 && $scope.manChat.tabRobotMsg[index].messages.length != item.messages.length){
                  $scope.manChat.messagesInfoVisible1 = true;
                }else{
                  $scope.manChat.messagesInfoVisible1 = false;
                }
              }else{
                  $scope.manChat.messagesInfoVisible1 = true;
              }
            //}
          })
        }else{
          $scope.manChat.messagesInfoVisible1 = false;
        }

      }


       //man
       var manchatList = $scope.manchatList;
       var newManRecords = storage.getObject('manRecords');
       angular.forEach(newManRecords,function(item,index){
           if(manchatList[index] != null && manchatList[index] != undefined){
             item.readMsgs = manchatList[index].readMsgs;
             if($scope.manChat.mancurrUserId == index){
               $scope.manChat.manreadmessage = item.readMsgs;
               //显示正在输入
               $scope.manChat.messagesFocus = item.isTyping;

                if(document.getElementById('input-text').id == document.activeElement.id){
                  if($scope.manChat.isTyping  == false){
                    $scope.manChat.isTyping = true;
                    var data = {
                      'conversationName' : $scope.manChat.mancurrUserId,
                      'isTyping': true,
                      'send_type': item.send_type
                    }
                    myWebsocket.sendMessage(data);
                  }
                }else{
                  if($scope.manChat.isTyping  == true){
                    $scope.manChat.isTyping = false;
                    var data = {
                      'conversationName' : $scope.manChat.mancurrUserId,
                      'isTyping': false,
                      'send_type': item.send_type
                    }
                    myWebsocket.sendMessage(data);
                  }
                }
             }
           }
       })
       $scope.manchatList = newManRecords;
       storage.setObject('manRecords',newManRecords);
       //Display message alerts
       if(!jQuery.isEmptyObject(inform_man)) {
         angular.forEach(inform_man, function (man) {
          angular.forEach($scope.manchatList, function (item, key) {
            if(key == man.conversation_name) {
              $scope.manchatList[key].show_inform_man = true;
              $scope.manchatList[key].show_inform_text = man.text; 
            }
           });
         });
        
       }

       //man显示红点jQuery.isEmptyObject()判断是否是一个空对象
       if(!jQuery.isEmptyObject($scope.manchatList) && $scope.tab == 1){
          $scope.manChat.messagesInfoVisible2 = false;
        }
       if (!jQuery.isEmptyObject($scope.manchatList)) {
         if ($scope.manChat.mancurrUserId) {
             $scope.setmanReadMsgs($scope.manChat.mancurrUserId);
         }
       }else{
        $scope.manChat.manchatContent = [];
        $scope.manChat.disabledChat = true;
       }

        if($scope.tab == 1){
          //点击tab1保存机器人消息
          //判断新消息来时显示tab2的小红点
          $scope.manChat.tabRobotMsg = storage.getObject('robotRecords');
          $scope.manChat.messagesInfoVisible1 = false;
          if(!jQuery.isEmptyObject($scope.manchatList)) {
            angular.forEach($scope.manchatList, function(item, index){
              if(item.HRName == $scope.user.userName) {
                if($scope.manChat.tabManMsg[index] != null && $scope.manChat.tabManMsg[index] != undefined){
                  if($scope.manChat.tabManMsg[index].name != item.name){
                    $scope.manChat.messagesInfoVisible2 = true;

                  }else if(item.messages && item.messages.length != 0 && $scope.manChat.tabManMsg[index].messages.length != item.messages.length){
                    $scope.manChat.messagesInfoVisible2 = true;
                  }else{
                    $scope.manChat.messagesInfoVisible2 = false;
                  }
                }else{
                   $scope.manChat.messagesInfoVisible2 = true;
                }
              }
            })
          }else{
            $scope.manChat.messagesInfoVisible2 = false;
          }

        }

        //$scope.messageBoardReplyRate();

      }, 1000);
      return promise;
     }

	 $scope.timemessage=function(){
	 	var promisenew = $interval(function() {
	 		$scope.messageBoardReplyRate();
	 	},300000)
	 	return promisenew;
	 }
	 var promisenew = $scope.timemessage();

     var promise = $scope.setinter();
     $scope.$on("$destroy", function () {
      $interval.cancel(promise);
      $interval.cancel(promisenew);
      $scope.$watch('chat.chatContent + chatlist + manChat.manchatContent + manchatList + manChat.sendContent');
     });
     //if (!$scope.isWatched('chat.chatContent + chatlist + manChat.manchatContent + manchatList + manChat.sendContent')) {
         $scope.$watch('chat.chatContent + chatlist + manChat.manchatContent + manchatList + manChat.sendContent', function () {
           setTimeout(function () {
             var unread = 0;
             if($scope.chat.chatContent && $scope.chat.readmessage ){
                unread = $scope.chat.chatContent.length - $scope.chat.readmessage.length;
             }
             var manUnread = 0;
             if ($scope.manChat.manchatContent && $scope.manChat.manchatContent){
                 manUnread = $scope.manChat.manchatContent.length - $scope.manChat.manreadmessage.length
             }
             if (unread > 0 && $('#chat-log')[0]) {
               $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
             }
             if (manUnread > 0 && $('#chat-man')[0]) {
              $('#chat-man').scrollTop($('#chat-man')[0].scrollHeight);
            }
           }, 0);
         });
    // }

    $scope.load = function () {

      $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').fadeOut();
      });

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').fadeIn();
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
      function rrr() {
        var data = {
          userName: $scope.user.userName
        }
        $.ajax({
          url: 'http://10.202.10.89:8070/app/logout',
          crossDomain: true,
          async: false,
          method: 'post',
          data: JSON.stringify(data),
          success: function(respones){
            storage.remove('user');
            storage.remove('token');
            storage.remove('manRecords');
            storage.remove('robotRecords');
            $http.defaults.headers.common["Authorization"] = undefined;
            myWebsocket.closeWebSocket();
            $state.go('login');
         }
        });
      }
      // window.onbeforeunload = function(event){
      //     return rrr();
      // };
    }
    $scope.load();

    $scope.onlineMan = function () {
      $('#myMenu1').css('display','none');
      if($scope.manChat.HRName && $scope.manChat.HRName != $scope.user.userName){
        toaster.pop('prompt', 'Prompt', 'Cannot be transferred!');
        return false;
      }
      if(!$scope.manChat.mancurrUserId){
        toaster.pop('prompt', 'Prompt', 'Please select one person!');
        return false;
      }
      internetService.onlineList().then(function(response){
        $scope.onlineDdata = []
        angular.forEach(response.data.online, function(item){
          if(item != $scope.user.userName){
            $scope.onlineDdata.push(item);
          }
        })
        $scope.manChat.visibleOnline = true;
      }, function(error){
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }
    $scope.selectOnline = function(data){
      var data = {
        'userName': data,
        'conversationName' : $scope.manChat.mancurrUserId
      }
      internetService.switchtohr(data).then(function(response){
        toaster.pop('success', 'Success', 'Success!');
        $scope.manChat.visibleOnline = false;
        $scope.manChat.HRName = data.userName;
        //$scope.manChat.transfervisible = true;
      }, function(error){
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }

    $scope.openUploadModel = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl',
        scope: $scope,
        size: 'md',
        resolve: {
          items: function () {

          }
        }
      });
      $scope.file = {
        fileInfo: null,
        fileName: null,
        filetype: null,
        types: [
          {value: 'HC'},
          {value: 'Leave'},
          {value: 'Relation'}
        ]
      }
    }
   
    $scope.fileChanged = function (ele) {
      $scope.file.fileInfo = ele.files[0].name;
      var hc = new RegExp(/HC.*\.xlsx/g);
      var leave = new RegExp(/Leave.*\.xlsx/g);
      var relation = new RegExp(/Relation.*\.xlsx/g);
      if (hc.test($scope.file.fileInfo)) {
          $scope.file.filetype = $scope.file.types[0];
      }
      if (leave.test($scope.file.fileInfo)) {
          $scope.file.filetype = $scope.file.types[1];
      }
      if (relation.test($scope.file.fileInfo)) {
        $scope.file.filetype = $scope.file.types[2];
      }
      $scope.$apply();
    }
    $scope.uploads = function(){
      if(!$scope.file.fileInfo) {
        toaster.pop('warning', 'Warning', 'Please select the file!');
        return false;
      }
      if($scope.file.fileInfo.split('_')[0] != $scope.file.filetype.value){
        toaster.pop('warning', 'Warning', 'Disagreement with the selected file type!');
        return false;
      }
      var f = new FormData();
        $scope.file.fileName = document.querySelector('#file').files[0];
        $scope.file.fileInfo = $scope.file.fileName.name;
        f.append('myfile', $scope.file.fileName);
        f.append('type', $scope.file.filetype.value);

        internetService.updatedb(f).then(function(respones){
          toaster.pop('success', 'Success', respones.data.result);
          document.querySelector('#file').value = "";
          $scope.file.fileInfo = null;
          $scope.file.filetype = $scope.file.types[0];
        }, function(error){
          if(error.status == 400) {
            toaster.pop('warning', 'Warning', error.data.detail);
          } else {
            toaster.pop('error', 'Error', 'Network error. Please try again later!');
          }
        })
    }

    /**hr任务分页**/
    $scope.paginationConf = {
      currentPage: 1,
      itemsPerPage: 5,
      perPageOptions: [5, 20, 30, 40, 50]
    };
    $scope.hrtask = {
      hrQuestion: [],
      hrVisible: false
    }
    $scope.qshrWorkload = function () {
      var val = $("#exportMonth").val();
      $('.displayhrTask').css('display', 'none');
      var start_time;
      var end_time;
      if (val == null || val == "") {
        start_time = "";
        end_time = "";
      }else{
        var valArr = val.split(" ~ ");
        start_time = valArr[0];
        end_time = valArr[1];
      }
      var data = {
        s_time: start_time,
        e_time: end_time,
        page_num: $scope.paginationConf.currentPage,
        page_size: $scope.paginationConf.itemsPerPage
      }
      internetService.qshrWorkload(data).then(function (response) {
        $scope.hrtask.hrQuestion = response.data.workload;
        $scope.totalPage = response.data.count;//总页数
        $scope.paginationConf.totalItems = $scope.totalPage;
        if($scope.hrtask.hrQuestion) {
          $scope.hrtask.hrVisible = true;
        }
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }

    $scope.closeChatman = function (data,id) {
      //当前登陆人不等于被托管人时不能删除会话
      if(data.HRName && data.HRName != $scope.user.userName){
        toaster.pop('prompt', 'Prompt', 'Cannot delete!');
        return false;
      }
      internetService.updateManualOffStatus(data.name).then(function (response) {
        toaster.pop('success', 'Success', 'Success!');
        //清空数据
        if($scope.manChat.mancurrUserId == id) {
          $scope.manChat.messagesFocus = false;
          $scope.chat.eid = null;
          $scope.chat.level = null;
          $scope.chat.conversationSize = null;
          $scope.chat.conversationDate = null;
          $scope.chat.questions = [];
          $scope.manChat.disabledChat = true;
        }
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }

    //点赞
    $scope.handUp = function () {

    }
    $scope.handDown = function () {

    }

    //开打Config
    $scope.openConfigModel = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/config.html',
        controller: 'ConfigCtrl',
        scope: $scope,
        size: 'lg',
        resolve: {
          items: function () {
          }
        }
      });
      $scope.configTab1();
    }

     /**Config分页**/
    $scope.paginationDouser = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    };
    $scope.config = {
      configTab: null,
      doUsergetDatas: [],
      nameadd: null,
      editName: null,
      name: null,
      doAnswerDatas: [],
      answerAdd: null,
      text: null,
      answerDetailDatas: [],
      keyWordsData: [],
      keywordsAdd: null,
      keywordsList: [],
      keywords: null,
      question: '',
      answer: '',
      embeddingAdapters: [],
      updateData_Visible: 1,
      conversationData:[],
      conversationList:[],
      messagetext:null,
    }
    //查询/刷新
    $scope.duUserget = function () {
      $('.goUserget').css('display', 'none');
      var data = 'curPage=' + $scope.paginationDouser.currentPage + '&pageSize=' + $scope.paginationDouser.itemsPerPage;
      internetService.doUserget(data).then(function (response) {
        $scope.config.doUsergetDatas = response.data.users;
        $scope.paginationDouser.totalItems = response.data.count;
        // if($scope.config.doUsergetDatas.length < 1) {
        //   $('.goUserget').css('display', 'block');
        // }else{
        //   $('.goUserget').css('display', 'none');
        // }
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }
    //添加
    $scope.doUserpost = function () {
      if(!$scope.config.nameadd) {
        toaster.pop('warning', 'Warning', 'Name cannot be empty!');
        return false;
      }
      var data = {
        'name': $scope.config.nameadd
      }
      internetService.doUserpost(data).then(function (response) {
        if(response.status == 200) {
          toaster.pop('success', 'Success', response.data.result);
          $scope.config.nameadd = '';
          $scope.duUserget();
        }
      }, function (response) {
        if(response.status == 400) {
          toaster.pop('warning', 'Warning', response.data.question_list);
        }else{
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
        }
      });
    }
    $scope.dblclickName = function (id) {
      $('#' + id).find('span').css('display', 'none');
      $('#' + id).find('input').css('display', 'block').focus();
      $scope.config.name = null;
      $scope.config.text = null;
      $scope.config.keywords = null;
      $scope.config.faq_td_question = null;
    }
    //修改
    $scope.editUser = function (id) {
      $('#' + id).find('span').css('display', 'block');
      $('#' + id).find('input').css('display', 'none');
      if(!$scope.config.name) {
        return false;
      }
      var data = {
        'id': id,
        'name': $scope.config.name
      }
      Common.openConfirmWindow('Update prompt!', 'Do you decide to modify it?').then(function () {
        internetService.updateUserPost(data).then(function(response) {
          if(response.status == 200) {
            toaster.pop('success', 'Success', "Update success!");
            $('#' + id).find('span')[0].innerText = $scope.config.name;
            $scope.duUserget();
          }
        }, function (response) {
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }
    //删除
    $scope.deleteName = function (id) {
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.updateUserDelete(id).then(function (response) {
          if(response.status == 200) {
            $scope.duUserget();
            toaster.pop('success', 'Success', "Delete success!");
          }
        }, function (response) {
            $scope.toaster.text = 'Network error. Please try again later!';
            toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }
    $scope.configTab1 = function () {
      $scope.config.configTab = 1;
      $scope.config.nameadd = '';
      if (!$scope.isWatched('paginationDouser.currentPage + paginationDouser.itemsPerPage')) {
          $scope.$watch('paginationDouser.currentPage + paginationDouser.itemsPerPage', $scope.duUserget);
      }
    }
    $scope.configTab2 = function () {
      $scope.config.configTab = 2;
      $scope.config.answerAdd = '';
      if (!$scope.isWatched('paginationDoanswer.currentPage + paginationDoanswer.itemsPerPage')) {
          $scope.$watch('paginationDoanswer.currentPage + paginationDoanswer.itemsPerPage', $scope.doUnableQuestionSearch);
      }
    }
    $scope.configTab3 = function () {
      $scope.config.configTab = 3;
      $scope.config.keywordsAdd = '';
      if (!$scope.isWatched('paginationOtherKeywords.currentPage + paginationOtherKeywords.itemsPerPage')) {
          $scope.$watch('paginationOtherKeywords.currentPage + paginationOtherKeywords.itemsPerPage', $scope.keyWordsSearch);
      }
    }
    $scope.configTab9 = function () {
      $scope.config.configTab = 9;
      $scope.config.keywordsAdd = '';
      $scope.config.messagetext='';
      if (!$scope.isWatched('paginationconversation.currentPage + paginationconversation.itemsPerPage')) {
          $scope.$watch('paginationconversation.currentPage + paginationconversation.itemsPerPage', $scope.hr_admin_keyword_getpage);
      }
    }
    $scope.configTab4 = function () {
      $scope.config.configTab = 4;
      $scope.contactGroup.contactName = '';
      $scope.contactGroup.contactDesc = '';
      $scope.searchContatGroupData();
    }
    $scope.configTab5 = function () {
      $scope.config.configTab = 5;
      $scope.config.question = '';
      $scope.config.answer = '';
      if (!$scope.isWatched('paginationQuestionLibrary.currentPage + paginationQuestionLibrary.itemsPerPage')) {
        $scope.$watch('paginationQuestionLibrary.currentPage + paginationQuestionLibrary.itemsPerPage', $scope.queryEmbeddingAdapter);
      }
    }
    $scope.configTab6 = function () {
      $scope.config.configTab = 6;
      $scope.config.auto_question = '';
      $scope.config.auto_answer = '';
      if (!$scope.isWatched('paginationAutoReply.currentPage + paginationAutoReply.itemsPerPage')) {
        $scope.$watch('paginationAutoReply.currentPage + paginationAutoReply.itemsPerPage', $scope.getAutoReply);
      }
    }
    $scope.configTab7 = function () {
      $scope.config.configTab = 7;
      $scope.config.faq_question = '';
      $scope.config.faqs_langData = ['en', 'zh-cn'];
      $scope.config.faqs_lang = $scope.config.faqs_langData[0];
      if (!$scope.isWatched('paginationFAQ.currentPage + paginationFAQ.itemsPerPage')) {
        $scope.$watch('paginationFAQ.currentPage + paginationFAQ.itemsPerPage', $scope.queryDoGreeting);
      }
    }
    $scope.configTab8 = function () {
      $scope.config.configTab = 8;
      // $scope.config.faq_question = '';
      if (!$scope.isWatched('paginationReationQuestion.currentPage + paginationReationQuestion.itemsPerPage')) {
        $scope.$watch('paginationReationQuestion.currentPage + paginationReationQuestion.itemsPerPage', $scope.queryRelationQuestion);
       }
    }
    $scope.configTab10 = function () {
      $scope.config.configTab = 10;
      if (!$scope.isWatched('paginationTakeoverWords.currentPage + paginationTakeoverWords.itemsPerPage')) {
        $scope.$watch('paginationTakeoverWords.currentPage + paginationTakeoverWords.itemsPerPage', $scope.queryTakeoverWords);
      }
    }
    // add
    $scope.addEmbeddingAdapter = function () {
      if(!$scope.config.question) {
        toaster.pop('warning', 'Warning', 'Question cannot be empty!');
        return;
      }
      if(!$scope.config.answer) {
        toaster.pop('warning', 'Warning', 'Wnswer cannot be empty!');
        return;
      }
      var reply_data = [];
      var reply = {
        'question': $scope.config.question,
        'intent_name': $scope.config.answer
      }
      reply_data.push(reply);
      var data = {
        'eid': $scope.user.userName,
        'reply_data': reply_data
      }
      internetService.addEmbeddingAdapter(data).then(function (response) {
        if(response.data.status == 200) {
          toaster.pop('success', 'Success', 'Add success!');
          $scope.queryEmbeddingAdapter();
          $scope.config.question = '';
          $scope.config.answer = '';
        } else {
          toaster.pop('warning', 'Warning', response.data.message);
        }
      }, function (response) {
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }
    //search/replay
    $scope.paginationQuestionLibrary = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    }
    $scope.queryEmbeddingAdapter = function () {
      var data = 'page_num=' + $scope.paginationQuestionLibrary.currentPage +
                '&page_size=' + $scope.paginationQuestionLibrary.itemsPerPage;
      internetService.queryEmbeddingAdapter(data).then(function (response) {
        if(response.data.status == 200) {
          $scope.config.embeddingAdapters = response.data.result;
          $scope.paginationQuestionLibrary.totalItems = response.data.count;
        }
      }, function (response) {
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      })
    }
    //update modoul
    $scope.openUpdateMoudel = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/update_data.html',
        controller: 'UpdateDataCtrl',
        scope: $scope,
        size: 'mg'
      });
      $scope.config.title_model = 'Update';
      $scope.config.add_relation_languageData = ['en', 'zh-cn'];
      $scope.config.add_relation_language = $scope.config.add_relation_languageData[0];
    }
    $scope.updateAdapter = function (data) {
      $scope.openUpdateMoudel();
      $scope.config.update_question = data.question;
      $scope.config.update_answer = data.intent_name;
      $scope.config.update_id = data.id;
      $scope.config.updateData_Visible = 1;
    }
    $scope.updateConversation=function(data){
    	$scope.openUpdateMoudel();
    	$scope.config.update_conversationMsg = data.text;
        $scope.config.update_conversationkeyword = data.keyword;
        $scope.config.update_conversation_id = data.id;
    	$scope.config.updateData_Visible = 9;
    }
    //Relative question about add model
    $scope.addRelationModel = function () {
      $scope.openUpdateMoudel();
      $scope.config.title_model = 'Add';
      $scope.config.updateData_Visible = 3; //add relation question
      $scope.config.add_relation_intentName = '';
      $scope.config.add_relation_question = '';
      $scope.config.add_relation_action = '';
    }
    //Relative question about update model
    $scope.updateRelationModel = function (data) {
      $scope.openUpdateMoudel();
      $scope.config.title_model = 'Update';
      $scope.config.updateData_Visible = 4; //add relation question
      $scope.config.add_relation_language = data.lang;
      $scope.config.add_relation_intentName = data.intent;
      $scope.config.add_relation_id = data.id;
      $scope.config.add_relation_question = data.question;
      $scope.config.add_relation_action = data.action;
    }
    //delete relation question
    $scope.deleteRelationQuestion = function (id) {
      var data = 'id=' + id;
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.deleteRelationQuestion(data).then(function (response) {
          if(response.status == 200) {
            toaster.pop('success', 'Success', "Delete success!");
            $scope.queryRelationQuestion();
          }
        }, function (response) {
          if(response.status == 400) {
            toaster.pop('warning', 'Warning', response.data.data);
          }else {
            toaster.pop('error', 'Error', 'Network error. Please try again later!');
          }
        });
      });
    }

    /**
     *
     * @param {takeover words*} id
     */
    //takeover words about add model
    $scope.addTakeoverWordsModel = function () {
      $scope.openUpdateMoudel();
      $scope.config.title_model = 'Add';
      $scope.config.updateData_Visible = 8;
      $scope.config.takeover_text = '';
      $scope.config.takeover_types = ['takeover words'];
      $scope.config.takeover_type = $scope.config.takeover_types[0];
    }
    //takeover words about update model
    $scope.updateTakeoverWordsModel = function (data) {
      $scope.openUpdateMoudel();
      $scope.config.title_model = 'Update';
      $scope.config.updateData_Visible = 10;
      $scope.config.takeover_id = data.id;
      $scope.config.takeover_text = data.text;
      angular.forEach($scope.config.takeover_types, function (item) {
        if(item == data.type) {
          $scope.config.takeover_type = item;
        }
      })
    }
    //query takeover words
    $scope.paginationTakeoverWords = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    }
    $scope.config.takeover_type = null;
    $scope.queryTakeoverWords = function () {
      var data = 'page_num=' + $scope.paginationTakeoverWords.currentPage +
                '&page_size=' + $scope.paginationTakeoverWords.itemsPerPage +
                '&type=' + $scope.config.takeover_type;
      internetService.getallSenswords(data).then(function (response) {
        if(response.data.status == 200) {
          $scope.config.takeover_data = response.data.result;
          $scope.paginationTakeoverWords.totalItems = response.data.count;
        }
      }, function (response) {
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }
    //delete takeover words
    $scope.deleteSensword = function (id) {
      var data = 'id=' + id;
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.deleteSensword(data).then(function (response) {
          if(response.data.status == 200) {
            toaster.pop('success', 'Success', "Delete success!");
            $scope.queryTakeoverWords();
          }
        }, function (response) {
            $scope.toaster.text = 'Network error. Please try again later!';
            toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }


    //delete question Library
    $scope.deleteEmbeddingAdapter = function (id) {
      var ids = [];
      var i = {
        id: id
      }
      ids.push(i);
      var data = {
        'eid': $scope.user.userName,
        'delete_data': ids
      }
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.deleteEmbeddingAdapter(data).then(function (response) {
          if(response.data.status == 200) {
            toaster.pop('success', 'Success', "Delete success!");
            $scope.queryEmbeddingAdapter();
          }
        }, function (response) {
            $scope.toaster.text = 'Network error. Please try again later!';
            toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }
    //删除关键字
    $scope.deleteConversation=function(id){
      var data = {
        'ids': id
      };
      console.log(data);
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.admin_keyword_delete(data).then(function (response) {
          if(response.data.result == 'successful operation') {
            toaster.pop('success', 'Success', "Delete success!");
            $scope.hr_admin_keyword_getpage();
          }
        }, function (response) {
            $scope.toaster.text = 'Network error. Please try again later!';
            toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }
    ////auto reply
    $scope.paginationAutoReply = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    }
    $scope.config.auto_typesData = ['all','smalltalk','business'];
    $scope.config.change_t =  $scope.config.auto_typesData[0];
    //Obtain auto replay
    $scope.getAutoReply = function () {
      $scope.config.auto_types = ['smalltalk','business'];
      var data = 'page_num=' + $scope.paginationAutoReply.currentPage +
                '&page_size=' + $scope.paginationAutoReply.itemsPerPage +
                '&question_type=' + $scope.config.change_type;
      internetService.getAutoReply(data).then(function (response) {
        if(response.status == 200) {
          $scope.config.auto_autoPlay = response.data.result;
          $scope.paginationAutoReply.totalItems = response.data.count;
        }
      }, function (response) {
        toaster.pop('error', 'Error', 'Network error. Please try again later!')
      })
    }
    $scope.seachChangeAuto = function (type) {
      if(type == 'all') {
        $scope.config.change_type = '';
      } else {
        $scope.config.change_type = type;
      }
      $scope.getAutoReply();
    }
    $scope.updateAutoReply = function (data) {
      $scope.openUpdateMoudel();
      $scope.config.auto_question = data.question;
      $scope.config.auto_answer = data.answer;
      $scope.config.auto_id = data.id;
      $scope.config.updateData_Visible = 2;
      angular.forEach($scope.config.auto_types, function (item) {
        if(item == data.question_type) {
          $scope.config.auto_type = item;
          return
        }
      });
    }
    //$
    $scope.addAutoReplyModel = function () {
      $scope.openUpdateMoudel();
      $scope.config.title_model = 'Add';
      $scope.config.auto_question = '';
      $scope.config.auto_answer = '';
      $scope.config.updateData_Visible = 7;
      $scope.config.auto_type = $scope.config.auto_types[0];
    }
    //delete auto reply
    $scope.deleteAutoReply = function (id) {
      var ids = [];
      var i = {
        id: id
      }
      ids.push(i);
      var data = {
        'eid': $scope.user.userName,
        'delete_data': ids
      }
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.deleteAutoReply(data).then(function (response) {
          if(response.data.status == 200) {
            toaster.pop('success', 'Success', "Delete success!");
            $scope.getAutoReply();
          }
        }, function (response) {
            $scope.toaster.text = 'Network error. Please try again later!';
            toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }

    //FAQs
    $scope.paginationFAQ = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    }
    //add FAQ
    $scope.addDoGreeting = function () {
      if(!$scope.config.faq_question) {
        toaster.pop('warning', 'Warning', 'Question cannot be empty!');
        return;
      }
      var data = {
        'operator': $scope.user.userName,
        'greeting': $scope.config.faq_question,
        'lang': $scope.config.faqs_lang
      }
      internetService.addDoGreeting(data).then(function (response) {
        if(response.status == 200) {
          toaster.pop('success', 'Success', 'Add success!');
          $scope.queryDoGreeting();
          $scope.config.faq_question = '';
        }
      }, function (response) {
        if(response.status == 400) {
          toaster.pop('warning', 'Warning', response.data.data);
        }else{
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
        }
      })
    }
    // query FAQ
    $scope.queryDoGreeting = function () {
      var data = 'curPage=' + $scope.paginationFAQ.currentPage +
                '&pageSize=' + $scope.paginationFAQ.itemsPerPage;
      internetService.queryDoGreeting(data).then(function (response) {
        if(response.status == 200) {
          $scope.config.faqDatas = response.data.users;
          $scope.paginationFAQ.totalItems = response.data.count;
        }
      }, function (response) {
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
      })
    }
    //FAQS about update model
    $scope.updateFAQSModel = function (data) {
      $scope.openUpdateMoudel();
      $scope.config.title_model = 'Update';
      $scope.config.updateData_Visible = 6;
      angular.forEach($scope.config.faqs_langData, function (item) {
        if(item == data.lang) {
          $scope.config.faqs_language = item;
        }
      })
      $scope.config.faqs_id = data.id;
      $scope.config.faqs_quest = data.greeting;
    }

    //delete FAQ
    $scope.deleteFAQ = function (id) {
      var i = 'id=' + id;
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.deleteGreeting(i).then(function (response) {
          if(response.status == 200) {
            toaster.pop('success', 'Success', "Delete success!");
            $scope.queryDoGreeting();
          }
        }, function (response) {
            $scope.toaster.text = 'Network error. Please try again later!';
            toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }


    //relation question
    $scope.paginationReationQuestion = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    }
    // query relation question
    $scope.queryRelationQuestion = function () {
      var data = 'curPage=' + $scope.paginationReationQuestion.currentPage +
                '&pageSize=' + $scope.paginationReationQuestion.itemsPerPage;
      internetService.queryRelationQuestion(data).then(function (response) {
        if(response.status == 200) {
          $scope.config.relationQuestions = response.data.relationquestions;
          $scope.paginationReationQuestion.totalItems = response.data.count;
        }
      }, function (response) {
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
      })
    }
    //add relation question
    $scope.addRalationQuestion = function (data) {
      $scope.openUpdateMoudel();
      $scope.config.update_question = data.question;
      $scope.config.update_answer = data.intent_name;
      $scope.config.update_id = data.id;
      $scope.config.updateData_Visible = 1;
    }
    $scope.tooltips = function () {
        $("[data-toggle='tooltip']").tooltip();
    }

    //Answer
     $scope.paginationDoanswer = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    };
    //查询/刷新
    $scope.doUnableQuestionSearch = function () {
      $('.goAnswerget').css('display', 'none');
      var data = 'curPage=' + $scope.paginationDoanswer.currentPage + '&pageSize=' + $scope.paginationDoanswer.itemsPerPage;
      internetService.doUnableQuestionSearch(data).then(function (response) {
        $scope.config.doAnswerDatas = response.data.questions;
        $scope.paginationDoanswer.totalItems = response.data.count;
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }
    //添加
    $scope.doUnableQuestionAdd = function () {
      if(!$scope.config.answerAdd) {
        toaster.pop('warning', 'Warning', 'Answer cannot be empty!');
        return false;
      }
      var data = {
        'text': $scope.config.answerAdd
      }
      internetService.doUnableQuestionAdd(data).then(function (response) {
        if(response.status == 200) {
          toaster.pop('success', 'Success', response.data.result);
          $scope.config.answerAdd = '';
          $scope.doUnableQuestionSearch();
        }
      }, function (response) {
        if(response.status == 400) {
          toaster.pop('warning', 'Warning', response.data.question_list);
        }else{
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
        }
      });
    }
    //修改
    $scope.editAnswer = function (id) {
      $('#' + id).find('span').css('display', 'block');
      $('#' + id).find('input').css('display', 'none');
      if(!$scope.config.text) {
        return false;
      }
      var data = {
        'id': id,
        'text': $scope.config.text
      }
      Common.openConfirmWindow('Update prompt!', 'Do you decide to modify it?').then(function () {
        internetService.updateUnableQuestionUpdate(data).then(function(response) {
          if(response.status == 200) {
            toaster.pop('success', 'Success', "Update success!");
            $('#' + id).find('span')[0].innerText = $scope.config.text;
            $scope.doUnableQuestionSearch();
          }
        }, function (response) {
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }
     //删除
     $scope.deleteAnswer = function (id) {
      Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
        internetService.updateUnableQuestionDelete(id).then(function (response) {
          if(response.status == 200) {
            $scope.doUnableQuestionSearch();
            toaster.pop('success', 'Success', "Delete success!");
          }
        }, function (response) {
            $scope.toaster.text = 'Network error. Please try again later!';
            toaster.pop('error', 'Error', $scope.toaster.text);
        });
      });
    }
    //answer detail
    $scope.openAnswerDetailModel = function (data) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/amwerDetail.html',
        controller: 'AnswerDetailCtrl',
        scope: $scope,
        size: 'lg',
        resolve: {
          items: function () {

          }
        }
      });
      $scope.answerDetail(data.text);
    }
    $scope.answerDetail = function (text) {
      $('.answerdetail').css('display', 'none');
      var data = {
        'text': text
      }
      internetService.unableAnswerDetail(data).then(function (response) {
        $scope.config.answerDetailDatas = response.data;
        if($scope.config.answerDetailDatas.length < 1) {
          $('.answerdetail').css('display', 'block');
        }else{
          $('.answerdetail').css('display', 'none');
        }
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }

    //Other Keywords
    $scope.paginationOtherKeywords = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    };
    //查询conversation
    $scope.paginationconversation = {
      currentPage: 1,
      itemsPerPage: 10,
      perPageOptions: [10, 20, 30, 40, 50],
      totalItems: 0
    };
     //查询conversation
    $scope.hr_admin_keyword_getpage = function () {
      $('.keyWords').css('display', 'none');
      var data ={
      	"curPage":$scope.paginationconversation.currentPage,
		"pageSize":$scope.paginationconversation.itemsPerPage
      };

      internetService.hr_admin_keyword_getpage(data).then(function (response) {
      	$scope.config.conversationData = response.data.keywordModel;
        $scope.paginationconversation.totalItems = response.data.count;
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }
    //查询
    $scope.keyWordsSearch = function () {
      $('.keyWords').css('display', 'none');
      var data = 'page_num=' + $scope.paginationOtherKeywords.currentPage + '&page_size=' + $scope.paginationOtherKeywords.itemsPerPage;
      internetService.keyWordsSearch(data).then(function (response) {
        $scope.config.keyWordsData = response.data.result;
        $scope.paginationOtherKeywords.totalItems = response.data.count;
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }
    //添加
    $scope.addKeywords = function () {
      $scope.config.keywordsList = [];
      var keyword = $scope.config.keywordsList.push($scope.config.keywordsAdd);
      if(!$scope.config.keywordsAdd) {
        toaster.pop('warning', 'Warning', 'Keywords cannot be empty!');
        return false;
      }
      var data = {
        'keywords': $scope.config.keywordsList,
        'eid': $scope.user.userName
      }
      internetService.addKeywords(data).then(function (response) {
        if(response.status == 200) {
          toaster.pop('success', 'Success', response.data.result);
          $scope.config.keywordsAdd = '';
          $scope.keyWordsSearch();
          $scope.config.keywordsList = [];
        }
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }
    //添加 conversation
    $scope.hr_admin_keyword_add = function () {
      $scope.config.conversationList = [];
      var keyword = $scope.config.conversationList.push($scope.config.keywordsAdd);
      if(!$scope.config.keywordsAdd) {
        toaster.pop('warning', 'Warning', 'Keywords cannot be empty!');
        return false;
      }
      if(!$scope.config.messagetext) {
        toaster.pop('warning', 'Warning', 'messagetext cannot be empty!');
        return false;
      }
      var data = {
        'text': $scope.config.messagetext,
        'keyword': $scope.config.keywordsAdd
      }
      internetService.admin_keyword_add(data).then(function (response) {
        if(response.status == 200) {
          toaster.pop('success', 'Success', response.data.result);
          $scope.config.keywordsAdd = '';
          $scope.config.messagetext='';
          $scope.hr_admin_keyword_getpage();
          $scope.config.conversationList = [];
        }
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    }
   //修改
   $scope.editKeywords = function (id) {
    $('#' + id).find('span').css('display', 'block');
    $('#' + id).find('input').css('display', 'none');
    if(!$scope.config.keywords) {
      return false;
    }
    var data = {
      'id': id,
      'text': $scope.config.keywords
    }
    var datas = [];
    var d = datas.push(data);
    Common.openConfirmWindow('Update prompt!', 'Do you decide to modify it?').then(function () {
      internetService.updateKeywords(datas).then(function(response) {
        if(response.status == 200) {
          toaster.pop('success', 'Success', "Update success!");
          $('#' + id).find('span')[0].innerText = $scope.config.text;
          $scope.keyWordsSearch();
          datas = [];
        }
      }, function (response) {
        $scope.toaster.text = 'Netw.ork error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    });
  }
   //删除
   $scope.deleteKeywords = function (id) {
    var data = [];
    data.push(id);
    var d = {
      "id": data
    }
    Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
      internetService.deleteKeywords(d).then(function (response) {
        if(response.status == 200) {
          $scope.keyWordsSearch();
          toaster.pop('success', 'Success', 'Delete success!');
          data = [];
        }
      }, function (response) {
          $scope.toaster.text = 'Network error. Please try again later!';
          toaster.pop('error', 'Error', $scope.toaster.text);
      });
    });
  }
  //添加到关键字
  $scope.addkeyword = function (item) {
    $scope.config.keywordsList = [];
    var keyword = $scope.config.keywordsList.push(item);
    if(!item) {
      return false
    }
    var data = {
      'keywords': $scope.config.keywordsList,
      'eid': $scope.user.userName
    }
    Common.openConfirmWindow('Need confirm!', 'Are you confirmed it should be low efficiency question?').then(function () {
      internetService.addKeywords(data).then(function (response) {
        if(response.status == 200) {
          toaster.pop('success', 'Success', 'Add success!');
          $scope.config.keywordsAdd = null;
          $scope.questiondata($scope.chat.eid);
          $scope.config.keywordsList = [];
        }
      }, function (response) {
        $scope.toaster.text = 'Network error. Please try again later!';
        toaster.pop('error', 'Error', $scope.toaster.text);
      });
    });
  }

  //Contact Group
  $scope.contactGroup = {
    contactName: null,
    contactDesc: null,
    ContactGroupDatas: [],
    contactGroupName: null,
    ContactGroupDesc: null,
    contactGroupId: null
  }
  //search
  $scope.searchContatGroupData = function () {
    internetService.converGroupSearch().then(function (response) {
        $scope.contactGroup.ContactGroupDatas = response.data.result;
    })
  }
  //add
  $scope.addContactGroupData = function () {
    if(!$scope.contactGroup.contactName) {
      toaster.pop('warning', 'Warning', 'Name cannot be empty!');
      return
    }
    if(!$scope.contactGroup.contactDesc) {
      toaster.pop('warning', 'Warning', 'Describe cannot be empty!');
      return
    }
    var data = {
      name: $scope.contactGroup.contactName,
      desc: $scope.contactGroup.contactDesc,
      crt_by: $scope.user.userName
    }
    internetService.converGroupAdd(data).then(function (response) {
      if(response.status == 200) {
        $scope.searchContatGroupData();
        toaster.pop('success', 'Success', "Add success!");
        $scope.contactGroup.contactName = '';
        $scope.contactGroup.contactDesc = '';
      }
    }, function (response) {
      toaster.pop('error', 'Error', 'Netw.ork error. Please try again later!');
    })
  }
  //Contact group about update model
  $scope.updateContactGroupModel = function (data) {
    // $scope.openUpdateMoudel();
    // $scope.config.title_model = 'Update';
    // $scope.config.updateData_Visible = 5;
    // $scope.config.update_contact_name = data.name;
    // $scope.config.update_contact_describe = data.desc;
  }
  //update
  $scope.updateContactGroupData = function () {
    if(!$scope.config.update_contact_name) {
      toaster.pop('warning', 'Warning', 'Name cannot be empty!');
      return;
    }
    if(!$scope.config.update_contact_describe) {
      toaster.pop('warning', 'Warning', 'Describe cannot be empty!');
      return;
    }
  }
  //delete
  $scope.deleteContactGroupData = function (id) {
    var data = {
      id: id
    }
    Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
      internetService.converGroupDelete(data).then(function (response) {
        if(response.status == 200) {
          $scope.searchContatGroupData();
          toaster.pop('success', 'Success', "Delete success!");
        }
      }, function (response) {
        toaster.pop('error', 'Error', 'Netw.ork error. Please try again later!');
      })
    });
  }
  //add member moudel
  $scope.openContactGroupMemberModel = function (id) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/contact_group_member.html',
      controller: 'ContactGroupMemberCtrl',
      scope: $scope,
      size: 'mg',
      resolve: {
        items: function () {

        }
      }
    });
    $scope.contactGroup.contactGroupId = id;
    $scope.contactList.contactText = '';
    $scope.contactRecent();
  }
  //add contact group
  $scope.converGroupMembersAdd = function (eid) {
    var eids = [];
    eids.push(eid);
    var data = {
      id: $scope.contactGroup.contactGroupId,
      eids: eids
    }
    internetService.converGroupMembersAdd(data).then(function (response) {
      debugger
      if(response.status == 200) {
        $scope.searchContatGroupData();
        toaster.pop('success', 'Success', "Add success!");
      }
    }, function (response) {
      toaster.pop('error', 'Error', 'Netw.ork error. Please try again later!');
    })
  }
  //contact group delete
  $scope.converGroupMemberDelete = function (id, eid) {
    var eids = [];
    eids.push(eid);
    var data = {
      id: id,
      eids: eids
    }
    Common.openConfirmWindow('Delete prompt!', 'Do you decide to delete it?').then(function () {
      internetService.converGroupMemberDelete(data).then(function (response) {
        if(response.status == 200) {
          $scope.searchContatGroupData();
          toaster.pop('success', 'Success', "Delete success!");
        }
      }, function (response) {
        toaster.pop('error', 'Error', 'Netw.ork error. Please try again later!');
      })
    });
  }



  //打开留言
  $scope.replay = {
    replayMessage: false,
    messageBoards: [],
    replayMsg: null,
    replyRoat: null,
    ontimeRate: null
  }
  $scope.openNewinfoModel = function () {
  	$scope.pagecount=1;
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/newinfo.html',
      controller: 'NewinfoCtrl',
      scope: $scope,
      size: 'lg',
      /*windowClass:'newinfo-window',*/
      resolve: {
        items: function () {

        }
      }
    });
    $scope.paginationNewinfo = {
      currentPage: 1,
      itemsPerPage: 5,
      perPageOptions: [5, 20, 30, 40, 50],
      totalItems: 0
    };
    $scope.messageBoardOntimeRate();
    if (!$scope.isWatched('paginationNewinfo.currentPage + paginationNewinfo.itemsPerPage')) {
        $scope.$watch('paginationNewinfo.currentPage + paginationNewinfo.itemsPerPage', $scope.messagePageInfo);
    }
  }

  $scope.messagePageInfo = function () {
    var data = {
      'curPage': $scope.paginationNewinfo.currentPage,
      'pageSize': $scope.paginationNewinfo.itemsPerPage
    }
    internetService.messageBoardPage(data).then(function (response) {
      $scope.replay.messageBoards = response.data.messageBoards;
      $scope.paginationNewinfo.totalItems = response.data.count;
       $scope.replay.messageBoards.forEach(function(item,index){
					/*item.childrenList=((item.childrenAndReply)[0].children).list;*/
					item.mesageList=((item.childrenAndReply)[0].muti_reply_message_board).list;

				})
      //

      //
    })
  }
  $scope.openNewinfoDetailModel = function (msg) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/newinfo_detail.html',
      controller: 'NewinfoDetailCtrl',
      scope: $scope,
      size: 'mg',
      resolve: {
        items: function () {

        }
      }
    });
    $scope.replay.replayMessage = false;
    $scope.replay.subject = msg.subject;
    $scope.replay.text = msg.text;
    $scope.replay.eid = msg.eid;
    $scope.replay.replyId = msg.id;
    $scope.replay.replayMsg = null;
  }
  $scope.replayMsg = function () {
    $scope.replay.replayMessage = true;
  }
  //开始
  $scope.upMessage=function(msg){
  	msg.isup=false;
  	msg.filrstthrem='';
    msg.childrenCount=0;
    msg.mesageList=[];
    	msg.childrenList=[];
    	msg.showfals=false;
    	$scope.pagecount=1;
  }
  $scope.showMessage=function(msg){
  	msg.showfals=true;
  	msg.isup=true;
  	$scope.messageDetailFun(msg);
    };
    $scope.mesageList='';
    //加载更多
    $scope.loadMoreMessage=function(msg){
    		var pk='';
   	if(msg.parent && msg.parent !=''){
   		pk=msg.parent;
   	}else{
   		pk=msg.id;
   	}

	 $scope.pagecount++;
			  var toatl= msg.childrenCount
			if($scope.pagecount<=toatl){
	 	var data = {
				"pk":pk,
				'curPage':$scope.pagecount,
				'pageSize': 2
			}
   	 internetService.messageDetail(data).then(function (response) {
       var data=response.data;
       var messageBoards=data.messageBoards;

        if(messageBoards[0].muti_reply_message_board != {}) {
					 var arr= messageBoards[0].children.list;
					if(arr.length>0){
						arr.forEach(function(item,index){
							(msg.childrenList).push(item);
						})
					}
                }
     });
     }else{
				 toaster.pop('warning', 'Warning', 'No Data!');
			}
    }
   //留言详情
   $scope.pagecount=1;
   $scope.messageDetailFun=function(msg){
   	var pk='';
   	if(msg.parent && msg.parent !=''){
   		pk=msg.parent;
   	}else{
   		pk=msg.id;
   	}


	 	var data={
		"pk":pk,
		'curPage':$scope.pagecount,
		'pageSize': 10
	 }
   	 internetService.messageDetail(data).then(function (response) {
       var data=response.data;
       var messageBoards=data.messageBoards;
        msg.filrstthrem=messageBoards[0];
        msg.childrenCount=(messageBoards[0].children).count;
	    msg.totalPage=msg.childrenCount/10;
        if(messageBoards[0].muti_reply_message_board!={}){
        	msg.mesageList=messageBoards[0].muti_reply_message_board.list;
        	msg.childrenList=messageBoards[0].children.list;


        }
        console.log( ' $scope.pagecount', $scope.pagecount)
         console.log( msg.totalPage)
     });



   };
   //二级回复留言
   $scope.sendFun=function(childrenmsg){
   	var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/newinfo_detail.html',
      controller: 'NewinfoDetailCtrl',
      scope: $scope,
      size: 'mg',
      resolve: {
        items: function () {

        }
      }
    });
    $scope.replay.replayMessage = false;
    $scope.replay.subject = childrenmsg.subject;
    $scope.replay.text = childrenmsg.text;
    $scope.replay.eid = childrenmsg.eid;
    $scope.replay.replyId = childrenmsg.id;
    $scope.replay.replayMsg = null;
   };
   //上传文件
   //视屏播放
   //图片放大
  /* $scope.bgImgFun=function(imgurl,$event){
   	var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/bgimg.html',
      controller: 'imgCtrl',
      scope: $scope,
      resolve: {
        items: function () {
           return imgurl;
        }
      }
    });
   }*/
   $scope.videoButton=false;
   $scope.videoPage=false;
   $scope.openVido = function (cont) {

    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/vidio.html',
      controller: 'vidoCtrl',
      scope: $scope,
      size:'800px',
      resolve: {
        items: function () {
           return cont;
        }
      }
    });


  }


	$scope.hideVideo=function(cont){
		$uibModalInstance.dismiss('cancel');
	}
    $scope.file={};
    $scope.fileType='';
    $scope.file_url='';
    $scope.filedata='';
    $scope.vodio_url='';
    $scope.sendname='';
    $scope.filemessageChanged = function (ele) {

      $scope.conversation='';
     if($scope.manChat.manchatContent&&$scope.manChat.manchatContent.length !=0){
      	 angular.forEach($scope.manChat.manchatContent,function(item,index){
      	   if(item.name=='HR'){
      	   	$scope.conversation=item.conversationName;
      	   }
        })
      }

       var f = new FormData();
       var _file = document.querySelector('#filebtn').files[0];
       var fileName='';
        fileName=_file.name;
        console.log(_file.name);
        f.append('file', _file);
        f.append('conversation', $scope.conversation);
        f.append('type', "HR2EID");
		if(fileName!=''){
			internetService.uploadFileMessage(f).then(function(respones){
	           var data=respones.data;
	           console.log(">>>>>",data)
	           if(data.status==true){
	           	$scope.fileType=data.type;
	            if($scope.fileType=='image'){
	          		$scope.file_url=data.img_url;
	          	}
	            if($scope.fileType=='file'){
	           		$scope.filedata=data.data;

	            }
	            if($scope.fileType=='vodio'){
	           		$scope.vodio_url=data.vodio_url;
	           	}
	            $('#filebtn').val('');
	            $scope.sendname=data.name;
	          	 $scope.sendChat();
	           }

          })
		}

    }

   //结束
  //回复留言
  $scope.replySave = function () {
    var data = {
      eid: $scope.replay.eid,
      reply_text: $scope.replay.replayMsg,
      hr_name: $scope.user.userName,
      id: $scope.replay.replyId,
      reply_type: "WEB"
    }
    internetService.replyMessageBoard(data).then(function (response) {
      if(response.status == 200) {
        $rootScope.$emit('CloseNewinfoDetail', {});
        $scope.messagePageInfo();
        $scope.messageBoardReplyRate();
        toaster.pop('success', 'Success', response.data.result);

      }
    }, function (response) {
      if(response.status == 400) {
        toaster.pop('warning', 'Warning', response.data.result);
      }else {
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      }
    });
  }

  //显示留言回复率相关信息

  $scope.messageBoardReplyRate = function () {

    internetService.messageBoardReplyRate().then(function (response) {
      $scope.replay.replyRoat = response.data;
     storage.setObject('changeobj',response.data);

    })
  }
  $scope.changeobj= storage.getObject('changeobj');
  console.log('$scope.changeobj',$scope.changeobj);
  //留言准时回复率
  $scope.messageBoardOntimeRate = function () {
    var data = {
      day: 1
    }
    internetService.messageBoardOntimeRate(data).then(function (response) {
      $scope.replay.ontimeRate = response.data.replyRate;
    })
  }

  //open contact list
  $scope.contactList = {
    contactRencentDatas: [],
    contactShowDatas: [],
    contactText: null,
  }
  $scope.openContactModel = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/contact_list.html',
      controller: 'ContactListCtrl',
      backdropClass:'modalBackdrop',
      backdrop: 'static',
      windowClass: 'windowClassModel',
      scope: $scope,
      size: 'mg',
      resolve: {
        items: function () {

        }
      }
    });
    angular.element('#jqContextMenu').hide();
    $scope.contactRecent();
    angular.element('#contactList').mCustomScrollbar();
  }
  //Contact rencent
  $scope.contactRecent = function () {
    internetService.contactRecent().then(function (response) {
      if(response.status == 200) {
        $scope.contactList.contactRencentDatas = response.data.result;
        $scope.contactList.contactShowDatas = response.data.result;
      }
    })
  }
  //contact search
  $scope.contactSearch = function () {
    internetService.contactSearch($scope.contactList.contactText).then(function (response) {
      if(response.status == 200) {
        $scope.contactList.contactRencentDatas = response.data.result;
        if($scope.contactList.contactRencentDatas.length < 1) {
          toaster.pop('warning', 'Warning', 'No Data!');
        }
      }
    })
  }
  $scope.contactSearchKeyup = function (event) {
    if(event.keyCode == 13 && $scope.contactList.contactText){
      $scope.contactSearch();
    }
  }
  $scope.contactChangeInput = function (data) {
    if(data == "" || data == undefined) {
      $scope.contactList.contactRencentDatas = $scope.contactList.contactShowDatas;
    }
  }
  //add conversation
  $scope.conversationAdd = function (eid) {
    var data = {
      eid: eid,
      hr_name: $scope.user.userName
    }
    internetService.conversationAdd(data).then(function (response) {
      debugger
    }, function (response) {
      if(response.status == 400) {
        toaster.pop('warning', 'Warning', response.data.detail);
      }else {
        toaster.pop('error', 'Error', 'Network error. Please try again later!');
      }
    });
  }


  //Xiao Qiao's work efficiency
  $scope.workAnalysis = function () {
    internetService.workAnalysis().then(function (response) {
      $scope.workAnalysisData = response.data.result;
    })
  }
  $scope.workAnalysis();


  //broadcast model
  $scope.broadcast = {
    selectGroup: [],
    message: null,
    multiselectSetting: {
        displayProp: 'name',
        scrollable: true,
        scrollableHeight: '150px',
        smartButtonMaxItems: 5,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }
  }
  $scope.openBroadcastModel = function () {
    $scope.searchContatGroupData();
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/broadcast.html',
      controller: 'BroadcastCtrl',
      scope: $scope,
      size: 'mg',
      resolve: {
        items: function () {

        }
      }
    });

    angular.element('#jqContextMenu').hide();
  }

  $scope.broadcastSave = function () {
      var selectGroup = $scope.broadcast.selectGroup;
      var ids = []
      for (var idx in selectGroup) {
          ids.push(selectGroup[idx].id)
      }
      var data = {
          ids: ids,
          text: $scope.broadcast.message
      }
      internetService.converGroupBroadcast(data).then(function (response) {
          toaster.pop('success', 'Success', 'Broadcast successful.!');
      }, function (error) {
          toaster.pop('error', 'Error', error.data.detail);
      })
  }

  //on line
  $scope.onLine = function () {
    var data = {
      'eid': $scope.user.userName
    }
    internetService.canclehostedStatus(data).then(function (response) {
      if(response.status == 200) {
        $scope.user.status = false;
        storage.setObject('user', $scope.user);
      }
    }, function (response) {
      toaster.pop('error', 'Error', 'Network error. Please try again later!');
    })
  }
  // on busy
  $scope.onLineBusy = function() {
    var data = {
      'eid': $scope.user.userName
    }
    internetService.setHostedStatus(data).then(function(response) {
      if(response.status == 200) {
        $scope.user.status = true;
        storage.setObject('user', $scope.user);
      }
    }, function(response) {
      toaster.pop('error', 'Error', 'Network error. Please try again later!');
    })
  }

  //online list
  $scope.getOnlineHrsInfo = function($mdMenu, ev) {
    $mdMenu.open(ev);
    internetService.getOnlineHrsInfo().then(function(response) {
      if(response.status == 200) {
        $scope.onlineListData = [];
        angular.forEach(response.data, function (item) {
          if(item.eid != $scope.user.userName) {
            $scope.onlineListData.push(item);
          }
        })
      }
    }, function(response) {
      toaster.pop('error', 'Error', 'Network error. Please try again later!');
    });
  }

  //search input add style
  $scope.searchFocus = function () {
    angular.element('.contact_out').addClass('search-active');
  }
  $scope.searchBlur = function () {
    angular.element('.contact_out').removeClass('search-active');
  }

  //Desktop reminding
 // myWebsocket.noticeFun('title', 'Hello!');


})
.controller('StatisticsCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  angular.element(document).ready(function() {
    laydate.render({
      elem: '#exportMonth',
      max: $scope.month,
      lang: 'en',
      range: '~'
    })
  });

})
.controller('detailChatCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('UploadCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    document.querySelector('#file').value = "";
    $scope.file.fileInfo = null;
    $scope.file.filetype = $scope.file.types[0];
  };
})
.controller('ConfigCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    document.querySelector('#file').value = "";
    $scope.file.fileInfo = null;
    $scope.file.filetype = $scope.file.types[0];
  };
})
.controller('AnswerDetailCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('NewinfoCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('NewinfoDetailCtrl', function ($scope, $uibModalInstance, $rootScope) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $rootScope.$on('CloseNewinfoDetail', function () {
    $scope.cancel();
  });
})
.controller('ContactListCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('ContactGroupMemberCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('BroadcastCtrl', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('imgCtrl', function ($scope, $uibModalInstance, $rootScope, items) {
	$scope.img_url=items;

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


})
.controller('vidoCtrl', function ($scope, $uibModalInstance, $rootScope, items) {
	var cont=items;
	console.log(">>",cont)
  $scope.ok = function () {
    $uibModalInstance.close();
  };
  $scope.showBtn = false;
  setTimeout(function(){
    	cont.showpage=true;
	   	$scope.videoButton=true;
	   	$scope.videoPage=true;
	   	$scope.showBtn=true;
		var videoPath = cont.text;
		var flashvars={
	      		 f:videoPath,
	      		 c:0,
	      		 p:1,
	      		 loaded:'loadedHandler'
	   		 };
	   	var video=[''+cont.text+'->video/'];
	   		CKobject.embed('ckplayer/ckplayer.swf','a1','ckplayer_a1','598','425',true,flashvars,video);

    },1000);
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $rootScope.$on('CloseNewinfoDetail', function () {
    $scope.cancel();
  });
})
.controller('UpdateDataCtrl', function ($scope, $uibModalInstance, internetService, toaster) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  //update embedding adapter
  $scope.updateEmbeddingAdapter = function () {
    if(!$scope.config.update_question) {
      toaster.pop('warning', 'Warning', 'Question cannot be empty!');
      return;
    }
    if(!$scope.config.update_answer) {
      toaster.pop('warning', 'Warning', 'Wnswer cannot be empty!');
      return;
    }
    var update_data = [];
    var update = {
      'id': $scope.config.update_id,
      'question': $scope.config.update_question,
      'intent_name': $scope.config.update_answer
    }
    update_data.push(update);
    var data = {
      'eid': $scope.user.userName,
      'update_data': update_data
    }
    internetService.updateEmbeddingAdapter(data).then(function( response) {
      if(response.data.status == 200) {
        toaster.pop('success', 'Success', 'Update success!');
        $scope.queryEmbeddingAdapter();
        $scope.ok();
      } else {
        toaster.pop('warning', 'Warning', response.data.message);
      }
    }, function (response) {
      toaster.pop('error', 'Error', 'Network error!');
    })
  }
  //关键字更新
  $scope.updateconversationKeyword=function(){
  	 if(!$scope.config.update_conversationMsg) {
      toaster.pop('warning', 'Warning', 'text cannot be empty!');
      return;
    }
    if(!$scope.config.update_conversationkeyword) {
      toaster.pop('warning', 'Warning', 'keyword cannot be empty!');
      return;
    }

    var data = {
        "pk":$scope.config.update_conversation_id,
		"text":$scope.config.update_conversationMsg,
		"keyword":$scope.config.update_conversationkeyword,
		"is_used":true
    }
    internetService.admin_keyword_update(data).then(function( response) {
      if(response.data.result == 'successful operation') {
        toaster.pop('success', 'Success', 'Update success!');
        $scope.hr_admin_keyword_getpage();
        $scope.ok();
      } else {
        toaster.pop('warning', 'Warning', response.data.message);
      }
    }, function (response) {
      toaster.pop('error', 'Error', 'Network error!');
    })
  }
  // auto reply add
  $scope.addAutoReply = function () {
    if(!$scope.config.auto_question) {
      toaster.pop('warning', 'Warning', 'Question cannot be empty!');
      return;
    }
    if(!$scope.config.auto_answer) {
      toaster.pop('warning', 'Warning', 'Wnswer cannot be empty!');
      return;
    }
    var reply_data = [];
    var reply = {
      'question': $scope.config.auto_question,
      'answer': $scope.config.auto_answer,
      'question_type': $scope.config.auto_type
    }
    reply_data.push(reply);
    var data = {
      'eid': $scope.user.userName,
      'reply_data': reply_data
    }
    internetService.addAutoReply(data).then(function (response) {
      if(response.data.status == 200) {
        toaster.pop('success', 'Success', 'Add success!');
        $scope.getAutoReply();
        $scope.ok();
      } else {
        toaster.pop('warning', 'Warning', response.data.message);
        return false;
      }
    }, function (response) {
      toaster.pop('error', 'Error', 'Network error. Please try again later!');
    })
  }
  //update auto reply
  $scope.updateAutoReply = function () {
    if(!$scope.config.auto_question) {
      toaster.pop('warning', 'Warning', 'Question cannot be empty!');
      return;
    }
    if(!$scope.config.auto_answer) {
      toaster.pop('warning', 'Warning', 'Wnswer cannot be empty!');
      return;
    }
    var update_data = [];
    var update = {
      'id': $scope.config.auto_id,
      'question': $scope.config.auto_question,
      'answer': $scope.config.auto_answer,
      'question_type': $scope.config.auto_type
    }
    update_data.push(update);
    var data = {
      'eid': $scope.user.userName,
      'update_data': update_data
    }
    internetService.updateAutoReply(data).then(function (response) {
      if(response.data.status == 200) {
        toaster.pop('success', 'Success', 'Update success!');
        $scope.getAutoReply();
        $scope.ok();
      } else {
        toaster.pop('warning', 'Warning', response.data.message);
      }
    }, function (response) {
      toaster.pop('error', 'Error', 'Network error!');
    })
  }

  //add relation question
  $scope.addRelationQuestion = function () {
    if(!$scope.config.add_relation_intentName) {
      toaster.pop('warning', 'Warning', 'Intent name cannot be empty!');
      return;
    }
    if(!$scope.config.add_relation_action) {
      toaster.pop('warning', 'Warning', 'Action cannot be empty!');
      return;
    }
    if(!$scope.config.add_relation_question) {
      toaster.pop('warning', 'Warning', 'Question cannot be empty!');
      return;
    }
    var data = {
      'lang': $scope.config.add_relation_language,
      'intent': $scope.config.add_relation_intentName,
      'action': $scope.config.add_relation_action,
      'question': $scope.config.add_relation_question,
      'operator': $scope.user.userName
    }
    internetService.addRelationQuestion(data).then(function(response) {
      if(response.status == 200) {
        toaster.pop('success', 'Success', 'Add success!');
        $scope.queryRelationQuestion();
        $scope.ok();
      }
    }, function(response) {
      toaster.pop('error', 'Error', 'Network error. Please try again later!');
    })
  }

  //update relation question
  $scope.updateRelationQuestion = function() {
    if(!$scope.config.add_relation_intentName) {
      toaster.pop('warning', 'Warning', 'Intent name cannot be empty!');
      return;
    }
    if(!$scope.config.add_relation_action) {
      toaster.pop('warning', 'Warning', 'Action cannot be empty!');
      return;
    }
    if(!$scope.config.add_relation_question) {
      toaster.pop('warning', 'Warning', 'Question cannot be empty!');
      return;
    }
    var data = {
      'id': $scope.config.add_relation_id,
      'lang': $scope.config.add_relation_language,
      'intent': $scope.config.add_relation_intentName,
      'action': $scope.config.add_relation_action,
      'question': $scope.config.add_relation_question,
      'operator': $scope.user.userName
    }
    internetService.updateRelationQuestion(data).then(function(response) {
      if(response.status == 200) {
        toaster.pop('success', 'Success', 'Update success!');
        $scope.queryRelationQuestion();
        $scope.ok();
      }
    }, function(response) {
      toaster.pop('error', 'Error', 'Network error. Please try again later!');
    })
  }
  //update FAQ
  $scope.updateFAQSData = function () {
    if(!$scope.config.faqs_quest) {
       toaster.pop('warning', 'Warning', 'Question cannot be empty!');
      return false;
    }
    var data = {
      'id': $scope.config.faqs_id,
      'greeting': $scope.config.faqs_quest,
      'operator': $scope.user.userName,
      'lang': $scope.config.faqs_language
    }
    internetService.updateGreeting(data).then(function(response) {
      if(response.status == 200) {
        toaster.pop('success', 'Success', "Update success!");
        $scope.queryDoGreeting();
        $scope.ok();
      }
    }, function (response) {
      $scope.toaster.text = 'Netw.ork error. Please try again later!';
      toaster.pop('error', 'Error', $scope.toaster.text);
    });
  }

  //add takeover words
  $scope.addTakeoverWords = function () {
    if(!$scope.config.takeover_type) {
      toaster.pop('warning', 'Warning', 'Type cannot be empty!');
      return;
    }
    if(!$scope.config.takeover_text) {
      toaster.pop('warning', 'Warning', 'Text cannot be empty!');
      return;
    }
    var data = {
      'eid': $scope.user.userName,
      'text': $scope.config.takeover_text,
      'type': $scope.config.takeover_type
    }
    internetService.addSensword(data).then(function(response) {
      if(response.data.status == 200) {
        toaster.pop('success', 'Success', 'Add success!');
        $scope.config.takeover_type = '';
        $scope.queryTakeoverWords();
        $scope.ok();
      } else {
        toaster.pop('warning', 'Warning', response.data.message);
      }
    }, function(response) {
      toaster.pop('error', 'Error', 'Network error. Please try again later!');
    })
  }
  //update takeover words
  $scope.updateTakeoverWords = function () {
    if(!$scope.config.takeover_type) {
      toaster.pop('warning', 'Warning', 'Type cannot be empty!');
      return;
    }
    if(!$scope.config.takeover_text) {
      toaster.pop('warning', 'Warning', 'Text cannot be empty!');
      return;
    }
    var data = {
      'id': $scope.config.takeover_id,
      'text': $scope.config.takeover_text,
      'type': $scope.config.takeover_type,
      'eid': $scope.user.userName
    }
    internetService.updateSensword(data).then(function(response) {
      if(response.data.status == 200) {
        toaster.pop('success', 'Success', "Update success!");
        $scope.config.takeover_text = '';
        $scope.config.takeover_type = '';
        $scope.queryTakeoverWords();
        $scope.ok();
      } else {
        toaster.pop('warning', 'Warning', response.data.message);
      }
    }, function (response) {
      $scope.toaster.text = 'Netw.ork error. Please try again later!';
      toaster.pop('error', 'Error', $scope.toaster.text);
    });
  }
});
