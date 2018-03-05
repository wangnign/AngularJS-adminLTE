'use strict';
define([], function () {
    var workspaceModule = angular.module('workspace.module', ['ngAnimate']);

    workspaceModule.config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self']);
    });

    return workspaceModule;
});
