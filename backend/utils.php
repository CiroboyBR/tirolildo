<?php 
function protegeQuery( &$str ) {
    $str = str_replace("'","",$str);
    $str = str_replace("\"","",$str);
    $str = str_replace("(","",$str);
    $str = str_replace(")","",$str);
    $str = str_replace("[","",$str);
    $str = str_replace("]","",$str);
    $str = str_replace("*","",$str);
    $str = str_replace("&","",$str);
    $str = str_replace("%","",$str);
    $str = str_replace("|","",$str);
    $str = str_replace(";","",$str);
    $str = str_replace("-","",$str);

    return $str;
    
}

//recebe uma string e retorna somente numeros
function soNumerosDaString($str){ 
    $res = preg_replace('/[^0-9]/s','',$str);
    return $res;
}


   


?>