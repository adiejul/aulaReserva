<?php
require __DIR__ . '/../src/bootstrap.php';

header('Content-type: application/json; charset=utf-8');

function responder($codigo, $datos)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];
$ruta = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// GET /api/health
if ($ruta === '/api/health' && $metodo === 'GET') {
    responder(200, ['ok' => true]);
}

// GET /api/aulas
if ($ruta === '/api/aulas' && $metodo === 'GET') {
    $aulas = $pdo->query('SELECT id, nombre, capacidad, ubicacion FROM aulas ORDER BY id')
        ->fetchAll(PDO::FETCH_ASSOC);
    responder(200, $aulas);
}

// GET /api/reservas
if ($ruta === '/api/reservas' && $metodo === 'GET') {
    $reservas = $pdo->query('SELECT id, aula_id, fecha, hora, responsable, creado_en FROM reservas ORDER BY fecha, hora')
        ->fetchAll(PDO::FETCH_ASSOC);
    responder(200, $reservas);
}

// POST /api/reservas
if ($ruta === '/api/reservas' && $metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);

    foreach (['aula_id', 'fecha', 'hora', 'responsable'] as $campo) {
        if (empty($datos[$campo])) {
            responder(400, ['error' => "Falta el campo $campo"]);
        }
    }

    $stmt = $pdo->prepare('SELECT id FROM aulas WHERE id = ?');
    $stmt->execute([$datos['aula_id']]);
    if (!$stmt->fetch()) {
        responder(404, ['error' => 'El aula no existe']);
    }

    try {
        $stmt = $pdo->prepare('INSERT INTO reservas (aula_id, fecha, hora, responsable) VALUES (?, ?, ?, ?)');
        $stmt->execute([$datos['aula_id'], $datos['fecha'], $datos['hora'], $datos['responsable']]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            responder(409, ['error' => 'Esa aula ya está reservada a esa hora']);
        }
        responder(500, ['error' => 'Error en la base de datos']);
    }

    responder(201, ['id' => (int) $pdo->lastInsertId(), 'mensaje' => 'Reserva creada correctamente']);
}

// DELETE /api/reservas/{id}
if (preg_match('#^/api/reservas/(\d+)$#', $ruta, $m) && $metodo === 'DELETE') {
    $stmt = $pdo->prepare('DELETE FROM reservas WHERE id = ?');
    $stmt->execute([$m[1]]);

    if ($stmt->rowCount() === 0) {
        responder(404, ['error' => 'Reserva no encontrada']);
    }
    responder(200, ['mensaje' => 'Reserva cancelada']);
}

// Cualquier otra ruta
responder(404, ['error' => 'Ruta no encontrada']);
