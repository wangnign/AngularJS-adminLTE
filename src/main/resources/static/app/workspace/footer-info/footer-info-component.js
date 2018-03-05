'use strict';

define([
    'workspace/workspace.module',
    'text!workspace/footer-info/footer-info-template.html',
    'css!workspace/footer-info/footer-info.css'
], function (workspaceModule, footerInfoTemplate) {
    workspaceModule.component('footerInfo', {
        template: footerInfoTemplate,
        controller: function () {

        }
    });
});
