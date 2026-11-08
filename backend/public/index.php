<?php
header ('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$aulas =[
    [
        "id" => 1,
        "nombre" => "Aula de Informática",
        "capacidad" => 30
    ],
    [
        "id" => 2,
        "nombre" => "Laboratorio de Informática",
        "capacidad" => 20
    ],
    [
        "id" => 3,
        "nombre" => "Taller de Informática",
        "capacidad" => 10
    ],
    [
        "id" => 4,
        "nombre" => "Aula autobus",
        "capacidad" => 40
    ],
    [
        "id" => 5,
        "nombre" => "Aula de 2º DAW",
        "capacidad" => 30
    ],
];

echo json_encode($aulas, JSON_UNESCAPED_UNICODE);

?>