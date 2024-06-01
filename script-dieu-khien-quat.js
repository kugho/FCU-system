const firebaseConfig = {
  apiKey: "AIzaSyA7iejZnrLVHS1IrYa7Unt5B-csVqKIUug",
  authDomain: "nwng-30d53.firebaseapp.com",
  databaseURL: "https://nwng-30d53-default-rtdb.firebaseio.com",
  projectId: "nwng-30d53",
  storageBucket: "nwng-30d53.appspot.com",
  messagingSenderId: "26507399099",
  appId: "1:26507399099:web:1ee34a6abbf6eea4e23e9e",
  measurementId: "G-WHRHDVT8G1"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();


// ????????????????????????????????????????????????????????????????
database.ref("Monitor/OUT FRQ/data").on("value", function(snapshot){
  var temp_chart = snapshot.val() * 2;

var options = {
  series: [(temp_chart)],
  chart: {
  height: 350,
  type: 'radialBar',
  offsetY: -10
},
plotOptions: {
  radialBar: {
    startAngle: -135,
    endAngle: 135,
    dataLabels: {
      name: {
        fontSize: '16px',
        color: undefined,
        offsetY: 120
      },
      value: {
        offsetY: 76,
        fontSize: '22px',
        color: undefined,
        formatter: function (val) {
          return val + "%";
        }
      }
    }
  }
},
fill: {
  type: 'gradient',
  gradient: {
      shade: 'dark',
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91]
  },
},
stroke: {
  dashArray: 4
},
// labels: ['Median Ratio'],
};

var chart = new ApexCharts(document.querySelector("#chart1"), options);
chart.render();
})
/////////////////////////////////////////////////////////////
var monitor_frame = document.getElementById("monitor-frame");
var modal_monitor = document.getElementById("modal-monitor");
var voltage_monitor = document.getElementById("voltage-monitor");
function getArr(arr, newVal) {
  if (arr.length === 0 && !newVal) return [];

  const newArr = [...arr, newVal];
  if (newArr.length > 11) {
      newArr.shift();
  }
  return newArr;
}

var voltage = document.getElementById('chart-voltage').getContext('2d');
var chart_voltage = new Chart(voltage, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
          label: 'Temp',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false
      }
        
    ]
  },
  options: {
      responsive: true,
      animation: {
          duration: 0
      },
      scales: {
          y: {
              min: 20,
              max: 31,
              ticks: {
                  stepSize: 0.2
              }
          }
      }
  }
});

var time_voltage = [];
var value_voltage = [];
var j = 0;
var volt_out = 0;
var chartinterval;
database.ref("Monitor/TEMP1/data").on("value", function (snapshot) {
    volt_out = snapshot.val();
    document.getElementById("nhietdo").innerHTML = volt_out ;
    updateChartvoltage(volt_out);
});
function updateChartvoltage(volt_out){
  var time = new Date().toLocaleTimeString();
  const data = getArr(chart_voltage.data.datasets[0].data, volt_out);
  const labels = getArr(chart_voltage.data.labels, time);
  chart_voltage.data.labels = labels
  chart_voltage.data.datasets[0].data = data
  chart_voltage.update();
}
if (!chartinterval) {
  chartinterval = setInterval(() => {
      updateChartvoltage(volt_out);
  }, 1000);
}
////////////////////////////////////////////////////////////////////////////////////////////////

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var slider1 = document.getElementById("myRange1");
var output1 = document.getElementById("demo1");
output.innerHTML = slider.value;
output1.innerHTML = slider1.value;
slider.oninput = function() {
  output.innerHTML = this.value;
  database.ref("Control/VIRTUAL SET POINT").update({"data" : this.value});
  
}
slider1.oninput = function() {
  output1.innerHTML = this.value;
  database.ref("Control/O VALUE").update({"data" : this.value});
  database.ref("Control/VIRTUAL RUN CM").update({"data" : 2});
}
//////////////////////////////////////////////////////////////////////////////////////////
database.ref("Control/VIRTUAL SET POINT/data").on("value", function (snapshot) {
  var comingValue = snapshot.val();
  var slider = document.getElementById("myRange");
  slider.value = comingValue;
  output.innerHTML = slider.value;
  var changeEvent = new Event("change");
  slider.dispatchEvent(changeEvent);
})
database.ref("Control/O VALUE/data").on("value", function (snapshot) {
  var comingValue = snapshot.val();
  var slider = document.getElementById("myRange1");
  slider.value = comingValue;
  output1.innerHTML = slider.value;
  var changeEvent = new Event("change");
  slider.dispatchEvent(changeEvent);
})

