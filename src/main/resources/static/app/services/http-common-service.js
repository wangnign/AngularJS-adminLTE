'use strict';

define([
    'workspace/workspace.module'
], function (workspaceModule) {
    // 这里不要注入 $scope，否则会报错: [$injector:unpr] Unknown provider: $scopeProvider <- $scope <- httpCommonService
    workspaceModule.service('httpCommonService', ['$http', function ($http) {
        // GET 请求
        var doGet = function (url, params, timeout) {
            var req = {
                method: 'GET',
                url: url,
                cache: false,
                params: params,
                timeout: timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            return $http(req).then(
                function (response) {
                    //  console.log("success: " + JSON.stringify(response));
                    return response.data;
                },
                function (response) {
                    console.error("error: " + JSON.stringify(response));
                    return {
                        success: false,
                        data: null,
                        errmsg: "请求服务端数据时出错"
                    };
                });
        };
        // POST 请求
        var doPost = function (url, data, timeout) {
            var req = {
                method: 'POST',
                url: url,
                data: data,
                cache: false,
                timeout: timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(req).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    console.error("error: " + (!!response ? JSON.stringify(response) : null));
                    return {
                        success: false,
                        data: null,
                        errmsg: "请求服务端数据时出错"
                    };
                });
        };

        return {
            // Http Get 请求
            doGet: function (url, timeout) {
                return doGet(url, null, timeout);
            },
            // Http Post 请求
            doPost: function (url, data, timeout) {
                return doPost(url, data, timeout);
            },

            // 带参数的GET请求，前面的方法名称可能取的不够优雅，现在都改过来了
            doGetWithParam: function (url, param, timeout) {
                return doGet(url, param, timeout);
            }
        };
    }]);
});
