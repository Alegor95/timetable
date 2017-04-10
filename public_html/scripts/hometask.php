<?php
include 'mysqli_db.php';
error_reporting(E_ERROR | E_PARSE);
date_default_timezone_set ('GMT');
header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD'];
$link = connect();
$request = parse_request($link);
	switch ($method){
		case 'GET':{
			$id = $request[0];
			switch ($id){
				case 'lesson':{
					$lessonId = $request[1];
					$query = "SELECT ID,Name,Description,CompletionDate FROM Hometask WHERE LessonId=$lessonId AND RemovedAt IS NULL";
					$res = query($query, $link);
					if (!$res){
						header('HTTP/1.1 500 Internal Server Error');
						$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
						echo json_encode(array("error"=>$error));
						die();
					}
					header('HTTP/1.1 200 OK');
					echo "[";
					$rowCount = num_rows($res); $nowRow = 0;
					while ($row = fetch_assoc($res)){
						echo json_encode($row);
						if (++$nowRow<$rowCount) echo ",";
					}
					echo "]";
				} break;
				default: {
					if (is_numeric($id)){
						$query = "SELECT ID,Name,Description,CompletionDate FROM Hometask WHERE ID=$id";
						$res = query($query, $link);
						if (!$res){
							header('HTTP/1.1 500 Internal Server Error');
							$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
							echo json_encode(array("error"=>$error));
							die();
						}
						$row = fetch_assoc($res);
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
				$title = real_escape_string($link, $_POST["title"]);
				$compDate = real_escape_string($link, $_POST["compDate"]);
				$lessonId = real_escape_string($link, $_POST["lessonId"]);
				$compDate = date('Y-m-d H:i:s', $compDate);
				$query = "INSERT INTO Hometask (Name, Description, CompletionDate, LessonId) VALUES ('$title', '$title', '$compDate', $lessonId)";
				$res = query($query, $link);
				if (!$res){
					header('HTTP/1.1 500 Internal Server Error');
					$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
					echo json_encode(array("error"=>$error));
					die();
				} else {
					header('HTTP/1.1 201 Created');
					$id = insert_id($link);
					echo json_encode(array("id" => $id));
				}
			} if ($request[1] == 'delete'){
				$id = $request[0];
				$date = date('Y-m-d H:i:s');
				$query = "UPDATE Hometask SET RemovedAt='$date' WHERE ID=$id";
				$res = query($query, $link);
				if (!$res){
					header('HTTP/1.1 500 Internal Server Error');
					$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
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
			$res = query($query, $link);
			if (!$res){
				header('HTTP/1.1 500 Internal Server Error');
				$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
				echo json_encode(array("error"=>$error));
				die();
			} else {
				header("HTTP/1.1 205 Reset Content");
			}
		}
	}
	close($link);
?>
