<?php
$requestData = json_decode(file_get_contents("php://input")); 

$chapter = $requestData->chapter;
$pname = $requestData->pname;

// Concatenate an API URL including all parameters inline
$api_url = "https://www.data.qld.gov.au/api/3/action/datastore_search?resource_id=8a327cf9-cff9-4b34-a461-6f883bdc3a48&limit=2000&q='street'";

$cache_filename = "cache/slq-cache.json";

//$toowongPic = "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=100969&custom_att_3=NLA";
//$miltionPic = "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=114045&custom_att_3=NLA";
//$queenStPic = "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=104689&custom_att_3=NLA";
//$newFarmPic = "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=113425&custom_att_3=NLA";

$answerList = array(
    "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=100969&custom_att_3=NLA",
    "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=114045&custom_att_3=NLA",
    "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=104689&custom_att_3=NLA",
    "http:\/\/bishop.slq.qld.gov.au:80\/webclient\/DeliveryManager?pid=113425&custom_att_3=NLA"
);

if(file_exists($cache_filename)) { // Cache file exists
    $slqData = file_get_contents($cache_filename);
}
else { // Cache file doesn"t exist, let"s create one
    $slqData = file_get_contents($api_url);
    file_put_contents($cache_filename, $data);
}

// Decode the JSON provided by the API
$slqData = json_decode($slqData, true);
$photoData = $slqData["result"]["records"];

$chapterData = file_get_contents("cache/story.json");

$requestChapterData = $chapterData[$chapter-1];

$photoBlackList = array(
    "http://bishop.slq.qld.gov.au:80/webclient/DeliveryManager?pid=15055&custom_att_3=NLA",
);

function getRandPhoto($photoBlackList) {
    $randPhoto = $photoData[Rand(0,2000)]["1000_pixel_jpg"];
    foreach($photoBlackList as $key => $val) {
        while($val == $randPhoto) {
            $randPhoto = $photoData[Rand(0,2000)]["1000_pixel_jpg"];
        }
    }
    return $randPhoto;
}

$requestChapterData->photo = array(
    (object)["url"=>getRandPhoto(), "type"=>"false"],
    (object)["url"=>getRandPhoto(), "type"=>"false"],
    (object)["url"=>getRandPhoto(), "type"=>"false"],
    (object)["url"=>$answerList[$chapter-1], "type"=>"true"],
)

shuffle($requestChapterData->photo);

echo json_encode($requestChapterData);


?>
