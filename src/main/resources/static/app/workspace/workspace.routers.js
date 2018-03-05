'use strict';
define([], function () {
    //工作空间路由定义
    return [{
        parent: 'workspace',
        name: 'user',
        url: '/user',
        component: 'userTable',
        authenticate: true,
        resolve: {
            lazyload: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    files: ['user/user-table/user-table-component'],
                    cache: false
                }).then(function () {
                    $ocLazyLoad.inject('workspace.module');
                });
            }]
        }
    }];
});
