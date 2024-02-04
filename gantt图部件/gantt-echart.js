// js

var myChart;
var HEIGHT_RATIO = 0.6;
var DIM_CATEGORY_INDEX = 0;
var DIM_TIME_START = 1;
var DIM_TIME_END = 2;
var DIM_DEVICE_STATUS = 3;
var DIM_DEVICE_NAME = 4;
var COLORS = {
    "IDLE": "#929292",
    "RUN": "#82C303",
    "SETUP": "#FEFE2A",
    "DOWN": "#DD273E"
};
var _cartesianXBounds = [];
var _cartesianYBounds = [];
var _rawData = {
    "deviceID": {
        "dimensions": [
            "Name",
        ],
        "data": [
            [
                "E",
            ],
            [
                "D",
            ],
            [
                "C",
            ]
        
        ]
    },
    // - IDLE
    // - RUN
    // - SETUP
    // - DOWN
    "device": {
        "dimensions": [
            "Index",
            "开始时间",
            "结束时间",
            "状态",
            "设备"
        ],
        "data": [
            
            [
                "",
                1706732058000,
                1706736258000,
                "IDLE",
                "D"
            ],
            [
                "",
                1706736258000,
                1706739258000,
                "RUN",
                "E"
            ],


        ]
    }
}

function makeOption() {
    return {
        tooltip: {},
        animation: false,
        toolbox: {
            left: 20,
            top: 0,
            itemSize: 20,

        },
        title: {
            text: '设备运行甘特图',
            left: 'left'
        },
        dataZoom: [{
                type: 'slider',
                xAxisIndex: 0,
                filterMode: 'weakFilter',
                height: 20,
                bottom: 0,
                start: 0,
                end: 30,
                handleIcon: 'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                showDetail: false
            },
            {
                type: 'inside',
                id: 'insideX',
                xAxisIndex: 0,
                filterMode: 'weakFilter',
                start: 0,
                end: 30,
                zoomOnMouseWheel: false,
                moveOnMouseMove: true
            },
            {
                type: 'slider',
                yAxisIndex: 0,
                zoomLock: true,
                width: 10,
                right: 10,
                top: 70,
                bottom: 20,
                start: 0,
                end: 100,
                handleSize: 0,
                showDetail: false
            },
            {
                type: 'inside',
                id: 'insideY',
                yAxisIndex: 0,
                start: 0,
                end: 100,
                zoomOnMouseWheel: false,
                moveOnMouseMove: true,
                moveOnMouseWheel: true
            }
        ],
        grid: {
            show: true,
            top: 70,
            bottom: 20,
            left: 100,
            right: 20,
            backgroundColor: '#fff',
            borderWidth: 0
        },
        xAxis: {
            type: 'time',
            position: 'top',
            splitLine: {
                lineStyle: {
                    color: ['#E9EDFF']
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                lineStyle: {
                    color: '#929ABA'
                }
            },
            axisLabel: {
                color: '#929ABA',
                inside: false,
                align: 'center'
            }
        },
        yAxis: {
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            name: '设备',
            nameTextStyle: {
                  fontWeight: 800,
                  fontSize: 14,
            },
            // nameLocation: 'end',
            min: 0,
            max: _rawData.deviceID.data.length
        },
        series: [{
                id: 'deviceData',
                type: 'custom',
                renderItem: renderGanttItem,
                dimensions: _rawData.device.dimensions,
                encode: {
                    x: [DIM_TIME_START,
                        DIM_TIME_END
                    ],
                    y: DIM_CATEGORY_INDEX,
                    tooltip: [DIM_DEVICE_NAME,
                        DIM_TIME_START,
                        DIM_TIME_END,
                        DIM_DEVICE_STATUS
                    ]
                },
                data: _rawData.device.data
            },
            {
                type: 'custom',
                renderItem: renderAxisLabelItem,
                dimensions: _rawData.deviceID
                    .dimensions,
                encode: {
                    x: -1,
                    y: 0
                },
                data: _rawData.deviceID.data.map(
                    function(item, index) {
                        return [index].concat(item);
                    })
            }
        ]
    };
}

function renderGanttItem(params, api) {
    var category = api.value(DIM_DEVICE_NAME);
    var categoryIndex = _rawData.deviceID.data.findIndex(
        x => x[0] === category);
    var deviceStatus = api.value(DIM_DEVICE_STATUS);
    var timeStart = api.coord([api.value(
        DIM_TIME_START), categoryIndex]);
    var timeEnd = api.coord([api.value(
        DIM_TIME_END), categoryIndex]);
    var coordSys = params.coordSys;
    _cartesianXBounds[0] = coordSys.x;
    _cartesianXBounds[1] = coordSys.x + coordSys.width;
    _cartesianYBounds[0] = coordSys.y;
    _cartesianYBounds[1] = coordSys.y + coordSys.height;
    var barLength = timeEnd[0] - timeStart[0];
    // Get the heigth corresponds to length 1 on y axis.
    var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
    var x = timeStart[0];
    var y = timeStart[1] - barHeight;
    var rectNormal = clipRectByRect(params, {
        x: x,
        y: y,
        width: barLength,
        height: barHeight
    });
    return {
        type: 'group',
        children: [{
            type: 'rect',
            ignore: !rectNormal,
            shape: rectNormal,
            style: api.style({
                fill: COLORS[deviceStatus]
            })
        }]
    };
}

function renderAxisLabelItem(params, api) {
    var y = api.coord([0, api.value(0)])[1];
    if (y < params.coordSys.y + 5) {
        return;
    }
    return {
        type: 'group',
        position: [10, y],
        children: [{
                type: 'path',
                shape: {
                    d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
                    x: 0,
                    y: -20,
                    width: 90,
                    height: 20,
                    layout: 'cover'
                },
                style: {
                    fill: '#368c6c'
                }
            },
            {
                type: 'text',
                style: {
                    x: 24,
                    y: -3,
                    text: api.value(1) + "#",
                    textVerticalAlign: 'bottom',
                    textAlign: 'center',
                    textFill: '#fff'
                }
            }
        ]
    };
}

function clipRectByRect(params, rect) {
    return echarts.graphic.clipRectByRect(rect, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });
}

