<?php
	include 'dbConstants.php';
	error_reporting(E_ERROR | E_PARSE);		
	date_default_timezone_set ('GMT');
	header('Content-Type: application/json; charset=utf-8');
	$link = mysql_connect($db_host, $db_user, $db_pass);
	if (!$link) {
		header('HTTP/1.1 500 Internal Server Error'); 
		$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
		if ($error == "") $errror="Ошибка подключения к базе";
		echo json_encode(array("error"=>$error));
		die();
	}
	mysql_set_charset('utf8', $link);
	$method = $_SERVER['REQUEST_METHOD'];
	$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
	foreach ($request as &$value) {
		$value = mysql_real_escape_string($link, $value);
	}
	if (!mysql_select_db($db_name, $link)){
		header('HTTP/1.1 500 Internal Server Error'); 
		$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
		echo json_encode(array("error"=>$error));
		die();
	}
	switch ($method){
		case 'GET':{
			$id = $request[0];
			switch ($id){
				case 'lesson':{
					$lessonId = $request[1];
					$query = "SELECT ID,Name,Description,CompletionDate FROM Hometask WHERE LessonId=$lessonId AND RemovedAt IS NULL";
					$res = mysql_query($query, $link);
					if (!$res){
						header('HTTP/1.1 500 Internal Server Error'); 
						$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
						echo json_encode(array("error"=>$error));
						die();						
					}
					header('HTTP/1.1 200 OK');
					echo "[";
					$rowCount = mysql_num_rows($res); $nowRow = 0;
					while ($row = mysql_fetch_assoc($res)){
						echo json_encode($row);
						if (++$nowRow<$rowCount) echo ",";
					}
					echo "]";
				} break;
				default: {
					if (is_numeric($id)){
						$query = "SELECT ID,Name,Description,CompletionDate FROM Hometask WHERE ID=$id";
						$res = mysql_query($query, $link);
						if (!$res){
							header('HTTP/1.1 500 Internal Server Error'); 
							$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
							echo json_encode(array("error"=>$error));
							die();						
						}
						$row = mysql_fetch_assoc($res);
						if ($row){
							header('HTTP/1.1 200 OK');
							echo json_encode($row);
						} else {
							header('HTTP/1.1 404 Not found');
							echo json_encode(array("error" => "Page not found"));
						}
					}else{
						header('HTTP/1.1 404 Not found');
						echo json_encode(array("error" => "Page not found"));
					}
				} break;
			}
		} break;
		case 'POST':{
			if (!$request[0]){
				$title = mysql_real_escape_string($link, $_POST["title"]);
				$compDate = mysql_real_escape_string($link, $_POST["compDate"]);
				$lessonId = mysql_real_escape_string($link, $_POST["lessonId"]);
				$compDate = date('Y-m-d H:i:s', $compDate);
				$query = "INSERT INTO Hometask (Name, Description, CompletionDate, LessonId) VALUES ('$title', '$title', '$compDate', $lessonId)";
				$res = mysql_query($query, $link);
				if (!$res){
					header('HTTP/1.1 500 Internal Server Error'); 
					$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
					echo json_encode(array("error"=>$error));
					die();
				} else {
					header('HTTP/1.1 201 Created');
					$id = mysql_insert_id();
					echo json_encode(array("id" => $id));
				}	
			} if ($request[1] == 'delete'){
				$id = $request[0];
				$date = date('Y-m-d H:i:s');
				$query = "UPDATE Hometask SET RemovedAt='$date' WHERE ID=$id";
				$res = mysql_query($query, $link);
				if (!$res){
					header('HTTP/1.1 500 Internal Server Error'); 
					$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
					echo json_encode(array("error"=>$error));
					die();
				} else {
					header("HTTP/1.1 205 Reset Content");
				}			
			}else {				
			}
		} break;
		case 'DELETE':{
			$id = $request[0];
			$date = date('Y-m-d H:i:s');
			$query = "UPDATE Hometask SET RemovedAt='$date' WHERE ID=$id";
			$res = mysql_query($query, $link);
			if (!$res){
				header('HTTP/1.1 500 Internal Server Error'); 
				$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
				echo json_encode(array("error"=>$error));
				die();
			} else {
				header("HTTP/1.1 205 Reset Content");
			}
		}
	}
	mysql_close($link);
?>
