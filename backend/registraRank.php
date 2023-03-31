<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include_once("conexaoMySQL.php");
include_once("utils.php");

//$ip =  $_SERVER['REMOTE_ADDR'];

$pontos = soNumerosDaString($_POST['pontos']);
$nome = protegeQuery($_POST['nome']);

$resultadoNome = mysqli_query($conn, "SELECT * FROM rank_tirolildo WHERE nome = '$nome'");

$qtdRegistros = mysqli_num_rows($resultadoNome);

//verifica se ja existe o nome na tabela
if($qtdRegistros < 1){
    if(isset($_POST['nome']))
        $resultadoIP = mysqli_query($conn, "INSERT INTO rank_tirolildo(nome, pontos) VALUES('$nome', $pontos)");  
    
} 
else $resultadoIP = mysqli_query($conn, "UPDATE rank_tirolildo SET pontos=$pontos WHERE nome='$nome' and pontos < $pontos");  

?>