self.onInit = function() {
    var dom = $('#myChart');
    dom.width(self.ctx.width);
    dom.height(self.ctx.height);
    // self.ctx.flot = new TbFlot(self.ctx);   
    // init echart: 
    myChart = echarts.init(dom[0]);
    // show option
    myChart.setOption((option = makeOption()));

    console.log('init： ', self.ctx.defaultSubscription
        .data);
    self.ctx.$scope.states = self.ctx
        .defaultSubscription.data;
        
        
        
 
}




self.onResize = function() {
    // self.ctx.flot.resize();
    myChart.resize({
        width: self.ctx.width,
        // height: self.ctx.data.length * 40 + 100,
          height: self.ctx.height
    })
}

self.onDataUpdated = function() {
    let obj = {};
    if (self.ctx.$scope.states) {
        for (let device of self.ctx.$scope.states) {
            obj[device.datasource.name] = device.data
                .length;
        }
    }
    let prev = JSON.parse(localStorage.getItem(
        'deviceData'));

// Received data has been changed or not
    if (isChange(prev, obj)) {
      
    } else {
      
        refreshGraph();
        
    }
    localStorage.setItem('deviceData', JSON.stringify(
        obj));
}




function isChange(x, y) {
    return JSON.stringify(x) === JSON.stringify(y)
}


function refreshGraph() {
    console.log('mutation', self.ctx.$scope.states)
    const updateData = self.ctx.$scope.states;
    const chartData = {
        "deviceID": {
            "dimensions": [
                "Name",
            ],
            "data": []
        },
        "device": {
            "dimensions": [
                "Index",
                "开始时间",
                "结束时间",
                "状态",
                "设备名称"
            ],
            "data": []
        }
    }
    for (let device of updateData) {
        chartData.deviceID.data.push([device.datasource.entityName])
        for (let i = 0; i < device.data.length - 1; i++) {
            chartData.device.data.push([
                '',
                device.data[i][0],
                device.data[i + 1][0],
                device.data[i][1],
                device.datasource.entityName
            ])
        }
    }
    
    _rawData = chartData;
    // show option
    myChart.setOption((option = makeOption()));
}


//  js end 


// html start 
<div id="myChart" ></div>
// html end 



// import 3rd 
https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js