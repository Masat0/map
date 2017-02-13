var map;
var mode = "testing";
var questions = [];
var store_questions = [];

var questionCode = '';

var countRightAnswer = 0;
var countWrongAnswer = 0;

var complexity = 10;

var countQuestions = 83;
var remainder = countQuestions-1;

var timer = "yes";

var countCheck = 0;

var projection = 'mercator';
var center = {
  'mercator': {'longitude' : 104.992, 'latitude': 69.624},
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
       //if(complexity <= 5) {
        var area = event.mapObject;
        area.showAsSelected = ((complexity <= 5) ? true : false);
        event.chart.returnInitialColor(area);
      //}
    } else {
      countWrongAnswer++;
      //if(complexity <= 5) {
        var area = event.mapObject;
        area.showAsSelected = false;
        event.chart.returnInitialColor(area);
      //}
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
    $( function() {
      $( "#dialog" ).dialog({
        modal: true
      });
    });
  
    //map.addLabel(400, 200, 'Вы знаете регионы России на '+(Math.round(countRightAnswer/(countRightAnswer+countWrongAnswer)*100))+'%', 'left', 20, 'black', 0, 100, true);
    return;
  }
  index = getRandom(0, questions.length);
  q = questions[index];
  questionCode = q.id;
  
  map.clearLabels();
  
  $("#question").html('Где находится <span class="region">'+q.title+'</span>?');
  //map.addLabel(600, 10, 'Где находится '+q.title+' ?', 'left', 14, '#111111', 0, 100, true);
  //map.addLabel(900, 10, ''+countRightAnswer, 'left', 20, 'green', 0, 100, true);
  //map.addLabel(920, 10, ':', 'left', 20, 'black', 0, 100, true);
  //map.addLabel(940, 10, ''+countWrongAnswer, 'left', 20, 'red', 0, 100, true);
  
  questions.splice(index, 1);
  remainder--;
  
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
    console.log(questions);
    console.log(store_questions);
    store_questions.forEach(function (element, index, array){
      questions.push({'id': element.id, 'title': element.title});
    });
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

AmCharts.ready(function() {
    map = new AmCharts.AmMap();

    map.balloon.color = "#000000";

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
      //autoZoom: true,
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
    
    map.zoomControl.maxZoomLevel = 8;
    
    map.addListener("zoomCompleted", zoomCompleted);
    map.dragMap = false;
    map.backgroundZoomsToTop = true;
    

    map.addListener("clickMapObject", regionClicked);
    //map.smallMap = new AmCharts.SmallMap();
    
    function zoomCompleted() {
      if(map.zoomLevel() == 1) {
        
        if(center[projection]) {
          map.zoomToLongLat(1, center[projection].longitude, center[projection].latitude);
        }
      }
    }
    
    map.balloonLabelFunction = function(mapObject, ammap) {
      if(mode == "learning") {
        return mapObject.title;
      } else {
        return "";
      }
    };
    
    initTest();
    
    //map.write("mapdiv");
    //map.validateData();

});


$( function() {
  $( document ).ready(function(){

    var h = $( document ).height();
    var w= $( document ).width();
 
    $( "#mapdiv" ).height(h-120);
    //$( "#mapdiv" ).width(w-250);
    map.write("mapdiv");
    map.validateData();
  });

  $( "#mode" ).selectmenu({
    change: function( event, ui ) {
      mode = $( "#mode" ).val();
//      map.clearLabels();
      if(mode == "testing") {
        initTest();
        $( "#countRight" ).html(0);
        $( "#countWrong" ).html(0);        
        $( "#testing_settings" ).show();
        $( "#testing" ).show();
        $( "#question" ).show();
      } else {
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
      map.validateData();
      //console.log(map.zoomLongitude());
      //console.log(map.zoomLatitude());
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
  $( "button, input, a" ).click( function( event ) {
      event.preventDefault();
      if(mode == "testing") {
        initTest();
      }
      map.validateData();
  });  
});
