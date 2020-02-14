<?php
$requestData = json_decode(file_get_contents("php://input")); 

$cache_filename = "cache/report-cache.json";

if(file_exists($cache_filename)) { // Cache file exists
    $data = json_decode(file_get_contents($cache_filename));
}
else { // Cache file doesn"t exist, let"s create one
    $data = array();
}

array_unshift($data, $requestData);

file_put_contents($cache_filename,json_encode($data));

$response = (object)[
    "title" => "Submit Sucessed",
    "content" => "Developing team members will handle this ASAP."
];

echo json_encode($response);

?>