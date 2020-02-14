<?php
$requestData = json_decode(file_get_contents("php://input")); 
$startNum = $requestData->startNum;

$api_url = "http://data.qld.gov.au/api/action/datastore_search?resource_id=8a327cf9-cff9-4b34-a461-6f883bdc3a48&limit=2000&q=street";

$cache_filename = "cache/slq-cache.json";

if(file_exists($cache_filename)) { // Cache file exists
    $slqData = file_get_contents($cache_filename);
}
else { // Cache file doesn"t exist, let"s create one
    $slqData = file_get_contents($api_url);
    file_put_contents($cache_filename, $slqData);
}

// Decode the JSON provided by the API
$slqData = json_decode($slqData, true);
$photoData = $slqData["result"]["records"];

$totalPage = ceil(count($photoData)/6);

$responseData = (object)[
    "data"=>array_splice($photoData, $startNum, 6),
    "totalPage"=>$totalPage
];

echo json_encode($responseData);

?>