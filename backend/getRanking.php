<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include_once("conexaoMySQL.php");
include_once("utils.php");

$resultadoRanks = mysqli_query($conn, "SELECT * FROM rank_tirolildo ORDER BY pontos DESC LIMIT 10");

$rank = array();
$colocacao = 1;
foreach($resultadoRanks as $tupla){
    array_push($rank, ["rank"=>$colocacao, "nome"=>$tupla['nome'], "pontos"=>$tupla['pontos']] );
    $colocacao++;
}

echo json_encode($rank);
exit();

?>