///////////////////////////////////////////////////////////////////////////////////////////////
database.ref("Monitor/RELAY OUTPUT/data").on("value", function (snapshot) {
  var water = snapshot.val();
  if (water == 1)
    {
      document.getElementById("water-flow").style.display = "block";
    }
  else document.getElementById("water-flow").style.display = "none";
});
database.ref("Control/VIRTUAL RUN CM/data").on("value", function (snapshot) {
  var run_cmd=snapshot.val();
  if (run_cmd == 2) document.getElementById("air-flow").style.display = "block";
  else document.getElementById("air-flow").style.display = "none";
})


database.ref("Monitor/CPS-A/data").on("value", function(snapshot){
  var pres = snapshot.val();
  document.getElementById("apsuat").innerHTML = pres;
  if (pres > 80 ) document.getElementById("call").innerHTML = "Filter dirty !!";
  else document.getElementById("call").style.display = "none";
})
database.ref("Control/VIRTUAL OV VALVE/data").on("value", function(snapshot){
  var led_valve = snapshot.val();
  if(led_valve==1){
    document.getElementById("circle-on").classList.remove("disabled");
    document.getElementById("circle1-on").classList.remove("disabled");
    document.getElementById("circle-off").classList.add("disabled");
    document.getElementById("circle1-off").classList.add("disabled");
    }
  else{
    
    document.getElementById("circle-on").classList.add("disabled");
    document.getElementById("circle1-on").classList.add("disabled");
    document.getElementById("circle-off").classList.remove("disabled");
    document.getElementById("circle1-off").classList.remove("disabled");
      }
})
database.ref("Monitor/SPEED/data").on("value", function(snapshot){
  var speed_fan = snapshot.val();
  document.getElementById("speed").innerHTML = speed_fan;
})

// get CURRENT from firebase (auto update when data change)
database.ref("Monitor/CURRENT/data").on("value", function(snapshot){
  var current_fan = snapshot.val();
  document.getElementById("current").innerHTML = current_fan;
})
// get VOLTAGE from firebase (auto update when data change)
database.ref("Monitor/VOLTAGE/data").on("value", function(snapshot){
  var volt_out = snapshot.val();
  document.getElementById("voltage").innerHTML = volt_out;
  // document.getElementById("voltage-concac").innerHTML =volt_out;
})
// get POWER from firebase (auto update when data change)
database.ref("Monitor/POWER/data").on("value", function(snapshot){
  var power_fan = snapshot.val();
  document.getElementById("power").innerHTML = power_fan;
}) 

 // get TEMP LON from firebase (auto update when data change)
 database.ref("Monitor/Thermos-temp/data").on("value", function(snapshot){
  var thermos_temp = snapshot.val();
  document.getElementById("themotat").innerHTML = thermos_temp/10;
}) 
 // get tân só  from firebase (auto update when data change)
 database.ref("Monitor/OUT FRQ/data").on("value", function(snapshot){
  var frequency = snapshot.val();
  document.getElementById("frq-value").innerHTML = frequency;
}) 
database.ref("Control/VIRTUAL SET POINT/data").on("value", function(snapshot){
  var set_point = snapshot.val();
  document.getElementById("set-point-display").innerHTML =  set_point;
})

