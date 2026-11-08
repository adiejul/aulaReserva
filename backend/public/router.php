<?php

$ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. La API la gestiona index.php
if (str_starts_with($ruta, '/api/')) {
    require __DIR__ . '/index.php';
    return;
}

// 2. Lo demás son archivos del frontend
$frontend = realpath(__DIR__ . '/../../frontend');
$archivo = realpath($frontend . ($ruta === '/' ? '/index.html' : $ruta));

if ($archivo === false || strpos($archivo, $frontend) !== 0 || !is_file($archivo)) {
    http_response_code(404);
    echo 'No encontrado';
    return;
}

$tipos = [
    'html' => 'text/html; charset=utf-8',
    'js'   => 'text/javascript; charset=utf-8',
    'css'  => 'text/css; charset=utf-8',
];
$extension = pathinfo($archivo, PATHINFO_EXTENSION);
header('Content-Type: ' . ($tipos[$extension] ?? 'application/octet-stream'));
readfile($archivo);