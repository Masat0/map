<?php

$svg = file_get_contents("test6.svg");
preg_match_all("/(\<path[^\/\>]+\/\>)/", $svg, $paths);

function parse_path($str, $id) {

  $rest = preg_replace("/[0-9e\., \-mz]/", "", $str);
  if($rest != "" && preg_replace("/[ML]/", "", $rest) == "") {
    return $str;
  } else if($rest != "") {
    echo "есть $rest в пути id = $id\n";
    exit;
  }
  
  preg_match_all("/(m\s?[\d\.\,\s\-e]+\s?z)/", $str, $contours);
  
  $out = "";
  $lonStart = 0;
  $latStart = 0;
  
  foreach($contours[1] as $contour) {
    $tmp = preg_replace("/^m\s?(.+)/", "$1", $contour);
    $tmp = preg_replace("/(.+)\s?z$/", "$1", $tmp);
    $tmp = trim($tmp);
  
    $arr = explode(" ", $tmp);
    list($lonC, $latC) = explode(",",$arr[0]);
  
    $lonC = floatval($lonC) + $lonStart;
    $lonStart = $lonC;
  
    $latC = floatval($latC) + $latStart;
    $latStart = $latC;
  
    $out .= "M".$lonC.",".$latC;
  
    for($i=1;$i<count($arr); $i++) {
      //if(! $arr[$i]) {
        //echo $i." ".$arr[$i-1]."\n";
      //}
      list($lonN, $latN) = explode(",",$arr[$i]);
      $lonC += floatval($lonN);
      $latC += floatval($latN);
      $out .= "L".$lonC.",".$latC;
    }
    $out .= "z";
  }
  return $out;
}

$js_paths = array();

foreach($paths[1] as $path) {
  preg_match("/ id=\"([^\"]*)\"/", $path, $tmp);
  
  $p = array();
  $p['id'] = ($tmp[1]) ? $tmp[1] : "";
  
  preg_match("/ title=\"([^\"]*)\"/", $path, $tmp);
  $p['title'] = (isset($tmp[1])) ? $tmp[1] : "";
  
  preg_match("/ class=\"([^\"]*)\"/", $path, $tmp);
  $p['class'] = (isset($tmp[1])) ? $tmp[1] : "";  
  
  preg_match("/ d=\"([^\"]*)\"/", $path, $tmp);
  $p['d'] = parse_path($tmp[1], $p['id']);

  preg_match("/ style=\".*fill:(#\d{6}).*\"/", $path, $tmp);
  $p['color'] = (isset($tmp[1])) ? $tmp[1] : "#552233";
  
  array_push($js_paths, $p);
}
$out = file_get_contents("template.js");
$out = preg_replace("/REPLACEDATA/", json_encode($js_paths, JSON_PRETTY_PRINT), $out);
file_put_contents("test6.js", $out);
?>