database.ref("Control/ON OFF THERMOSTAT/data").on("value", function(snapshot){
  var onoffthermostat = snapshot.val();
  var water_flow = document.getElementById('water-flow');
  water_flow.src = "anh/water-flow.gif";
  if (onoffthermostat==0)
    {
      document.getElementById("imageCheckbox-thermostat").checked = false;
      document.getElementById("low").disabled = false; 
      document.getElementById("high").disabled = false; 
      document.getElementById("medium").disabled = false; 
      document.getElementById("btnOn").disabled = false; 
      document.getElementById("btnOff").disabled = false; 
      document.getElementById("btn-manual").disabled = false; 
      document.getElementById("btn-auto").disabled = false; 
      document.getElementById("myRange").disabled = false;
      document.getElementById("myRange1").disabled = false;
    }
else
  {
    document.getElementById("imageCheckbox-thermostat").checked = true;
    document.getElementById("low").disabled = true; 
    document.getElementById("high").disabled = true; 
    document.getElementById("medium").disabled = true; 
    document.getElementById("btnOn").disabled = true; 
    document.getElementById("btnOff").disabled = true; 
    document.getElementById("btn-manual").disabled = true; 
    document.getElementById("btn-auto").disabled = true; 
    document.getElementById("myRange").disabled = true;
    document.getElementById("myRange1").disabled = true;
    
  }
  
})

var auto = document.getElementById("box-auto");
var manual = document.getElementById("box-manual");
var honeywell = document.getElementById("box-thermos");
database.ref("Control/O ENABLE/data").on("value", function(snapshot){
  var mode = snapshot.val();
  if(mode==0)
    {
      auto.style.display = "block";
      manual.style.display = "none";
      honeywell.style.display = "none";
    }
  else 
    {
      auto.style.display = "none";
      manual.style.display = "block";
      honeywell.style.display = "none";
    }
})

var btn_low = document.getElementById("low");
btn_low.onclick = function(){
    database.ref("Control/O VALUE").update({"data" : 30});
    database.ref("Control/VIRTUAL RUN CM").update({"data" : 2});
    
}
var btn_medium = document.getElementById("medium");
btn_medium.onclick = function(){
    database.ref("Control/O VALUE").update({"data" : 40});
    database.ref("Control/VIRTUAL RUN CM").update({"data" : 2});
}   
var btn_high = document.getElementById("high");
btn_high.onclick = function(){
    database.ref("Control/O VALUE").update({"data" : 50});
    database.ref("Control/VIRTUAL RUN CM").update({"data" : 2});
}  
var btn_stop = document.getElementById("stop");
btn_stop.onclick = function(){
    // database.ref("Control/O VALUE").update({"data" : 0});
    database.ref("Control/VIRTUAL RUN CM").update({"data" : 1});
    
}        

var btnOn = document.getElementById("btnOn");
var btnOff = document.getElementById("btnOff");
var img1 = document.getElementById("img-van1");
var img2 = document.getElementById("img-van2");

//Get led from firebase (auto update when data change)

var btn_auto = document.getElementById("btn-auto");
btn_auto.onclick = function(){
    database.ref("Control/O ENABLE").update({"data" : 0});
}
var btn_manual = document.getElementById("btn-manual");
btn_manual.onclick = function(){
    database.ref("Control/O ENABLE").update({"data" : 1});
}

var btn_thermos = document.getElementById("btn-thermos");

btnOn.onclick = function(){
    database.ref("Control/VIRTUAL OV VALVE").update({"data" : 1});
}

btnOff.onclick = function(){
    database.ref("Control/VIRTUAL OV VALVE").update({"data" : 0});
}

document.getElementById('run-thuan').addEventListener('click', function(){
  // Lấy giá trị từ các input
    var tanso = document.getElementById('set-frq').value;
    var acc   = document.getElementById('set-acc').value;
    var dec   = document.getElementById('set-dec').value;
  // Gửi dữ liệu mới qua Firebase
  database.ref("Control").update({
    "O VALUE/data": tanso,
    "VIRTUAL ACC/data": acc,
    "VIRTUAL DEC/data": dec,
    "VIRTUAL RUN CM/data": 2,
  });

});
/////////////////////////////////////////////////////////////////////////////////////
firebase.database().ref("Control/O VALUE/data").on("value", (snapshot) => {
  var tanso_frq = snapshot.val();
  updateSetpointDisplay(tanso_frq);
});
function updateSetpointDisplay(value) {
  var tanso = document.getElementById("set-frq");
  tanso.value = value;
}
/////////////////////////////////////////////////////////////////////////////////////
firebase.database().ref("Control/VIRTUAL ACC/data").on("value", (snapshot) => {
  var tocdo_acc = snapshot.val();
  updateSetpointDisplay1(tocdo_acc);
});
function updateSetpointDisplay1(value) {
  var acc = document.getElementById("set-acc");
  acc.value = value;
}
/////////////////////////////////////////////////////////////////////////////////////
firebase.database().ref("Control/VIRTUAL DEC/data").on("value", (snapshot) => {
  var tocdo_dec = snapshot.val();
  updateSetpointDisplay2(tocdo_dec);
});
function updateSetpointDisplay2(value) {
  var dec = document.getElementById("set-dec");
  dec.value = value;
}
//////////////////////////////////////////////////////////////////////////////////////  suar
// ///////-----////------NHAP GIA TRI SET POINT ---------////////-------------------///////////////
document.getElementById('submit-setpoint').addEventListener('click', function(event){
  // Prevent the default form submission
  event.preventDefault();

  // Lấy giá trị từ các input
  var setpoint_temp = document.getElementById('set-point-value').value;
  // Gửi dữ liệu mới qua Firebase
  database.ref("Control").update({
      "VIRTUAL SET POINT/data": setpoint_temp

  });
});

