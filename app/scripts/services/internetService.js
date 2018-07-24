'use strict';

/**
 * @ngdoc function
 * @name hrchatbotAdminApp.factory:internetService
 * @description
 * # internetService
 * factory of the hrchatbotAdminApp
 */
angular.module('hrchatbotAdminApp')
  .factory('internetService', function ($http, CHATBOT_CONSTANTS, CHATBOT_URLS, CacheFactory) {
    var inter = CHATBOT_CONSTANTS.BASE_URL;
    return {
      login: function (data) {
        return $http({
          url: inter + '/app/login',
          method: "post",
          headers: { 'Content-Type': undefined },
          data: JSON.stringify(data)
        })
      },
      logout: function (data) {
        return $http({
          url: inter + '/app/logout',
          method: "post",
          headers: { 'Content-Type': undefined },
          data: JSON.stringify(data)
        })
      },
      exoprt: function (data) {
        return $http({
          url: inter + '/app/messagerecord',
          method: "post",
          responseType: 'arraybuffer',
          data: data
        })
      },
      statistics: function () {
        return $http({
          url: inter + '/app/statistics',
          method: "get",
          headers: {'Content-type':undefined}
        })
      },
      analysis: function () {
        return $http({
          url: inter + '/app/analysis',
          method: "get",
          cache: CacheFactory.get(CHATBOT_CONSTANTS.CACHE_REPO_NAME),
          headers: {'Content-type':undefined}
        })
      },
      messages: function (data) {
        return $http({
          url: inter + '/app/messages?conversation_name='+ data,
          method: "get",
          headers: {'Content-type':undefined}
        })
      },
      switchtohr: function (data) {
        return $http({
          url: inter + '/app/switch-to-hr',
          method: "post",
          data: JSON.stringify(data),
          headers: {'Content-type':undefined}
        })
      },
      onlineList: function () {
        return $http({
          url: inter + '/app/onlinelist',
          method: "get",
          headers: {'Content-type':undefined}
        })
      },
      updatedb :function(data){
        return $http({
          url: inter + '/app/updatedb',
          method: "post",
          headers: {'Content-type':undefined},
          data: data
        })
      },
      getSpecifiedQuestions :function(data){
        return $http({
          url: inter + '/app/get_specified_questions',
          method: "post",
          headers: {'Content-type':undefined},
          data: JSON.stringify(data)
        })
      },
      qshrWorkload :function(data){
        return $http({
          url: inter + '/app/qs_hr_workload',
          method: "post",
          headers: {'Content-type':undefined},
          data: JSON.stringify(data)
        })
      },
      updateManualOffStatus :function(data){
        return $http({
          url: inter + '/app/update_manual_off_status?conversation_id=' + data,
          method: "get",
          headers: {'Content-type':'application/json'}
        })
      },
      session :function(data){
        return $http({
          url: inter + '/app/session?' + data,
          method: "get",
          headers: {'Content-type':'application/json'}
        })
      },
      doUserget :function(data){
        return $http({
          url: inter + '/app/do_user?' + data,
          method: "get",
          headers: {'Content-type':'application/json'}
        })
      },
      doUserpost :function(data){
        return $http({
          url: inter + '/app/do_user',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      updateUserPost :function(data){
        return $http({
          url: inter + '/app/update_user',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      updateUserDelete :function(data){
        return $http({
          url: inter + '/app/update_user?id=' + data,
          method: "get",
          headers: {'Content-type':'application/json'}
        })
      },
      doUnableQuestionSearch :function(data){
        return $http({
          url: inter + '/app/do_unable_question?' + data,
          method: "get",
          headers: {'Content-type':'application/json'}
        })
      },
      doUnableQuestionAdd :function(data){
        return $http({
          url: inter + '/app/do_unable_question',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      updateUnableQuestionUpdate :function(data){
        return $http({
          url: inter + '/app/update_unable_question',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      updateUnableQuestionDelete :function(data){
        return $http({
          url: inter + '/app/update_unable_question?id=' + data,
          method: "get",
          headers: {'Content-type':'application/json'}
        })
      },
      unableAnswerDetail :function(data){
        return $http({
          url: inter + '/app/get_unable_answerDetail',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      hr_admin_keyword_getpage:function(data){
      	return $http({
          url: inter + '/app/hr_admin_keyword_getpage' ,
          method: "post", 
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      keyWordsSearch :function(data){
        return $http({
          url: inter + '/app/get_key_words?' + data,
          method: "get", 
          headers: {'Content-type':'application/json'}
        })
      },
      admin_keyword_add:function(data){
      	return $http({
          url: inter + '/app/hr_admin_keyword_add',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      admin_keyword_delete:function(data){
        return $http({
          url: inter + '/app/hr_admin_keyword_deletes',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      addKeywords :function(data){
        return $http({
          url: inter + '/app/add_keywords',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      admin_keyword_update:function(data){
      	 return $http({
          url: inter + '/app/hr_admin_keyword_update',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: data
        })
      },
      updateKeywords :function(data){
        return $http({
          url: inter + '/app/update_key_words',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: data
        })
      },
      deleteKeywords :function(data){
        return $http({
          url: inter + '/app/delete_key_words',
          method: "post",
          headers: {'Content-type':'application/json'},
          data: JSON.stringify(data)
        })
      },
      getCategory  :function(){
        return $http({
          url: inter + '/app/category',
          method: "get", 
          headers: {'Content-type':'application/json'}
        })
      },
      messageBoardPage: function (data) {
        return $http ({
          url: inter + "/app/hr_message_board_page",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      messageDetail:function (data) {
        return $http ({
          url: inter + "/app/hr_message_board_detail",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      replyMessageBoard: function (data) {
        return $http ({
          url: inter + "/app/reply_message_board",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      messageBoardReplyRate: function () {
        return $http ({
          url: inter + "/app/hr_message_board_reply_rate",
          method: "post",
          headers: {'Content-type': 'application/json'}
        })
      },
      messageBoardOntimeRate: function (data) {
        return $http ({
          url: inter + "/app/hr_message_board_ontime_rate",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      workAnalysis: function () {
        return $http ({
          url: inter + "/app/work_analysis",
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      //contact list
      contactRecent: function () {
        return $http ({
          url: inter + "/app/contact/recent_contacts",
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      contactSearch: function (data) {
        return $http ({
          url: inter + "/app/contact/search?input_text=" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      conversationAdd: function (data) {
        return $http ({
          url: inter + "/app/conversation/add",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      //contact group
      converGroupAdd: function (data) {
        return $http ({
          url: inter + "/app/group/add",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      converGroupDelete: function (data) {
        return $http ({
          url: inter + "/app/group/delete",
          method: "delete",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      converGroupSearch: function () {
        return $http ({
          url: inter + "/app/group/search",
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      converGroupMembersAdd: function (data) {
        return $http ({
          url: inter + "/app/group/update_members",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      converGroupMemberDelete: function (data) {
        return $http ({
          url: inter + "/app/group/del_members",
          method: "delete",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      converGroupBroadcast: function (data) {
        return $http ({
          url: inter + "/app/group/broadcast",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      thumbDownList: function (data) {
        return $http ({
          url: inter + "/app/thumb_down_list?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      thumbDownContext: function (data) {
        return $http ({
          url: inter + "/app/thumb_down_context?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      //Embedding Adapter
      addEmbeddingAdapter: function (data) {
        return $http ({
          url: inter + "/app/add_embedding_adapter",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      queryEmbeddingAdapter: function (data) {
        return $http ({
          url: inter + "/app/query_embedding_adapter?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      updateEmbeddingAdapter: function (data) {
        return $http ({
          url: inter + "/app/update_embedding_adapter",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      deleteEmbeddingAdapter: function (data) {
        return $http ({
          url: inter + "/app/delete_embedding_adapter",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      //auto reply
      addAutoReply: function (data) {
        return $http ({
          url: inter + "/app/add_auto_reply",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      getAutoReply: function (data) {
        return $http ({
          url: inter + "/app/get_auto_reply?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      updateAutoReply: function (data) {
        return $http ({
          url: inter + "/app/update_auto_reply",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      deleteAutoReply: function (data) {
        return $http ({
          url: inter + "/app/delete_auto_reply",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },

      //FQAs
      addDoGreeting: function (data) {
        return $http ({
          url: inter + "/app/do_greeting",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      queryDoGreeting: function (data) {
        return $http ({
          url: inter + "/app/do_greeting?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      updateGreeting: function (data) {
        return $http ({
          url: inter + "/app/update_greeting",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      deleteGreeting: function (data) {
        return $http ({
          url: inter + "/app/update_greeting?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },

      //relation question
      addRelationQuestion: function (data) {
        return $http ({
          url: inter + "/app/do_relationquestion",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      queryRelationQuestion: function (data) {
        return $http ({
          url: inter + "/app/do_relationquestion?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      updateRelationQuestion: function (data) {
        return $http ({
          url: inter + "/app/update_relationquestion",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      deleteRelationQuestion: function (data) {
        return $http ({
          url: inter + "/app/update_relationquestion?" + data,
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },

      //on busy
      setHostedStatus: function (data) {
        return $http ({
          url: inter + "/app/set_hosted_status",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      //on line
      canclehostedStatus: function (data) {
        return $http ({
          url: inter + "/app/cancle_hosted_status",
          method: "post",
          headers: {'Content-type': 'application/json'},
          data: JSON.stringify(data)
        })
      },
      uploadFileMessage:function(data){
      	return $http ({
				url: inter + '/app/file/save_file',
				method: 'POST',
				headers: {'Content-Type': undefined},
				data:data
			})
      },
      //online list
      getOnlineHrsInfo: function () {
        return $http ({
          url: inter + "/app/get_online_hrs_info",
          method: "get",
          headers: {'Content-type': 'application/json'}
        })
      },
      mark_readMessage:function(data){
        return $http ({
          url: inter + '/app/mark_read',
          method: 'POST',
          headers: {'Content-Type': undefined},
          data:data
        })
		  },
	    getPageFun: function () {
          return $http({
              url: inter + CHATBOT_URLS.PAGE_FUN.GET_PAGE_FUN,
              method: "get",
              cache: CacheFactory.get(CHATBOT_CONSTANTS.CACHE_REPO_NAME),
              headers: { 'Content-Type': undefined },
              // data: JSON.stringify(data)
          })
        },

        //Sensitive words
        addSensword: function (data) {
          return $http ({
            url: inter + "/app/add_sensword",
            method: "post",
            headers: {'Content-type': 'application/json'},
            data: JSON.stringify(data)
          })
        },
        getallSenswords: function (data) {
          return $http ({
            url: inter + "/app/get_all_senswords?" + data,
            method: "get",
            headers: {'Content-type': 'application/json'}
          })
        },
        updateSensword: function (data) {
          return $http ({
            url: inter + "/app/update_sensword",
            method: "put",
            headers: {'Content-type': 'application/json'},
            data: JSON.stringify(data)
          })
        },
        deleteSensword: function (data) {
          return $http ({
            url: inter + "/app/del_sensword?" + data,
            method: "delete",
            headers: {'Content-type': 'application/json'}
          })
        },
      }
  })