self.onInit = function() {
    self.ctx.$scope.datasources = self.ctx
        .defaultSubscription.datasources;
    self.ctx.$scope.data = self.ctx.defaultSubscription
        .data;
    self.ctx.updateWidgetParams();

    console.log('init ', self.ctx.defaultSubscription);

    // init device id
    self.ctx.$scope.deviceInfo = '';
    if (self.ctx.$scope.datasources) {
        for (let item of self.ctx.$scope.datasources) {
            self.ctx.$scope.deviceInfo += (' ' + item
                .name);
        }
    }

    // init device state
    self.ctx.$scope.deviceState = '';


    // init lot list
    self.ctx.$scope.lotList = [];
    
    
    // init alarm list 
    self.ctx.$scope.alarms = [];
    
    
     // init clear alarms list 
    self.ctx.$scope.clearAlarms = [];

    // init available alarm list 
    self.ctx.$scope.availableAlarms = [];





}

self.onDataUpdated = function() {
    console.log('data', self.ctx.$scope.data)
    // console.log('data source', self.ctx.$scope
    //     .datasources)
    // process device deviceState
    processState();
    processLots();
    processAlarms();
    processClearAlarms();
    self.ctx.detectChanges();
}

// show device state 
function processState() {
    let findState = self.ctx.$scope.data.find(x => x
        .dataKey.name ===
        'EquipmentProcessingState');
    // console.log(findState);
    if (findState && findState.data && findState.data
        .length > 0) {
        let state = findState.data[findState.data.length -
            1][1];
        self.ctx.$scope.deviceState = state.toLowerCase();
        // console.log(findState.data[findState.data.length -
        //     1][1])
    }
}

//  lots list
function processLots() {
    let LotsList = self.ctx.$scope.data.find(x => x
        .dataKey.name ===
        'LotState');
    self.ctx.$scope.lotList = [];
    // process  map to array
    if (LotsList && LotsList.data && LotsList.data.length >
        0) {
        for (let material of LotsList.data) {
            self.ctx.$scope.lotList.push(material[1]);
        }
    }
    
    // console.log(self.ctx.$scope.lotList);


}

// alarms 
function processAlarms() {
    let LotsList = self.ctx.$scope.data.find(x => x
        .dataKey.name ===
        'AlarmSet');
    self.ctx.$scope.alarms = [];
    // process  map to array
    if (LotsList && LotsList.data && LotsList.data.length >
        0) {
        for (let item of LotsList.data) {
            self.ctx.$scope.alarms.push(item[1]);
        }
    }
}


function  processClearAlarms() {
    let LotsList = self.ctx.$scope.data.find(x => x
        .dataKey.name ===
        'AlarmClear');
    self.ctx.$scope.clearAlarms = [];
    // process  map to array
    if (LotsList && LotsList.data && LotsList.data.length >
        0) {
        for (let item of LotsList.data) {
            self.ctx.$scope.clearAlarms.push(item[1]);
        }
    }

    
    let availableList = self.ctx.$scope.alarms.filter(item => !self.ctx.$scope.clearAlarms.some(val => item.AlarmID === val.AlarmID));
    
   self.ctx.$scope.availableAlarms = availableList;
}