//////////////////////////////////////////////////////////////////////

//ĐƯA DỮ LIỆU SETPOINT TỪ FIREBASE VỀ HIỂN THỊ TRÊN KHUNG SETPOINT NHIỆT ĐỘ
firebase.database().ref("Control/VIRTUAL SET POINT/data").on("value", (snapshot) => {
  var setpointValuetemphienthi = snapshot.val();
  updateSetpointDisplay3(setpointValuetemphienthi);
});

///// LẤY GIÁ TRỊ SETPOINT TỪ FIREBASE VỀ HIỂN THỊ TRÊN WEB
function updateSetpointDisplay3(value) {
  var setpointElement = document.getElementById("set-point-value");
  setpointElement.value = value;
}


///////////////////////////////////////////////////////////////////
// ----------------------------------STOP STOP STOP STOP STOP STOP STOP STOP -------------
document.getElementById('run-stop').addEventListener('click', function()
{
  database.ref("Control/VIRTUAL RUN CM").update({"data" : 1})
    // event3.preventDefault();      
    
})












// /////------------------------------------- THERMOSTAT  ON- OFF----------------------///////////////////////////////////
function toggleImage() {
  var checkbox_thermostat = document.getElementById('imageCheckbox-thermostat');
  if (checkbox_thermostat.checked) {
      database.ref("Control/ON OFF THERMOSTAT").update({"data" : 1});
      document.getElementById("submit-setpoint").disabled = true;
      document.getElementById("submit-setpoint").disabled = true;
      database.ref("Control/STATUS/data").on("value", function (snapshot) {
        status_thermos = snapshot.val();
        if(status_thermos==2) 
          {
            document.getElementById('status-thermos').src="hinh/thermostat status.png";
            database.ref("Control").update({"VIRTUAL RUN CM/data": 2})
          }
          else if(status_thermos==1) 
          {
            document.getElementById('status-thermos').src="hinh/thermostat status1.png" ;
            database.ref("Control").update({"VIRTUAL RUN CM/data": 2})
          }
          else  if(status_thermos==0) 
          {
            document.getElementById('status-thermos').src="hinh/thermostat status2.png";
            database.ref("Control").update({"VIRTUAL RUN CM/data": 2})
          }
          else if(status_thermos==3) 
          {
            document.getElementById('status-thermos').src="hinh/thermostat status3.png";
            
          }
          
      });
      
  } else 
  {
      database.ref("Control/ON OFF THERMOSTAT").update({"data" : 0});
      document.getElementById("submit-setpoint").disabled = false;
  }
}



function fan(){
  const frq_monitor = database.ref("Control/O VALUE/data")
  const run_cm      = database.ref("Control/VIRTUAL RUN CM/data");
  Promise.all([frq_monitor.get(), run_cm.get()])
          .then((snapshots) => {
              const frqData   = snapshots[0].val();
              const runCmData = snapshots[1].val();
              if ((frqData > 0 && runCmData == 2) )
                {
                  document.getElementById("air-flow").src ="anh/air-flow.gif" 
                }
              else if (frqData == 0 || runCmData == 1  )
                {
                  document.getElementById("air-flow").src ="" 
                }
          })
        }



