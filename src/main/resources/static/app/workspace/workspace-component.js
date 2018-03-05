'use strict';

define([
    'workspace/workspace.module',
    'text!workspace/workspace-template.html',
    'workspace/workspace-directive',
    'workspace/left-nav/leftnav-component',
    'workspace/top-nav/topnav-component',
    'workspace/footer-info/footer-info-component'
], function (workspaceModule, workspaceTemplate) {
    workspaceModule.component('workspace', {
        template: workspaceTemplate,
        controller: function () {
        }
    });
});