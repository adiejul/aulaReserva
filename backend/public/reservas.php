<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido. Usa POST.']);
    exit;
}

// Leer el JSON que envía el frontend
$datos = json_decode(file_get_contents('php://input'), true);

// Comprobar que existen los cuatro datos
if (empty($datos['aula']) || empty($datos['fecha']) ||
    empty($datos['hora']) || empty($datos['responsable'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

// Todo correcto
http_response_code(201);
echo json_encode(['mensaje' => 'Reserva recibida correctamente']);