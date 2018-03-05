'use strict';

define([
    'app.routers',
    'workspace/workspace.routers',
    'login/login.module',
    'login/login-service'
], function (appRouters, workspaceRouters) {
    //配置路由规则
    function configRouter(ngModule, routersConfig) {
        ngModule.config(['$stateProvider', '$locationProvider', '$ocLazyLoadProvider', function ($stateProvider, $locationProvider, $ocLazyLoadProvider) {
            //去除浏览器url地址中的!
            $locationProvider.hashPrefix('');
            $ocLazyLoadProvider.config({
                'debug': true, // For debugging 'true/false'
                'events': true // For Event 'true/false'
            });
            for (var i = 0; i < routersConfig.length; i++) {
                $stateProvider.state(routersConfig[i]);
            }
        }]);
    }

    //根模块
    var rootModule = angular.module('AdminRootModule', ['ui.router', 'oc.lazyLoad', 'login.module']);
    configRouter(rootModule, appRouters);
    configRouter(rootModule, workspaceRouters);
    rootModule.run(['$transitions', '$ocLazyLoad', function ($transitions, $ocLazyLoad) {
        $transitions.onStart({}, function (trans) {
            var auth = trans.injector().get('LoginService');
            if (trans.$to().authenticate && !auth.isAuth) {
                return trans.router.stateService.target('login');
            }
        });
    }]);

    return rootModule;
});
