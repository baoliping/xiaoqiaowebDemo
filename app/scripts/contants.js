'use strict';

angular.module('hrchatbotAdminApp').constant("CHATBOT_CONSTANTS" , {
    CACHE_REPO_NAME: "cacheRepo",
    BASE_URL: "http://127.0.0.1:8070",
    WS_BASE_URL: "ws://127.0.0.1:8070",
}).constant("CHATBOT_URLS", {
    PAGE_FUN: {
        GET_PAGE_FUN: "/app/pagefun/getAll"
    },
    MESSAGE_TRYPE:{
    	MESSAGE: "message",
    	INFORM: "inform"
    },
    DOWNLOAD_PATH: "http://127.0.0.1:8070/app/file/download_nginx",
    CHATBOT_LETTER_URL: "http://127.0.0.1:8070/letter/",
})
