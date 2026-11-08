<?php

// Ruta de la base de datos: variable de entorno o valor por defecto
$rutaBd = getenv('DB_PATH') ?: __DIR__ . '/../../data/aulareserva.sqlite';

// Si el archivo no existe, avisamos en lugar de crear una base de datos vacía
if (!file_exists($rutaBd)) {
    throw new RuntimeException("No existe la base de datos en: $rutaBd");
}

$pdo = new PDO('sqlite:' . $rutaBd);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec('PRAGMA foreign_keys = ON');

return $pdo;