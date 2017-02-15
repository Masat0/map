var map;
var mode = "testing";
var questions = [];
var store_questions = [];

var questionCode = '';

var countRightAnswer = 0;
var countWrongAnswer = 0;

var complexity = 10;

var countQuestions = 85;
var remainder = countQuestions-1;

var timer = "yes";

var countCheck = 0;

var projection = 'miller';

var rightRegions = [];
var wrongRegions = [];

var prevZoomLevel = 1;

var center = {
  //'mercator': {'longitude' : 104.992, 'latitude': 69.624},
  'winkel3': {'longitude' : 95.2244, 'latitude': 57.6609},
  'eckert3': {'longitude' : 102.6948, 'latitude': 59.4759},
  'eckert5': {'longitude' : 101.6643, 'latitude': 59.4752},
  'eckert6': {'longitude' : 97.3488, 'latitude': 55.3398},
  'miller': {'longitude' : 104.9948, 'latitude':  63.3411},
  'equirectangular': {'longitude' : 104.9948, 'latitude':  59.4757}
};

function getRandom(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}



function regionClicked(event) {
  //console.log(event.mapObject.id);
  if(mode == "testing" && event.mapObject.id) {
    if(questionCode == event.mapObject.id) {
       countRightAnswer++;
       rightRegions.push(questionCode);
       //if(complexity <= 5) {
        var area = event.mapObject;
        if(complexity <= 5) {
          area.showAsSelected = true;
          area.selectedColor = 'green';
          area.color = 'green';
          area.colorReal = area.color;
          area.rollOverColor = 'green';
          area.validate();
        } else {
          // проверить, нужно ли иначе
          area.color = '#FFE680';
          area.selectedColor = undefined;
          area.colorReal = area.color;
          area.rollOverColor = '#FFEE50';
          area.validate();
          area.showAsSelected = false;
        }
        //area.validate();
        event.chart.returnInitialColor(area);

    } else {
      countWrongAnswer++;
      wrongRegions.push(questionCode);
      var area = map.getObjectById(questionCode);
      if(complexity <= 4) {
        area.showAsSelected = true;
        area.selectedColor = 'red';
        area.color = 'red';
        area.colorReal = area.color;
        area.rollOverColor = 'red';
        area.validate();
      } else {
        // проверить, нужно ли иначе
          area.color = '#FFE680';
          area.colorReal = area.color;
          area.selectedColor = undefined;
          area.rollOverColor = '#FFEE50';
          area.showAsSelected = false;
          area.validate();        
        
      }
        //area.validate();
      event.chart.returnInitialColor(event.mapObject);

    }
    $( "#countRight" ).html(countRightAnswer);
    $( "#countWrong" ).html(countWrongAnswer);
    $( "#remainder" ).html(remainder);
    $( "#percent" ).html(parseFloat(countRightAnswer/countQuestions*100).toFixed(2)+' %');
    getQuestion();
  }
}


function getQuestion() {

  if(questions.length == 0) {
    stopTest();
    return;
  }
  index = getRandom(0, questions.length);
  q = questions[index];
  questionCode = q.id;
  
  map.clearLabels();
  
  $("#question").html('Где находится <span class="region">'+q.title+'</span>?');
  questions.splice(index, 1);
  remainder--;
  
}

