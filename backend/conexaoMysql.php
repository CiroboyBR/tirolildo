<?php
$servidor = "127.0.0.1";
$usuario = "USUARIO";
$banco = "NOME_BANCO";
$senha = "SENHA";

//cria conexao
$conn = mysqli_connect($servidor, $usuario, $senha, $banco);

mysqli_character_set_name($conn);

/* change character set to utf8m */
mysqli_set_charset($conn, "utf8");
mysqli_character_set_name($conn);
?>