var map;
var mode = "testing";
var questions = [];

var questionCode = '';

var countRightAnswer = 0;
var countWrongAnswer = 0;

var complexity = 10;

function getRandom(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function regionClicked(event) {
  if(mode == "testing") {
    if(questionCode == event.mapObject.id) {
       countRightAnswer++;
       if(complexity <= 5) {
        var area = event.mapObject;
        area.showAsSelected = true;
        event.chart.returnInitialColor(area);
      }
    } else {
      countWrongAnswer++;
      if(complexity <= 5) {
        var area = event.mapObject;
        area.showAsSelected = false;
        event.chart.returnInitialColor(area);
      }
    }
    $( "#countRight" ).html(countRightAnswer);
    $( "#countWrong" ).html(countWrongAnswer);
    getQuestion();
  }
}


function getQuestion() {

  if(questions.length == 0) {
    map.addLabel(400, 200, 'Вы знаете регионы России на '+(Math.round(countRightAnswer/(countRightAnswer+countWrongAnswer)*100))+'%', 'left', 20, 'black', 0, 100, true);
    return;
  }
  index = getRandom(0, questions.length);
  q = questions[index];
  questionCode = q.id;
  
  map.clearLabels();
  
  $( "#question" ).html('Где находится '+q.title+' ?');
  //map.addLabel(600, 10, 'Где находится '+q.title+' ?', 'left', 14, '#111111', 0, 100, true);
  //map.addLabel(900, 10, ''+countRightAnswer, 'left', 20, 'green', 0, 100, true);
  //map.addLabel(920, 10, ':', 'left', 20, 'black', 0, 100, true);
  //map.addLabel(940, 10, ''+countWrongAnswer, 'left', 20, 'red', 0, 100, true);
  
  questions.splice(index, 1);
  
}

function initTest() {
  if(mode == "testing") {
    countRightAnswer = 0;
    countWrongAnswer = 0;

    getQuestion();
  }  
}

AmCharts.ready(function() {
    map = new AmCharts.AmMap();

    map.balloon.color = "#000000";

    SVG = AmCharts.maps.russiaHigh;
    
    SVG.svg.g.path.forEach(function (element, index, array){
      questions.push({'id': element.id, 'title': element.title});
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
      "selectedColor": undefined
    };
    
    map.mouseWheelZoomEnabled = true;
    map.zoomDuration = 0;
    
    map.zoomControl.maxZoomLevel = 8;
    
    map.addListener("zoomCompleted", zoomCompleted);
    map.dragMap = false;
    map.backgroundZoomsToTop = true;
    

    map.addListener("clickMapObject", regionClicked);
    //map.smallMap = new AmCharts.SmallMap();
    

    
    function zoomCompleted() {
      if(map.zoomLevel() == 1) {
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
    
    map.write("mapdiv");
    map.validateData();

});


$( function() {

  $( "#mode" ).selectmenu({
    change: function( event, ui ) {
      mode = $( "#mode" ).val();
      map.clearLabels();
      if(mode == "testing") {
        initTest();
      }
      map.validateData();
    }
  });

  $( "#complexity" ).selectmenu({
    change: function( event, ui ) {
      complexity = $( "#complexity" ).val();
      if(mode == "testing") {
        
        map.areasSettings.selectedColor = (complexity <= 5 ? 'green' : undefined);
        initTest();
      }
      map.validateData();
    }
  });
      
  $( "#projection" ).selectmenu({
    change: function( event, ui ) {
      console.log(event);
      map.projection = $( "#projection" ).val();
      map.validateData();
    }
  });

});
