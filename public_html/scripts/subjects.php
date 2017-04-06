<?php
	include 'mysqli_db.php';
	//error_reporting(E_ERROR | E_PARSE);
	date_default_timezone_set ('GMT');
	header('Content-Type: application/json; charset=utf-8');
	$method = $_SERVER['REQUEST_METHOD'];
	$link = connect();
	$request = parse_request($link);
	switch($method){
		case 'GET':{
			$query = "SELECT * FROM Subjects;";
			$res = query($query, $link);
			$rowNum = num_rows($res); $nowRow = 0;
			header('HTTP/1.1 200 OK');
			echo "[";
			while ($row = fetch_array($res))
			{
				echo json_encode($row);
				if (++$nowRow!=$rowNum){
					echo ",";
				}
			}
			echo "]";
		} break;
		case 'POST':{
			$title=real_escape_string($link, $_POST["title"]);
			$query = "INSERT Subjects(Title, Description) VALUES ('$title', '$title')";
			$res = query($query);
			if (!$res){
				header('HTTP/1.1 500 Internal Server Error');
				$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
				echo json_encode(array("error"=>$error));
				die();
			}
			$id = insert_id();
			header('HTTP/1.1 201 Created');
			echo json_encode(array('id' => $id));
		} break;
		default:{
			header('HTTP/1.1 405 Method Not Found');
			echo json_encode(array("error"=>"Метод не поддерживается сервером"));
		}break;
	}
	close($link);
?>
