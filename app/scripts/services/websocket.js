﻿'use strict';

/**
 * @ngdoc function
 * @name hrchatbotAdminApp.factory:myWebsocket
 * @description
 * # MainCtrl
 * Controller of the hrchatbotAdminApp
 */

angular.module('hrchatbotAdminApp')
	.factory('myWebsocket', function($websocket, storage, $http, $state, $interval, CHATBOT_CONSTANTS) {

		function mywebscoket() {
			this.newMessage = {};
			this.mywebsocket = null;
			this.manRecords = {}; //人
			this.robotRecords = {}; //机器
			this.inform_robot = [];//robot info
			this.inform_man = []; //man info
			this.socketStatus = true; //网络连接状态
			var inter = null;
			var self = this;
			this.human_log_out = false;
			this.isConnected = false;
			var isMin = false;
			var openFlag = false;
			self.tanchuang = function() {
				inter = setTimeout(function() {
					if(!self.socketStatus) {
						$('.socket-line').html('The network connection has been disconnected, and the connection is being reconnected...');
						$('.socket-line').fadeIn("fast");
						var user = JSON.parse(storage.get('user'));
						self.openWebSocket(user.userName);
						$('.socket-line').fadeOut(2000);
					}
				}, 5000);
			}
			this.openWebSocket = function(eid) {
				//if websocket has been connected
				if(self.isConnected)
					return;
				var dataStream = $websocket(CHATBOT_CONSTANTS.WS_BASE_URL + '/app/echo?eid=' + eid);
				dataStream.socket.onopen = function(evnt) {
					self.socketStatus = true;
					self.isConnected = true;
					self.human_log_out = false;
					console.log("Webscoket opened." + self.socketStatus);
					$('.socket-line').html('');
				};
				dataStream.socket.onmessage = function(evnt) {
					self.onMessage(evnt);
				};
				dataStream.socket.onclose = function(evnt) {
					self.isConnected = false;
					self.socketStatus = false;

					console.log("Webscoket closed." + self.socketStatus);
					if(!self.human_log_out && !self.isConnected) {
						self.tanchuang();
					} else {
						storage.remove('user');
						storage.remove('token');
						storage.remove('manRecords');
						storage.remove('robotRecords');
						$http.defaults.headers.common["Authorization"] = undefined;
						//clearInterval(inter);
					}

					//$state.go('login');
				};
				dataStream.socket.onerror = function(evnt) {
					self.isConnected = false;
					console.log("Webscoket Error.");
					self.socketStatus = false;
					if(!self.human_log_out && !self.isConnected) {
						//tanchuang();
					} else {
						//clearInterval(inter);
					}

				};
				self.mywebsocket = dataStream;
				//self.isConnected = true;
			}

			this.closeWebSocket = function() {
				if(self.mywebsocket != null) {
					self.mywebsocket.close();
				}
			}

			this.onMessage = function(evnt) {
				var message = JSON.parse(evnt.data);
				//机器人
				if(message.type == 'inform'){
					self.isMinStatus();
					self.ishiddenfun();
					if(isMin == true || openFlag == true) {
						this.noticeFun('System message', message.content.text);
					}
					return false;
				}
				//robot
				if(message.type == 'inform-bot'){
					self.isMinStatus();
					self.ishiddenfun();
					var isExs = false;
					if(!jQuery.isEmptyObject(storage.getObject('inform-bot'))) {
						self.inform_robot = storage.getObject('inform-bot');
						if(self.inform_robot.length > 0) {
							angular.forEach(self.inform_robot, function (item, i) {
								if(message.content.conversation_name == item.conversation_name) {
									isExs = true;
									return false;
								}
							});
						}
					}
					if(!isExs) {
						self.inform_robot.push(message.content);
					}
					storage.setObject('inform-bot', self.inform_robot);
					if(isMin == true || openFlag == true) {
						this.noticeFun('System message', message.content.text);
					}
					return false;
				}
				//hr
				if(message.type == 'inform-hr'){
					self.isMinStatus();
					self.ishiddenfun();
					var isExs = false;
					if(!jQuery.isEmptyObject(storage.getObject('inform-hr'))) {
						self.inform_man = storage.getObject('inform-hr');
						if(self.inform_man.length > 0) {
							angular.forEach(self.inform_man, function (item, i) {
								if(message.content.conversation_name == item.conversation_name) {
									isExs = true;
									return false;
								}
							});
						}
					}
					if(!isExs) {
						self.inform_man.push(message.content);
					}
					storage.setObject('inform-hr', self.inform_man);
					if(isMin == true || openFlag == true) {
						this.noticeFun('System message', message.content.text);
					}
					return false;
				}
				var storeRobotRecords = storage.getObject('robotRecords');
				if(storeRobotRecords != null && storeRobotRecords != undefined && !jQuery.isEmptyObject(storeRobotRecords)) {
					var conversations_robot_new = {}
					angular.forEach(message.content.conversations_robot, function(item, index) {
						item.readMsgs = [];
						conversations_robot_new[item.name] = item;
						if(storeRobotRecords[item.name] != null && storeRobotRecords[item.name] != undefined) {
							item.readMsgs = storeRobotRecords[item.name].readMsgs;
							self.robotRecords[item.name] = item;
						} else {
							self.robotRecords[item.name] = item;
						}
					});

					angular.forEach(self.robotRecords, function(value, index) {
						var conversation = conversations_robot_new[index];
						if(conversation == null || conversation == undefined) {
							delete self.robotRecords[index];
						}
					});
				
					storage.setObject('robotRecords', this.robotRecords);

				} else {
					angular.forEach(message.content.conversations_robot, function(item, index) {
						item.readMsgs = [];
						self.robotRecords[item.name] = item;
					})
				} 
				//console.log(message);
				
				storage.setObject('robotRecords', this.robotRecords);

				//人工
				var storeManRecords = storage.getObject('manRecords');
				if(storeManRecords != null && storeManRecords != undefined && !jQuery.isEmptyObject(storeManRecords)) {
					var conversations_hr_new = {}
					angular.forEach(message.content.conversations_hr, function(item, index) {
						item.readMsgs = [];
						conversations_hr_new[item.name] = item;
						if(storeManRecords[item.name] != null && storeManRecords[item.name] != undefined) {
							item.readMsgs = storeManRecords[item.name].readMsgs;
							self.manRecords[item.name] = item;
						} else {
							self.manRecords[item.name] = item;
						}
					})
					angular.forEach(self.manRecords, function(value, index) {
						var conversation = conversations_hr_new[index];
						if(conversation == null || conversation == undefined) {
							delete self.manRecords[index];
						}
					});

				} else {
					angular.forEach(message.content.conversations_hr, function(item, index) {
						item.readMsgs = [];
						self.manRecords[item.name] = item;
					})
				}
				//
				// if(storeManRecords != null && storeManRecords != undefined && !jQuery.isEmptyObject(storeManRecords)){
					
				
				// let obj_storeManRecords = storeManRecords;

				// let last_storeManRecords = Object.keys(obj_storeManRecords).filter((cur, index, arr) => {
				// 	return index === (arr.length - 1)
				// })[0]
				
				// let obj = this.manRecords

				// let last_obj = Object.keys(obj).filter((cur, index, arr) => {
				// 	return index === (arr.length - 1)
				// })[0]
				// if(!jQuery.isEmptyObject(obj) && !jQuery.isEmptyObject(obj_storeManRecords) && obj_storeManRecords[last_storeManRecords].messages.length != obj[last_obj].messages.length) {
				// 	self.isMinStatus();
				// 	self.ishiddenfun();
				// 	var toticemessage = '';
				// 	var notice_arr = [];
				// 	if(isMin == true && !jQuery.isEmptyObject(this.manRecords)  ||  openFlag == true && !jQuery.isEmptyObject(this.manRecords)) {
				// 		let obj = this.manRecords

				// 		let lastIndex = Object.keys(obj).filter((cur, index, arr) => {
				// 			return index === (arr.length - 1)
				// 		})[0]
						
				// 		notice_arr = obj[lastIndex].messages;
				// 		if(notice_arr.length != 0) {
				// 			notice_arr = notice_arr[notice_arr.length - 1];
				// 			toticemessage = notice_arr.text;
				// 			if(toticemessage!=undefined){
				// 				self.noticeFun('You have a new message', toticemessage);
				// 			}
							
				// 		}
				// 	}
				// }
				// }
				//

				storage.setObject('manRecords', this.manRecords);
			};
			//桌面提醒
			this.noticeFun = function(title, msg) {
				var Notification = window.Notification || window.mozNotification || window.webkitNotification;
				if(Notification) {
					Notification.requestPermission(function(status) {
						if(status != "granted") {
							return;
						} else {
							var tag = "sds" + Math.random();
							Notification.body = msg;
							//notifyObj属于Notification构造方法的实例对象  
							var notifyObj = new Notification(
								title, {
									dir: 'auto',
									lang: 'zh-CN',
									tag: tag, //实例化的notification的id  
									icon: 'images/xiaoqiao.png', //icon的值显示通知图片的URL  
									body: msg
								}
							);
							notifyObj.onclick = function() {
									//如果通知消息被点击,通知窗口将被激活  
									window.focus();

								},
								notifyObj.onerror = function() {
									console.log("HTML5 message error！！！");
								};
							notifyObj.onshow = function() {
								setTimeout(function() {
									notifyObj.close();
								}, 5000)
							};
							notifyObj.onclose = function() {

							};
						}
					});
				} else {
					console.log("您的浏览器不支持桌面消息!");
				}
			}
			this.ishiddenfun = function() {
				// 各种浏览器兼容

				var hidden, state, visibilityChange;
				if(typeof document.hidden !== "undefined") {
					hidden = "hidden";
					visibilityChange = "visibilitychange";
					state = "visibilityState";
				} else if(typeof document.mozHidden !== "undefined") {
					hidden = "mozHidden";
					visibilityChange = "mozvisibilitychange";
					state = "mozVisibilityState";
				} else if(typeof document.msHidden !== "undefined") {
					hidden = "msHidden";
					visibilityChange = "msvisibilitychange";
					state = "msVisibilityState";
				} else if(typeof document.webkitHidden !== "undefined") {
					hidden = "webkitHidden";
					visibilityChange = "webkitvisibilitychange";
					state = "webkitVisibilityState";
				}

				// 添加监听器，在title里显示状态变化
				document.addEventListener(visibilityChange, function() {
					if(document[state] == 'hidden') {
						openFlag = true;
					}else{
						openFlag = false;
					};
				}, false);
				return openFlag;
			}
			this.isMinStatus = function() {

				if(window.outerWidth != undefined) {
					isMin = window.outerWidth <= 600 && window.outerHeight <= 700;
				} else {
					isMin = window.screenTop < -30000 && window.screenLeft < -30000;
				}
				return isMin;
			}
			//end

			this.sendMessage = function(message) {
				this.mywebsocket.send(JSON.stringify(message));
			}

		}

		return new mywebscoket();
	})