function stopTest() {
  $("#time").stopTime('test');

  $( "#amountRight" ).html(countRightAnswer);
  $( "#amountAll" ).html(countQuestions);
  $( "#percentRight" ).html(parseFloat(countRightAnswer/countQuestions*100).toFixed(2)+' %');

  
  $( function() {
    $( "#dialog" ).dialog({
      modal: true,
      width: 400,
      buttons: {
        "Еще раз": function() {
          mode = "testing";
          initTest();
          $( this ).dialog( "close" );
          map.validateData();
        },
        "Показать ответы": function() {
          console.log(rightRegions);
          console.log(wrongRegions);
          rightRegions.forEach(function (element, index, array){
              var area = map.getObjectById(element);
              area.color = 'green';
              area.colorReal = area.color;
              area.rollOverColor = 'green';
              area.validate();
          });
          wrongRegions.forEach(function (element, index, array){
            //console.log(element);
              var area = map.getObjectById(element);
              area.color = 'red';
              area.colorReal = area.color;
              area.rollOverColor = 'red';
              area.validate();
          });
          //map.areaSettings.rollOverColor = undefined;
          mode = "showing_answer";
          map.validateData();
          $( this ).dialog( "close" );
        },
        "Закрыть": function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });
}

function initTest() {
  if(mode == "testing") {
    countRightAnswer = 0;
    countWrongAnswer = 0;
    remainder = countQuestions;
    $( "#countRight" ).html(countRightAnswer);
    $( "#countWrong" ).html(countWrongAnswer);
    $( "#remainder" ).html(remainder);
    $( "#percent" ).html(parseFloat(countRightAnswer/countQuestions*100).toFixed(2)+' %');

    questions = [];
    
    store_questions.forEach(function (element, index, array){
      questions.push({'id': element.id, 'title': element.title});
      var area = map.getObjectById(element.id);
      if(area) {
        area.showAsSelected = false;
        area.color = '#FFE680';
        area.selectedColor = undefined;
        area.colorReal = area.color;
        area.rollOverColor = '#FFEE50';
        area.validate();
      }
    });
    rightRegions = [];
    wrongRegions = [];
    getQuestion();
  }
  if(timer == "yes") {
    $("#time").stopTime('test');
    $("#time").everyTime(1000, 'test', function(i) {
      var minute = Math.floor(i/60);
      var sec = (i-60*minute);
      $(this).text((minute < 10 ? '0'+minute : minute) + ':' + (sec < 10 ? '0' + sec : sec));
    });
  }
}

function zoomCompleted(obj) {
  //console.log(obj);

    //console.log(map.zoomLevel());
    //console.log(map.zoomLongitude());
    //console.log(map.zoomLatitude());      
  if(map.zoomLevel() == 1) {
    
    if(center[projection]) {
      map.zoomToLongLat(1, center[projection].longitude, center[projection].latitude);
    }
  }
}

AmCharts.ready(function() {
    map = new AmCharts.AmMap();

    map.balloon.color = "#000000";
    map.projection = projection;
    SVG = AmCharts.maps.russiaHigh;
    
    SVG.svg.g.path.forEach(function (element, index, array){
      store_questions.push({'id': element.id, 'title': element.title});
    });

    var dataProvider = {
      mapVar: SVG,
      getAreasFromMap:true
    };

    map.dataProvider = dataProvider;
    
    //console.log(map.dataProvider);

    map.areasSettings = {
      autoZoom: false,
      "selectable": true,
      "balloonText": "",
      "selectedColor": undefined,
      "color": '#FFE680',
      "rollOverColor": '#FFEE50',
      "rollOverOutlineColor": '#DDDD50'
    };
    
    //FFE680 FFE7A9
    
    map.mouseWheelZoomEnabled = true;
    map.zoomDuration = 0;
    map.zoomControl.zoomControlEnabled = false;
    
    map.zoomControl.minZoomLevel = 1;
    map.zoomControl.maxZoomLevel = 8;
    
    map.addListener("zoomCompleted", zoomCompleted);
    map.addListener("rendered", mapRendered);
    map.dragMap = false;
    map.backgroundZoomsToTop = true;
    

        
    map.addListener("clickMapObject", regionClicked);
    //map.smallMap = new AmCharts.SmallMap();
    
    

    function mapRendered() {
    }
    
    map.balloonLabelFunction = function(mapObject, ammap) {
      if(mode == "learning" || mode == "showing_answer") {
        return mapObject.title;
      } else {
        return "";
      }
    };


  $( function() {
    $( "#intro" ).dialog({
      modal: true,
      width: 400,
      buttons: {
        "Начать тест": function() {
          initTest();
          $( this ).dialog( "close" );
        },
        "Перейти к настройкам": function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });
    //initTest();
});


$( function() {
  $( document ).ready(function(){

    var h = $( document ).height();
    var w= $( document ).width();
 
    $( "#mapdiv" ).height(h-120);
    map.write("mapdiv");
    //map.validateData();
  });

  $( "#mode" ).selectmenu({
    change: function( event, ui ) {
      mode = $( "#mode" ).val();
//      map.clearLabels();
      if(mode == "testing") {
        //initTest();
        $( "#testing_settings" ).show();
        $( "#testing" ).show();
        $( "#question" ).show();

        //$( function() {
          //$( "#intro" ).dialog({
            //modal: true,
            //width: 400,
            //buttons: {
              //"Начать тест": function() {
                //initTest();
                //$( this ).dialog( "close" );
              //},
              //"Перейти к настройкам": function() {
                //$( this ).dialog( "close" );
              //}
            //}
          //});
        //});        
      } else {
        $("#time").stopTime('test');

        $( "#countRight" ).html(0);
        $( "#countWrong" ).html(0);
        $( "#remainder" ).html(countQuestions);
        $( "#percent" ).html('0.00 %');
        $( "#time" ).html('00:00');
        $( "#question" ).html('&nbsp;');
        
        store_questions.forEach(function (element, index, array){
          var area = map.getObjectById(element.id);
          if(area) {
            area.showAsSelected = false;
            area.color = '#FFE680';
            area.selectedColor = undefined;
            area.colorReal = area.color;
            area.rollOverColor = '#FFEE50';
            area.validate();
          }
        });
          
        $( "#testing_settings" ).hide();
        $( "#testing" ).hide();
        $( "#question" ).hide();
      }
      map.validateData();
    }
  });

  $( "#complexity" ).selectmenu({
    change: function( event, ui ) {
      complexity = $( "#complexity" ).val();
      if(mode == "testing") {
        map.areasSettings.selectedColor = (complexity <= 5 ? 'green' : undefined);
      }
      map.validateData();
    }
  });
      
  $( "#projection" ).selectmenu({
    change: function( event, ui ) {
      map.projection = $( "#projection" ).val();
      projection = $( "#projection" ).val();
      //console.log(projection);
        //console.log(map.zoomLongitude());
        //console.log(map.zoomLatitude());      
      map.validateData();
      //if(projection == "mercator") {
        //center[projection].longitude = map.zoomLongitude();
        //center[projection].latitude = map.zoomLatitude();
        //console.log(map.zoomLongitude());
        //console.log(map.zoomLatitude());
      //}
    }
  });

  $( "#timer" ).selectmenu({
    change: function( event, ui ) {
      timer = $( "#timer" ).val();
      if(timer == "yes") {
        $( "#time" ).show();
        $( "span.time" ).show();
      } else {
        $("#time").stopTime('test');
        $("#time").text('00:00');
        $( "#time" ).hide();
        $( "span.time" ).hide();        
      }
    }
  });

  $(".right-sidebar input[type=submit]" ).button();
  $( "#start" ).click( function( event ) {
      event.preventDefault();
      //event.stopPropagation();
      if(mode == "showing_answer" || mode == "stopping") {
        mode = "testing";
      }
      if(mode == "testing") {
        initTest();
      }
      map.validateData();
  });
  $( "#end" ).click( function( event ) {
      event.preventDefault();
      if(mode == "testing") {
        stopTest();
        mode = "stopping";
      }
  });    
});
