<?php

	if (isset($_GET['term'])) $term = $_GET['term'];
	if (isset($_GET['location'])) $location = $_GET['location'];
	if (isset($_GET['latitude'])) $latitude = $_GET['latitude'];
	if (isset($_GET['longitude'])) $longitude = $_GET['longitude'];

	$URL = "";

	if (!empty($term) && !empty($location))
		$URL = "https://api.yelp.com/v3/businesses/search?term=".$term."&location=".$location."&limit=5";
	else if (!empty($term) && !empty($latitude) && !empty($longitude))
		$URL = "https://api.yelp.com/v3/businesses/search?term=".$term."&latitude=".$latitude."&longitude=".$longitude."&limit=5";

	if ($URL != "") {
		$curl = curl_init();

		curl_setopt_array($curl, array(
		  CURLOPT_URL => $URL,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => "",
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 30,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => "GET",
		  CURLOPT_POSTFIELDS => "client_id=_JI3YdKhFxlJ6DeDforTBA&client_secret=KggJyQRD2KguIM6YoXdqrXpB7YSwJoX7mH4F97s7A8Wv36Z5ih9AC0QTFwKE9wkp&grant_type=client_credentials", //replace with actual app credentials
		  CURLOPT_HTTPHEADER => array(
		    "authorization: Bearer xxxx", //replace with actual authorization token
		    "cache-control: no-cache",
		    "content-type: application/x-www-form-urlencoded",
		    "postman-token: ca74b7ea-3a6f-593e-fd50-151116909efc"
		  ),
		));
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //don't require an SSL connection
		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		if ($err) echo "cURL Error #:" . $err;
		else echo $response;
	}
	else
		echo "Problem with URL!";
?>
