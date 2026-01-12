;(function () {
    /**
     * 雷达图构造器
     * @param  {[JS原生DOM元素]} element // 雷达图构造元素
     * @param {[Object]} // 雷达图配置信息对象
     *      data: {  {[Object]}  // 必选参数
                maxValue:  {{Array}}  // 必选参数，数据值的最大值。例如：[100, 100, 100, 100, 100]
                value:  {{Array}}  // 必选参数，数据值。例如：[30, 20, 40, 20, 50]
                description:   {{Array}}  // 必选参数，数据值对应的描述信息。例如：["第一名", "第二名", "第三名", "第四名", "第五名"],
                tooltipsString:  {{Function或String}}  // 可选参数。 tooltip的文字信息。当该参数类型为String时，直接显示该文字。
                                                    当参数类型为Function时，该函数有3个默认参数，分别是description、value、maxVlaue，即：数据描述信息、数据值、数据最大值。需要在该函数中返回String。例如，function(description, value, maxVlaue) {return description + "<br>" + value + "<br>" + maxVlaue}。
                },

     // 可选参数。雷达图的显示样式配置
     config: {  {[Object]}

                showTooltip:  {[Boolean]}  // 是否显示气泡框。默认为false，显示气泡框。
                radius:  {{Int}}  // 雷达图的半径。默认值为雷达图元素最短边一半的0.6倍
                origin:  {{Array}}  // 中心位置[x, y]。默认值为构建元素的中心位置
                scale: {{Float}} // 雷达图的放大倍数。取值范围为0~1

                // 雷达背景图配置
                bg: {  {{Object}}
                    layer:  {{Int}}  // 雷达图的绘制层数。默认值为7。
                    evenFillStyle:  {{String}}  // 偶数层的填充样式。如："red"、"#ccc"。默认值为："#fff"。
                    oddFillStyle:  {{String}}  // 奇数层的填充样式。默认值为："#eee"。
                    evenStrokeStyle:  {{String}}  // 偶数层的描边样式。默认值为："#ddd"。
                    oddStrokeStyle:  {{String}}  // 奇数层的填充样式。默认值为："#ddd"。
                },

                // 数据多边形是否填充，及填充样式
                dataFill: {  {{Object}}
                    fillStyle:  {{String}}  // 数据组成多边形的填充样式。默认值为：transparent。
                }

                // 数据线条的样式配置
                dataLine: {  {{Object}}
                    strokeStyle:  {{String}}  // 线条样式。默认值为："red"。
                    lineWidth:  {{Int}}  // 线条宽度。默认值为 2。
                },

                // 数据点圆圈的样式配置
                dataCircle: {  {{Object}}
                    r:  {{Int}}  // 圆圈半径。默认值为：3。
                    strokeStyle:  {{String}}  // 圆圈描边样式。默认值为："red"。
                    fillStyle:  {{String}}  // 圆圈填充样式。默认值为：3。
                    lineWidth:  {{Int}}  // 圆圈线条宽度。默认值为："#fff"。
                },

                // tooltip的样式配置
                tooltip: {  {{Object}}
                    offsetX:  {{Int}}  // tooltip悬浮框的水平偏移量。默认值为：数据点圆圈的半径。
                    offsetY:  {{Int}}  // tooltip悬浮框的垂直偏移量。默认值为：0。
                    r:  {{Int}}  // tooltip悬浮框的与数据点的显示半径。默认值为：0。
                },

                // 文字绘制的样式配置
                font: {  {{Object}}
                    fontStyle:  {{String}}  // 字体样式，缩写
                    fontColor:  {{String}}  // 字体颜色
                }
            }
     */

    // 雷达图构造器对象
    var radarChart = {};
    // 雷达图构造方法
    radarChart.init = function(element, options) {
        new RadarFactory(element, options).init();
    };

    // 雷达图构造函数
    function RadarFactory(element, options) {
        this.init = function() {};

        // 获取屏幕分辨率
        function getRatio(context) {
            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStorePixelRatio = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            var ratio = devicePixelRatio / backingStorePixelRatio;
            return ratio;
        }

        // 初始化雷达DOM构建
        if(element) {
            var elementWidth = element.offsetWidth,
                elementHeight = element.offsetHeight,
                elementOffsetLeft = element.offsetLeft,
                elementOffsetTop = element.offsetTop;

            // 创建canvas对象，初始化canvas的宽高
            var canvas = document.createElement("canvas");
            element.appendChild(canvas);
            canvas = element.getElementsByTagName("canvas")[0];
            var context = canvas.getContext("2d");
            var ratio = getRatio(context) || 1; // 屏幕分辨率

            canvas.width = elementWidth * ratio;
            canvas.height = elementHeight * ratio;

            canvas.style.width = elementWidth + "px";
            canvas.style.height = elementHeight + "px";

            // config参数初始化默认值
            var userConfig = setDefaultValueObj({
                scale: 1,
                origin: [canvas.width / 2, canvas.height / 2],
                showTooltip: false
            }, options.config);
            var defaultRadius = Math.min(canvas.width, canvas.height) * 0.5 * 0.6 * userConfig.scale; // 正多边形的默认半径
            userConfig.radius = userConfig.radius ? userConfig.radius : defaultRadius;
            // 是否设置 origin 中心偏移量
            if (userConfig.originOffset && Array.isArray(userConfig.originOffset) && userConfig.originOffset.length === 2) {
                userConfig.originOffset.forEach(function (offset, index) {
                    userConfig.origin[index] += (parseInt(offset) || 0) * ratio;
                });
            }

            // 背景图的config设置默认参数
            userConfig.bg = setDefaultValueObj({
                layer: 7,
                evenFillStyle: "#fff",
                oddFillStyle: "#eee",
                evenStrokeStyle: "#ddd",
                oddStrokeStyle: "#ddd"
            }, userConfig.bg);

            // 数据填充多边形的config设置参数
            userConfig.dataFill = setDefaultValueObj({
                fillStyle: "transparent"
            }, userConfig.dataFill);

            // 数据线条的config设置参数
            userConfig.dataLine = setDefaultValueObj({
                strokeStyle: "red",
                lineWidth: 2 * ratio
            }, userConfig.dataLine);

            // 数据点圆圈的config设置参数
            userConfig.dataCircle = setDefaultValueObj({
                r: 2 * ratio,
                strokeStyle: "red",
                lineWidth: 2 * ratio,
                fillStyle: "#fff"
            }, userConfig.dataCircle);

            // tooltip的config设置参数
            userConfig.tooltip = setDefaultValueObj({
                r: userConfig.dataCircle.r,
                offsetX: 0,
                offsetY: 0
            }, userConfig.tooltip);

            // 文字样式的config设置参数
            userConfig.font = setDefaultValueObj({
                fontStyle: 12 * ratio + "px Pingfang SC,STHeiti,Lantinghei SC,Open Sans,Arial,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,SimSun,sans-serif",
                fontColor: "#000",
                subFontColor: "#000"
            }, userConfig.font);

            // data参数初始化默认值
            var data = setDefaultValueObj({
                description: [],
                tooltipsString: [],
                maxValue: [],
                value: []
            }, options.data);

            // 构建程序需要的基本数据对象
            var baseConfig = {};
            function constructBaseConfig() {
                var dataLength = data.value ? data.value.length : 0;
                baseConfig.n = dataLength; // 正多边形的边数
                baseConfig.dataRadiusOfPercent = [];
                baseConfig.dataRadius = [];
                baseConfig.angleArr = [];
                baseConfig.tooltipsContentArr = [];
                // console.log(dataLength);
                var disAngle = Math.PI * 2 / baseConfig.n;
                for(var i = 0; i < dataLength; i++) {
                    baseConfig.dataRadiusOfPercent[i] = data.value[i] / data.maxValue[i];
                    baseConfig.dataRadius[i] = baseConfig.dataRadiusOfPercent[i] * userConfig.radius;
                    baseConfig.angleArr[i] = i * disAngle;

                    // 构建气泡显示数据初始化
                    if(userConfig.showTooltip) {
                        if(typeof data.tooltipsString == "function") {
                            baseConfig.tooltipsContentArr[i] = data.tooltipsString(data.description[i], data.value[i], data.maxValue[i]);
                        } else if(typeof data.tooltipsString == "String") {
                            baseConfig.tooltipsContentArr[i] = data.tooltipsString;
                        } else {
                            baseConfig.tooltipsContentArr[i] = data.description[i] + ": <br>" + "最大值: " + data.maxValue[i] + "<br>" + "当前值：" + data.value[i];
                        }
                    }
                }
            }

            // 初始化雷达图对象
            this.init = function() {
                // 初始化参数配置
                constructBaseConfig();
                // 初始化雷达图元素的基本样式
                element.style.position = "relative";

                drawCanvasAnimation();

                /*        // 绘制数据线条
                 drawDataLine({
                 dataPoints: dataPointsPosArray,
                 strokeStyle: userConfig.dataLine.strokeStyle,
                 lineWidth: userConfig.dataLine.lineWidth
                 });

                 // 绘制数据多边形填充
                 drawDataFill({
                 dataPoints: dataPointsPosArray,
                 fillStyle: userConfig.dataFill.fillStyle
                 });

                 // 绘制数据点圆圈
                 drawDataCircle({
                 dataPoints: dataPointsPosArray,
                 r: userConfig.dataCircle.r,
                 strokeStyle: userConfig.dataCircle.strokeStyle,
                 fillStyle: userConfig.dataCircle.fillStyle,
                 lineWidth: userConfig.dataCircle.lineWidth
                 });*/

                // 绘制tooltips
                if(userConfig.showTooltip) {
                    // 构建气泡显示元素
                    baseConfig.tooltipEle = document.createElement("div");
                    baseConfig.tooltipEle.className = "radar-tooltips";
                    baseConfig.tooltipEle.style.position = "absolute";
                    baseConfig.tooltipEle.style.display = "none";
                    element.appendChild(baseConfig.tooltipEle);

                    // 绘制tooltips
                    checkIsDataCircle({
                        tooltipEle: element.getElementsByClassName("radar-tooltips")[0],
                        tootipContentArray: baseConfig.tooltipsContentArr,
                        tooltipOffsetX: userConfig.tooltip.offsetX,
                        tooltipOffsetY: userConfig.tooltip.offsetY,
                        dataCircleRadius: userConfig.tooltip.r
                    });
                }
            };

            function drawCanvasAnimation() {
                var radiusPercent = 0;
                var timer = null;
                (function drawFrame() {
                    timer = window.requestAnimationFrame(drawFrame);
                    // 数据点坐标元素 userConfig.radius
                    radiusPercent += 0.05;
                    if(radiusPercent >= 1) {
                        window.cancelAnimationFrame(timer);
                    }
                    var dataRadius = baseConfig.dataRadius.map(function(value, index) {
                        return value * radiusPercent;
                    });
                    var dataPointsPosArray = getDataPointsPos(baseConfig.n, userConfig.radius, dataRadius, baseConfig.angleArr);
                    // 清空画布
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    // 书写文字
                    drawText({
                        n: baseConfig.n,
                        r: userConfig.radius,
                        data: data.description,
                        subData: data.subText,
                        origin: userConfig.origin,
                        fontStyle: userConfig.font.fontStyle,
                        fontColor: userConfig.font.fontColor,
                        subFontColor: userConfig.font.subFontColor
                    });

                    // 绘制背景图
                    drawRadarBackground({
                        layer: userConfig.bg.layer,
                        n: baseConfig.n,
                        r: userConfig.radius,
                        origin: userConfig.origin,
                        evenFillStyle: userConfig.bg.evenFillStyle,
                        oddFillStyle: userConfig.bg.oddFillStyle,
                        evenStrokeStyle: userConfig.bg.evenStrokeStyle,
                        oddStrokeStyle: userConfig.bg.oddStrokeStyle
                    });

                    // 绘制数据多边形
                    var dataLineOptions = {
                            dataPoints: dataPointsPosArray,
                            strokeStyle: userConfig.dataLine.strokeStyle,
                            lineWidth: userConfig.dataLine.lineWidth
                        },
                        dataFillOptions = {
                            dataPoints: dataPointsPosArray,
                            fillStyle: userConfig.dataFill.fillStyle
                        },
                        dataCircleOptions = {
                            dataPoints: dataPointsPosArray,
                            r: userConfig.dataCircle.r,
                            strokeStyle: userConfig.dataCircle.strokeStyle,
                            fillStyle: userConfig.dataCircle.fillStyle,
                            lineWidth: userConfig.dataCircle.lineWidth
                        };
                    drawDataPoly({
                        dataLineOptions: dataLineOptions,
                        dataFillOptions: dataFillOptions,
                        dataCircleOptions: dataCircleOptions
                    });
                })();
            }

            // 获取正多边形每个点的坐标位置数组（相对于坐标）
            this.getPolygonPos = function() {
                getPolygonPos(baseConfig.n, userConfig.radius, userConfig.origin);
            };

            /**
             * 设置对象的默认属性值
             * @param {[Object]} defalutObj [默认值对象]
             * @param {[Object]} formerObj  [原对象]
             */
            function setDefaultValueObj(defalutObj, formerObj) {
                var resultObj = {};
                for(var i in defalutObj) {
                    resultObj[i] = defalutObj[i];
                }
                for(var i in formerObj) {
                    resultObj[i] = formerObj[i];
                }
                return resultObj;
            }

            /**
             * 获取数据点相对于原点的坐标
             * n：多边形边数
             * r: 多边形半径
             * dataRadiusArr: 数据点的坐标数组
             * angleArr: 多边形的角度数组
             */
            function getDataPointsPos(n, r, dataRadiusArr, angleArr) {
                var n = n ? n : 6,
                    r = r ? r : 50,
                    dataRadiusArr = dataRadiusArr ? dataRadiusArr : [],
                    angleArr = angleArr ? angleArr : [];
                var dataPointsPosArray = [];
                for(var i = 0; i < n; i++) {
                    var curPoinrPos = {};
                    curPoinrPos.x = dataRadiusArr[i] * Math.sin(angleArr[i]);
                    curPoinrPos.y = - dataRadiusArr[i] * Math.cos(angleArr[i]);
                    // console.log("curPoinrPos: " + curPoinrPos.x + "; " + curPoinrPos.y);
                    dataPointsPosArray.push(curPoinrPos);
                }
                return dataPointsPosArray;
            }

            /**
             * 绘制数据点组成的图案
             * dataLineOptions
             * dataFillOptions
             * dataCircleOptions
             */
            function drawDataPoly(options) {
                var dataLineOptions = options.dataLineOptions || {},
                    dataFillOptions = options.dataFillOptions || {},
                    dataCircleOptions = options.dataCircleOptions || {};
                // 绘制数据点连接线条
                drawDataLine(dataLineOptions);
                // 绘制数据多边形填充
                drawDataFill(dataFillOptions);
                // 绘制数据点圆圈
                drawDataCircle(dataCircleOptions);
            }

            /**
             * 绘制数据点连接线条
             * options对象的属性如下：
             * dataPoints: 数据的位置数组
             * strokeStyle: 线条样式
             * lineWidth: 线条宽度
             */
            function drawDataLine(options) {
                var strokeStyle = options.strokeStyle ? options.strokeStyle : "red",
                    lineWidth = options.lineWidth ? options.lineWidth : 2,
                    dataPointsPosArray = options.dataPoints ? options.dataPoints : [];

                dataPointsPosArrayLen = dataPointsPosArray.length;
                dataPointsPosArrayLen = dataPointsPosArray.length;

                context.save();
                context.beginPath();
                context.translate(userConfig.origin[0], userConfig.origin[1]);
                context.moveTo(dataPointsPosArray[0].x, dataPointsPosArray[0].y);
                for(var i = 1; i < dataPointsPosArrayLen; i++) {
                    context.lineTo(dataPointsPosArray[i].x, dataPointsPosArray[i].y);
                }
                context.closePath();
                context.strokeStyle = strokeStyle;
                context.lineWidth = lineWidth;
                context.lineJoin = "round";
                context.stroke();
                context.restore();
            }


            /**
             * 绘制数据多边形填充
             * options对象的属性如下：
             * dataPoints: 数据的位置数组
             * fillStyle: 填充样式
             */
            function drawDataFill(options) {
                var fillStyle = options.fillStyle ? options.fillStyle : "transparent",
                    dataPointsPosArray = options.dataPoints ? options.dataPoints : [];

                dataPointsPosArrayLen = dataPointsPosArray.length;

                context.save();
                context.beginPath();
                context.translate(userConfig.origin[0], userConfig.origin[1]);
                context.moveTo(dataPointsPosArray[0].x, dataPointsPosArray[0].y);
                for(var i = 1; i < dataPointsPosArrayLen; i++) {
                    context.lineTo(dataPointsPosArray[i].x, dataPointsPosArray[i].y);
                }
                context.closePath();
                context.fillStyle = fillStyle;
                context.fill();
                context.restore();
            }

            /**
             * 绘制数据点圆圈
             * 参数options对象的属性如下：
             * dataPoints: 数据的位置数组
             * r: 圆圈半径
             * strokeStyle: 圆的描边样式
             * fillStyle: 圆的描边宽度
             * lineWidth: 圆的填充样式
             */
            function drawDataCircle(options) {
                var r = options.r ? options.r * ratio : 1 * ratio,
                    strokeStyle = options.strokeStyle ? options.strokeStyle : "#000",
                    lineWidth = options.lineWidth ? options.lineWidth * ratio : 1 * ratio,
                    fillStyle = options.fillStyle ? options.fillStyle : "#222",
                    dataPointsPosArray = options.dataPoints ? options.dataPoints : [];

                dataPointsPosArrayLen = dataPointsPosArray.length;

                for(var i = 0; i < dataPointsPosArrayLen; i++) {
                    drawCircle({
                        x: dataPointsPosArray[i].x,
                        y: dataPointsPosArray[i].y,
                        r: r,
                        originX: userConfig.origin[0],
                        originY: userConfig.origin[1],
                        strokeStyle: strokeStyle,
                        lineWidth: lineWidth,
                        fillStyle: fillStyle
                    });
                }
            }

            /**
             * 绘制圆圈
             * x: 圆心位置x
             * y: 圆心位置y
             * r: 半径
             * originX: 原点位置x
             * originY: 原点位置y
             * strokeStyle: 描边样式
             * lineWidth: 线条宽度
             * fillStyle: 填充样式
             */
            function drawCircle(options) {
                var x = options.x ? options.x : 0,
                    y = options.y ? options.y : 0,
                    r = options.r ? options.r : 10,
                    originX = options.originX ? options.originX : 0,
                    originY = options.originY ? options.originY : 0,
                    strokeStyle = options.strokeStyle ? options.strokeStyle : "#000",
                    lineWidth = options.lineWidth ? options.lineWidth : 2,
                    fillStyle = options.fillStyle ? options.fillStyle : "#fff";
                context.save();
                context.beginPath();
                context.translate(originX, originY);
                context.arc(x, y, r, 0 , Math.PI * 2);
                context.closePath();
                context.strokeStyle = strokeStyle;
                context.lineWidth = lineWidth;
                context.lineJoin = "round";
                context.fillStyle = fillStyle;
                context.stroke();
                context.fill();
                context.restore();
            }

            /**
             * 检查鼠标是否在当前数据点位置，并显示气泡
             * options对象属性如下：
             * tooltipEle: 气泡元素符号
             * tootipContentArray: 气泡元素的文本内容数组
             * tooltipOffsetX: 气泡框显示的水平偏移量
             * tooltipOffsetX: 气泡框显示的垂直偏移量
             * dataCircleRadius: 数据点元素的半径
             */
            function checkIsDataCircle(options) {
                var tooltipEle = options.tooltipEle ? options.tooltipEle : null,
                    tootipContentArray = options.tootipContentArray ? options.tootipContentArray : [],
                    tooltipOffsetX = options.tooltipOffsetX ? options.tooltipOffsetX : 0,
                    tooltipOffsetY = options.tooltipOffsetY ? options.tooltipOffsetY : 0,
                    dataCircleRadius = options.dataCircleRadius ? options.dataCircleRadius : 10;
                var dataPointsPosArray = getDataPointsPos(baseConfig.n, userConfig.radius, baseConfig.dataRadius, baseConfig.angleArr);
                dataPointsPosArrayLen = dataPointsPosArray.length;
                if(tooltipEle) {
                    var isShowTooltips = false;
                    var tooltipsEle = tooltipEle;
                    element.addEventListener("mousemove", function(e) {
                        for(var i = 0; i < dataPointsPosArrayLen; i++) {
                            isShowTooltips = false;
                            var distance = 0;
                            if(dataPointsPosArray[i]) {
                                distance = Math.pow(e.pageX - elementOffsetLeft - dataPointsPosArray[i].x - userConfig.origin[0], 2) + Math.pow(e.pageY - elementOffsetTop - dataPointsPosArray[i].y - userConfig.origin[1], 2);
                                if(distance <= Math.pow(dataCircleRadius, 2)) {
                                    tooltipsEle.style.left = e.pageX - elementOffsetLeft + tooltipOffsetX + "px";
                                    tooltipsEle.style.top = e.pageY - elementOffsetTop + tooltipOffsetY + "px";
                                    tooltipsEle.innerHTML = tootipContentArray[i];
                                    // console.log("x: " + e.pageX + "; y : " + e.pageY);
                                    isShowTooltips = true;
                                    break;
                                }
                            }
                            // console.log("distance: " + distance);
                        }
                        // console.log("isShowTooltips: " + isShowTooltips);
                        if(isShowTooltips) {
                            tooltipsEle.style.display = "block";
                        } else {
                            tooltipsEle.style.display = "none";
                        }
                    });
                }
            }

            /**
             * 获取正多边形每个点的坐标位置数组（相对于原点）
             * n: 多边形的边数
             * r: 半径
             * origin: 原点位置
             */
            function getPolygonPos(n, r, origin) {
                var n = n ? n : 5,
                    r = r ? r : 30;
                var dotsArray = []; // 多边形每一个点的坐标数组，格式如[{x: 1, y: 2}]
                var angle = Math.PI * 2 / n;
                for(i = 0;i < n; i ++) {
                    var curPos = {};
                    curPos.x = r * Math.sin(i * angle) + origin[0];
                    curPos.y = -r * Math.cos(i * angle) + origin[1];
                    dotsArray.push(curPos);
                    // console.log(curPos.x + "; " + curPos.y);
                }
                return dotsArray;
            }

            /**
             * 绘制闭合正多边形
             * 参数options对象包含如下属性：
             * n: 边数
             * r：半径
             * origin：正多边形的中心位置。数组形式[x, y]
             * fillStyle：填充样式
             * strokeStyle：线条样式
             * lineWidth: 线条宽度
             * lineCap：线条终点的绘制方式
             * delta：delta指偏移Y轴负方向的角度。默认是从Y轴负方向开始绘制第一个点。采用Math.PI进制
             */
            function drawPolygon(options) {
                // 对传入参数进行默认值设置
                var n = options.n ? options.n : 5,
                    r = options.r ? options.r : 30,
                    origin = options.origin ? options.origin : [0, 0],
                    fillStyle = options.fillStyle ? options.fillStyle : "transparent",
                    strokeStyle = options.strokeStyle ? options.strokeStyle : "#000",
                    lineWidth = options.lineWidth ? options.lineWidth * ratio : 1 * ratio,
                    lineCap = options.lineCap ? options.lineCap : "butt";
                context.save();
                context.beginPath();
                var angle = Math.PI * 2 / n;
                context.translate(origin[0], origin[1]);
                context.moveTo(0, -r);
                for(i = 0;i < n; i ++) {
                    context.rotate(angle);
                    context.lineTo(0, -r);
                }
                context.closePath();

                if(options.strokeStyle) {
                    context.strokeStyle = strokeStyle;
                    context.lineWidth = lineWidth;
                    context.lineCap = lineCap;
                    context.stroke();
                }
                if(options.fillStyle) {
                    context.fillStyle = fillStyle;
                    context.fill();
                }
                context.restore();
            }

            /**
             * 绘制雷达图的描述文字
             * 参数options对象的属性如下：
             * n: 边数
             * r：半径
             * origin：正多边形的中心位置。数组形式[x, y]
             * limit: 文本左右布局的偏差值
             * fontStyle: 文字样式
             * fontColor: 文字颜色
             */
            function drawText(options) {
                var data = options.data ? options.data : [],
                    subData = options.subData ? options.subData : [],
                    hasSubText = options.subData && options.subData.length > 0,
                    n = options.n ? options.n : 5,
                    r = options.r ? options.r : 30,
                    origin = options.origin ? options.origin : [0, 0],
                    limit = options.limit ? options.limit : 10,
                    fontStyle = options.fontStyle ? options.fontStyle : "",
                    fontColor = options.fontColor ? options.fontColor : "#000",
                    subFontColor = options.subFontColor ? options.subFontColor : "#000";

                var getPolygonPosArray = getPolygonPos(n, r, origin);
                context.save();
                context.font = fontStyle;

                for(var i = 0; i < data.length; i++) {
                    var curPosX = getPolygonPosArray[i].x,
                        curPosY = getPolygonPosArray[i].y;
                    // X
                    if(Math.abs(getPolygonPosArray[i].x - origin[0]) >= limit) {
                        // 左右两侧的文字
                        if(getPolygonPosArray[i].x - origin[0] > 0) {
                            context.textAlign = "left";
                            curPosX += 6 * ratio;
                        } else if(getPolygonPosArray[i].x - origin[0] < 0) {
                            context.textAlign = "right";
                            curPosX -= 6 * ratio;
                        }
                    } else {
                        // 上下两侧的文字
                        context.textAlign = "center";
                    }
                    // Y
                    if(Math.abs(getPolygonPosArray[i].y - origin[1]) >= r - limit) {
                        if(getPolygonPosArray[i].y - origin[1] < 0) {
                            // 上侧的文字
                            curPosY -= 6 * ratio;
                            if (hasSubText) {
                                curPosY -= 13 * ratio;
                            }
                        } else if(getPolygonPosArray[i].y - origin[1] > 0) {
                            // 下侧的文字
                            curPosY += 14 * ratio;
                        }
                    }

                    // 绘制主文字
                    context.fillStyle = fontColor;
                    context.fillText(data[i], curPosX, curPosY);

                    // 绘制副文字
                    if (hasSubText) {
                        context.fillStyle = subFontColor;
                        context.fillText(subData[i], curPosX, curPosY + 13 * ratio);
                    }
                }
                context.restore();
            }

            /**
             * 绘制雷达的背景图
             * 参数options对象的属性如下：
             * n: 边数
             * r：半径
             * origin：正多边形的中心位置。数组形式[x, y]
             * oddStrokeStyle: index为奇数的多边形的描边样式
             * oddFillStyle: index为奇数的多边形的描边样式
             * evenStrokeStyle: index为偶数的多边形的描边样式
             * evenFillStyle: index为偶数的多边形的描边样式
             */
            function drawRadarBackground(options) {
                var layer = options.layer ? options.layer : 5,
                    n  = options.n ? options.n : 5,
                    r = options.r ? options.r : 50,
                    origin = options.origin ? options.origin : [0, 0],
                    evenStrokeStyle = options.evenStrokeStyle ? options.evenStrokeStyle : "#ccc",
                    oddStrokeStyle = options.oddStrokeStyle ? options.oddStrokeStyle : "#ccc",
                    evenFillStyle = options.evenFillStyle ? options.evenFillStyle : "#eee",
                    oddFillStyle = options.oddFillStyle ? options.oddFillStyle : "transparent";
                var layerRadiusArray = [];
                var layerDis = r / layer;
                for(var i = 0; i < layer; i++) {
                    layerRadiusArray[i] = layerDis * (i + 1);
                }
                layerRadiusArray = layerRadiusArray.reverse();
                // console.log("layer: " + layer);
                // console.log("layerDis: " + layerDis);
                // console.log("r: " + r);
                // console.log("layerRadiusArray: " + layerRadiusArray);
                for(var i = 0; i < layer; i++) {
                    if(i % 2 != 0) {
                        drawPolygon({
                            n: n,
                            r: layerRadiusArray[i],
                            origin: origin,
                            fillStyle: evenFillStyle,
                            strokeStyle: evenStrokeStyle,
                            lineWidth: 1
                        });
                    } else {
                        drawPolygon({
                            n: n,
                            r: layerRadiusArray[i],
                            origin: origin,
                            fillStyle: oddFillStyle,
                            strokeStyle: oddStrokeStyle,
                            lineWidth: 1
                        });
                    }
                }

                // 绘制放射性连线
                context.save();
                context.beginPath();
                var polygonOuterPointsPosArr = getPolygonPos(n ,r, origin);
                for(var i = 0; i < n; i++) {
                    context.moveTo(origin[0], origin[1]);
                    context.lineTo(polygonOuterPointsPosArr[i].x, polygonOuterPointsPosArr[i].y);
                }
                context.strokeStyle = evenStrokeStyle;
                context.lineWidth = 1;
                context.stroke();
                context.restore();
            }
        }
    }

    window.radarChart = radarChart;
})();