<?php
require 'vendor/autoload.php';

use MongoDB\Driver\ServerApi;

$uri = 'mongodb+srv://celtadiego:CeltaVigo9@clase.dznbv.mongodb.net/?retryWrites=true&w=majority&appName=Clase';

$apiVersion = new ServerApi(ServerApi::V1);

$client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);

$database = $client->selectDatabase('Snake');
$collection = $database->selectCollection('snake');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["error" => "Datos no válidos o mal formateados."]);
    exit;
}

if (!empty($data['nombre']) && isset($data['puntuacion'])) {
    $nombre = trim($data['nombre']);
    $puntuacion = (int)$data['puntuacion'];

    if (strlen($nombre) == 3 && $puntuacion >= 0) {
        try {
            $resultado = $collection->insertOne([
                'Nombre' => $nombre,
                'Puntuacion' => $puntuacion
            ]);

            if ($resultado->getInsertedCount() == 1) {
                echo json_encode([
                    "mensaje" => "Puntuacion guardada",
                    "nombre" => $nombre,
                    "puntuacion" => $puntuacion
                ]);
            } else {
                echo json_encode(["error" => "Error al guardar en la base de datos."]);
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            echo json_encode(["error" => "Error en la base de datos: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["error" => "El nombre debe tener 3 caracteres y la puntuación debe ser positiva."]);
    }
} else {
    echo json_encode(["error" => "Datos no válidos."]);
}
?>
