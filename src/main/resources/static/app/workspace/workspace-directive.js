'use strict';

define([
    'workspace/workspace.module'
], function (workspaceModule) {

    // 高度自适应
    workspaceModule.directive('autoHeight', ['$window', function ($window) {
        return {
            restrict: 'AE',
            replace: true,

            link: function ($scope, element, attr) {

                var changeHeight = function () {
                    //Get window height and the wrapper height
                    var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
                    var window_height = $(window).height();
                    var sidebar_height = $(".sidebar").height();
                    //Set the min-height of the content and sidebar based on the
                    //the height of the document.
                    if (window_height >= sidebar_height) {
                        $(".content-wrapper").css('min-height', window_height - neg);
                    } else {
                        $(".content-wrapper").css('min-height', sidebar_height);
                    }
                };

                var windows = angular.element($window);
                windows.bind('resize', function () {
                    changeHeight();   // when window size gets changed
                });

                changeHeight(); // when page loads
            }
        };
    }]);

    // 定义指令
    workspaceModule.directive('monthlyTransReport', function () {
        // 格式化日期（'MM-dd'）
        var dateFormat = function (date) {
            if (!date) {
                return "01-01";
            }
            // 获取月份和当前月过去的天数
            var month = (date.getMonth() + 1) + '';
            var day = date.getDate() + '';

            if (month.length < 2) {
                month = '0' + month;
            }

            if (day.length < 2) {
                day = '0' + day;
            }

            // 返回 'MM-dd' 格式的日期
            return month + '-' + day;
        };

        // 获取每月中的天数
        var daysInMonth = function (date) {
            // 判断是不是为日期类型
            if (!date || Object.prototype.toString.call(date).slice(8, 12) !== 'Date') {
                return 0;
            }

            // 获取年、月
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            month = parseInt(month, 10);
            var date = new Date(year, month, 0);
            return date.getDate();
        }

        // 生产默认数据
        var axisData = (function initGen() {
            var time = new Date();
            // 获取本月天数
            var days = daysInMonth(time);
            var datas = [];
            for (var i = 1; i <= days; i++) {
                time.setDate(i);
                // 数据意义：时间点、成交笔数、成交金额（万元）
                datas.push([dateFormat(time), 0, 0.0]);
            }

            return datas;
        })();


        //初始化echarts图表
        var echeartOption = function (me) {

            var transReportOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                },
                legend: {
                    data: ['成交笔数', '成交金额']
                },
                dataZoom: {
                    show: false,
                    start: 0,
                    end: 100
                },
                // 坐标网格设置
                grid: {
                    left: '1%',
                    right: '1%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: (me.exAxisData || axisData).map(function (item) {
                            return item[0];
                        })
                    },
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: (me.exAxisData || axisData).map(function (item) {
                            return item[1];
                        })
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        name: '笔数',
                        min: 0,
                        minInterval: 1,
                        boundaryGap: [0.2, 0.2]
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '成交金额（万元）',
                        min: 0,
                        boundaryGap: [0.2, 0.2]
                    }
                ],
                series: [
                    {
                        name: '成交金额',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        barWidth: 40,
                        data: (me.exAxisData || axisData).map(function (item) {
                            return item[2];
                        })
                    },
                    {
                        name: '成交笔数',
                        type: 'line',
                        data: (me.exAxisData || axisData).map(function (item) {
                            return item[1];
                        })
                    }
                ]
            };

            me.echarts.setOption(transReportOption);
            me.echarts.resize();
        };

        return {
            restrict: 'AE',

            replace: false,

            scope: {
                monthAmount: '='
            },
            template: '<div>柱状图</div>',

            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                // 指令间数据共享的时候用到
            }],

            compile: function (element, attrs, transclude) {
                // 初始化
                var me = me || {};
                // 初始化图表
                me.echarts = echarts.init(element[0], 'macarons');

                return function ($scope, element, attr) {
                    $scope.$watch(
                        function ($scope) {
                            return $scope.monthAmount;
                        },
                        function () {
                            var data = $scope.monthAmount;
                            if (!!data && angular.isArray(data)) {
                                var self = me;
                                self.exAxisData = data;
                                echeartOption(self);
                            }
                        }, true);

                    $scope.resizeDom = function () {
                        return {
                            'height': element[0].offsetHeight,
                            'width': element[0].offsetWidth
                        };
                    };
                    $scope.$watch($scope.resizeDom, function () {
                        me.echarts.resize();
                    }, true);

                    var content = angular.element(document.querySelector('.content-wrapper'));
                    if (!!content) {
                        content.bind('resize', function () {
                            me.echarts.resize();
                        });
                    }

                    // 渲染图表
                    echeartOption(me);
                }
            }
        };
    });


    // 指令
    workspaceModule.directive('onlineUser', function () {
        //初始化echarts图表
        var echeartOption = function (me) {

            var colors = ['#5793f3', '#d14a61', '#675bba'];

            var axisData = [
                ['0点', 0.0, '0点', 0.0], ['1点', 0.0, '1点', 0.0], ['2点', 0.0, '2点', 0.0],
                ['3点', 0.0, '3点', 0.0], ['4点', 0.0, '4点', 0.0], ['5点', 0.0, '5点', 0.0],
                ['6点', 0.0, '6点', 0.0], ['7点', 0.0, '7点', 0.0], ['8点', 0.0, '8点', 0.0],
                ['9点', 0.0, '9点', 0.0], ['10点', 0.0, '10点', 0.0], ['11点', 0.0, '11点', 0.0],
                ['12点', 0.0, '12点', 0.0], ['13点', 0.0, '13点', 0.0], ['14点', 0.0, '14点', 0.0],
                ['15点', 0.0, '15点', 0.0], ['16点', 0.0, '16点', 0.0], ['17点', 0.0, '17点', 0.0],
                ['18点', 0.0, '18点', 0.0], ['19点', 0.0, '19点', 0.0], ['20点', 0.0, '20点', 0.0],
                ['21点', 0.0, '21点', 0.0], ['22点', 0.0, '22点', 0.0], ['23点', 0.0, '23点', 0.0]];

            var multipleOption = {
                color: ['#5793f3', '#d14a61', '#675bba'],
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: me.elegendData || ['昨天在线用户', '今天在线用户']
                },
                // 坐标网格设置
                grid: {
                    left: '1%',
                    right: '3%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '在线用户  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: (me.exAxisData || axisData ).map(function (item) {
                            return item[0];
                        })
                    },
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '在线用户  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: (me.exAxisData || axisData).map(function (item) {
                            return item[2];
                        })
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: '昨天在线用户',
                        type: 'line',
                        xAxisIndex: 1,
                        smooth: true,
                        data: (me.exAxisData || axisData).map(function (item) {
                            return item[1];
                        })
                    },
                    {
                        name: '今天在线用户',
                        type: 'line',
                        smooth: true,
                        data: (me.exAxisData || axisData).map(function (item) {
                            return item[3];
                        })
                    }
                ]
            };

            me.echarts.setOption(multipleOption);
        };

        return {
            restrict: 'AE',
            replace: false,

            scope: {
                users: '='
            },
            template: '<div>双曲线图</div>',

            controller: ['$scope', '$interval', function ($scope, $interval) {

            }],

            compile: function (element, attrs, transclude) {
                // 初始化
                var me = me || {};
                // 初始化图表
                me.echarts = echarts.init(element[0], 'macarons');

                // 直接返回 link 函数
                return function ($scope, element, attr) {
                    $scope.$watch(
                        function ($scope) {
                            return $scope.users;
                        },
                        function () {
                            var data = $scope.users;
                            if (!!data && angular.isArray(data)) {
                                var self = me;
                                self.exAxisData = data;
                                echeartOption(self);
                            }
                        }, true);
                    $scope.resizeDom = function () {
                        return {
                            'height': element[0].offsetHeight,
                            'width': element[0].offsetWidth
                        };
                    };
                    $scope.$watch($scope.resizeDom, function () {
                        me.echarts.resize();
                    }, true);

                    var content = angular.element(document.querySelector('.content-wrapper'));
                    if (!!content) {
                        content.bind('resize', function () {
                            me.echarts.resize();
                        });
                    }
                    // 渲染图表
                    echeartOption(me);
                }
            }
        };
    });


    // 指令
    workspaceModule.directive('rechargeAmount', function () {
        //初始化echarts图表
        var echeartOption = function (me) {

            var seriesData = [
                ['0点', 0.00, 0.00, 0.00, 0.00], ['1点', 0.00, 0.00, 0.00, 0.00], ['2点', 0.00, 0.00, 0.00, 0.00],
                ['3点', 0.00, 0.00, 0.00, 0.00], ['4点', 0.00, 0.00, 0.00, 0.00], ['5点', 0.00, 0.00, 0.00, 0.00],
                ['6点', 0.00, 0.00, 0.00, 0.00], ['7点', 0.00, 0.00, 0.00, 0.00], ['8点', 0.00, 0.00, 0.00, 0.00],
                ['9点', 0.00, 0.00, 0.00, 0.00], ['10点', 0.00, 0.00, 0.00, 0.00], ['11点', 0.00, 0.00, 0.00, 0.00],
                ['12点', 0.00, 0.00, 0.00, 0.00], ['13点', 0.00, 0.00, 0.00, 0.00], ['14点', 0.00, 0.00, 0.00, 0.00],
                ['15点', 0.00, 0.00, 0.00, 0.00], ['16点', 0.00, 0.00, 0.00, 0.00], ['17点', 0.00, 0.00, 0.00, 0.00],
                ['18点', 0.00, 0.00, 0.00, 0.00], ['19点', 0.00, 0.00, 0.00, 0.00], ['20点', 0.00, 0.00, 0.00, 0.00],
                ['21点', 0.00, 0.00, 0.00, 0.00], ['22点', 0.00, 0.00, 0.00, 0.00], ['23点', 0.00, 0.00, 0.00, 0.00]];

            var lineBarOption = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['富友', '宝付', '财付通', '充值总额'],
                    left: 'center'
                },
                // 坐标网格设置
                grid: {
                    left: '1%',
                    right: '3%',
                    bottom: '2%',
                    containLabel: true
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisPointer: {
                            type: 'shadow'
                        },
                        data: (me.exAxisData || seriesData).map(function (item) {
                            return item[0];
                        })
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 'dataMin',
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: '富友',
                        type: 'bar',
                        data: (me.exAxisData || seriesData).map(function (item) {
                            return item[1];
                        }),
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                    },
                    {
                        name: '宝付',
                        type: 'bar',
                        data: (me.exAxisData || seriesData).map(function (item) {
                            return item[2];
                        }),
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                    },
                    {
                        name: '财付通',
                        type: 'bar',
                        data: (me.exAxisData || seriesData).map(function (item) {
                            return item[3];
                        }),
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                    },
                    {
                        name: '充值总额',
                        type: 'line',
                        data: (me.exAxisData || seriesData).map(function (item) {
                            return item[4];
                        }),
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            };

            me.echarts.setOption(lineBarOption);
        };

        return {
            restrict: 'AE',
            replace: false,
            scope: {
                recharges: '='
            },

            template: '<div>折线柱状混合图</div>',

            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                // 指令间数据共享的时候用到
            }],

            compile: function (element, attrs, transclude) {
                // 初始化
                var me = me || {};
                // 初始化图表
                me.echarts = echarts.init(element[0], 'macarons');

                return function ($scope, element, attr) {
                    $scope.$watch(
                        function ($scope) {
                            return $scope.recharges;
                        },
                        function () {
                            var data = $scope.recharges;
                            if (!!data && angular.isArray(data)) {
                                var self = me;
                                self.exAxisData = data;
                                echeartOption(self);
                            }
                        }, true);

                    $scope.resizeDom = function () {
                        return {
                            'height': element[0].offsetHeight,
                            'width': element[0].offsetWidth
                        };
                    };
                    $scope.$watch($scope.resizeDom, function () {
                        me.echarts.resize();
                    }, true);

                    var content = angular.element(document.querySelector('.content-wrapper'));
                    if (!!content) {
                        content.bind('resize', function () {
                            me.echarts.resize();
                        });
                    }
                    // 渲染图表
                    echeartOption(me);
                }
            }
        };
    });
});