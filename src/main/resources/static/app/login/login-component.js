'use strict';

define([
    'login/login.module',
    'text!login/login-template.html',
    'css!login/login.css',
    'login/login-service'
], function (loginModule, LoginTemplate) {
    loginModule.component('loginForm', {
        template: LoginTemplate,
        controller: ['$state', 'LoginService', '$interval', '$timeout', function ($state, loginService, $interval, $timeout) {
            var ctrl = this;

            ctrl.user = {
                email: 'admin@gmail.com',
                password: 'admin',
                rememberMe: true
            };

            ctrl.isLoginError = false;
            ctrl.doLogin = function ($event) {
                $('.login').addClass('test');

                $timeout(function () {
                    $('.login').addClass('testtwo');
                }, 300);
                $timeout(function () {
                    $('.authent').show().animate({right: -320}, 600);
                    $('.authent').animate({opacity: 1}, 200).addClass('visible');
                }, 300);
                $timeout(function () {
                    $('.authent').show().animate({right: 90}, 600);
                    $('.authent').animate({opacity: 0}, 200).addClass('visible');
                    $('.login').removeClass('testtwo');
                }, 2500);

                $timeout(function () {
                    loginService.doLogin().then(function (users) {
                        for (var i = 0, length = users.length; i < length; i++) {
                            if (ctrl.user.email === users[i].email && ctrl.user.password === users[i].password) {
                                loginService.isAuth = true;
                                $state.go('workspace');
                                return;
                            }
                        }
                        ctrl.isLoginError = true;
                    });
                }, 1000);
            };

            ctrl.toLogin = function ($event) {
                $("#loginForm").show();
                $("#registerForm").hide();
            };

            ctrl.toRegister = function ($event) {
                $("#loginForm").hide();
                $("#registerForm").show();
            };

            ctrl.onInputFocus = function ($event) {
                $($event.target).prev().animate({'opacity': '1'}, 200);
            };

            ctrl.onInputBlur = function ($event) {
                $($event.target).prev().animate({'opacity': '.5'}, 200);
            };

            ctrl.onInputKeyup = function ($event) {
                if (!$($event.target).val()) {
                    $($event.target).next().animate({
                        'opacity': '1',
                        'right': '30'
                    }, 200);
                } else {
                    $($event.target).next().animate({
                        'opacity': '0',
                        'right': '20'
                    }, 200);
                }
            };
        }]
    });


});
