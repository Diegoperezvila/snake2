<?php
require 'vendor/autoload.php';

use MongoDB\Driver\ServerApi;

try {
    $uri = 'mongodb+srv://celtadiego:CeltaVigo9@clase.dznbv.mongodb.net/?retryWrites=true&w=majority&appName=Clase';

    $apiVersion = new ServerApi(ServerApi::V1);

    $client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);

    $database = $client->selectDatabase('Snake');
    $collection = $database->selectCollection('snake');

    $resultados = $collection->find(
        [],
        ['sort' => ['Puntuacion' => -1], 'limit' => 10]
    );

    foreach ($resultados as $documento) {
        echo $documento['Nombre'] . " - " . $documento['Puntuacion'] . "<br>";
    }

} catch (MongoDB\Driver\Exception\Exception $e) {
    echo "Error de conexión a MongoDB: " . $e->getMessage();
}
?>
