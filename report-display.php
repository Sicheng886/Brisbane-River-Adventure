<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>About - Brisbane River Advanture</title>
    <link href="https://fonts.googleapis.com/css?family=Titillium+Web&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <nav>
        <a href="index.html">Home</a>
        <a href="gallery.html">Gallery</a>
        <a href="about.html">About</a>
    </nav>

    <main>
    <?php
    $cache_filename = "cache/report-cache.json";

    if(file_exists($cache_filename)) { // Cache file exists
        $data = json_decode(file_get_contents($cache_filename));
        foreach($data as $val) {
            echo "<div class='report-div'>
                    <h2>Chapter: ".$val->chapter."</h2>
                    <h3>Pic links: </h3>
                    <ul>";

            foreach($val->pic as $pic) {
                echo "<li>".$pic."</li>";
            }
                
            echo "</ul>
                    <h3>Probelm description:</h3>
                    <p>".$val->description."</p>
                </div>";
        }
    }
    else { // Cache file doesn"t exist, let"s create one
        echo "<h1>No Reourt yet now</h1>";
    }


    ?>
    

    </main>
</body>