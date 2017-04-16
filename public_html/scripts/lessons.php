<?php
	include 'mysqli_db.php';
	//error_reporting(E_ERROR | E_PARSE);
	date_default_timezone_set ('GMT');
	header('Content-Type: application/json; charset=utf-8');
	$method = $_SERVER['REQUEST_METHOD'];
	$link = connect();
	$request = parse_request($link);
	switch ($method){
		case 'GET':{
			$id = $request[0];
			switch ($id){
				case 'hierarchy':{
					$hId= $request[1];
					$query = "SELECT subj.Title, les.ID, les.Room, UNIX_TIMESTAMP(CONVERT_TZ(les.PeriodStart, '+00:00', @@global.time_zone)) as PeriodStart, UNIX_TIMESTAMP(CONVERT_TZ(les.PeriodEnd, '+00:00', @@global.time_zone)) as PeriodEnd, les.LessonTypeId as LessonType, les.RepeatTime FROM Lesson les, Subjects subj WHERE subj.ID = les.SubjectId AND les.RemovedAt is NULL";

					if ($hId){
						$query = $query." AND les.HierarchyId='$hId'";
					}
					$res = query($query, $link);
					$rowNum = num_rows($res); $nowRow = 0;
					header('HTTP/1.1 200 OK');
					echo "[";
					while ($row=fetch_array($res)) {
						echo json_encode($row);
						if (++$nowRow!=$rowNum){
							echo ",";
						}
					}
					echo "]";
				} break;
				case 'repeatDict':{
					$query = "SELECT * FROM LessonRepeat";
					$res = query($query, $link);
					if (!$res){
						header('HTTP/1.1 500 Internal Server Error');
						$error = mb_convert_encoding(db_error($link), 'utf-8', 'windows-1251');
						echo json_encode(array("error"=>$error));
						die();
					}
					$rowNum = num_rows($res); $nowRow = 0;
					header('HTTP/1.1 200 OK');
					echo '[';
					while ($row = fetch_assoc($res)){
						echo json_encode($row);
						if (++$nowRow!=$rowNum){
							echo ',';
						}
					}
					echo ']';
				} break;
				case 'typeDict': {
					$query = "SELECT * FROM LessonType";
					$res = query($query, $link);
					if (!$res){
						header('HTTP/1.1 500 Internal Server Error');
						$error = mb_convert_encoding(db_error($link), 'utf-8', 'windows-1251');
						echo json_encode(array("error"=>$error));
						die();
					}
					$rowNum = num_rows($res); $nowRow = 0;
					header('HTTP/1.1 200 OK');
					echo '[';
					while ($row = fetch_assoc($res)){
						echo json_encode($row);
						if (++$nowRow!=$rowNum){
							echo ',';
						}
					}
					echo ']';
				} break;
				default: {
					header("HTTP/1.1 404 Not found");
					echo json_encode(array("error" => "Страница не найдена"));
				}break;
			}
		} break;
		case 'POST':{
			if (!$request[0]){
				$subject=real_escape_string($link, $_POST["subjectId"]);
				$type=real_escape_string($link, $_POST["lessonType"]);
				$room=real_escape_string($link, $_POST["room"]);
				$start=real_escape_string($link, $_POST["start"]);
				$end=real_escape_string($link, $_POST["end"]);
				$period = real_escape_string($link, $_POST["repeatPeriod"]);
				$hierarchyId=real_escape_string($link, $_POST["hierarchyId"]);
				date_default_timezone_set ('GMT');
				$start=date('Y-m-d H:i:s', $start);
				$end=date('Y-m-d H:i:s', $end);
				$query="INSERT INTO Lesson(SubjectId, HierarchyId, LessonTypeId, Room, PeriodStart, PeriodEnd, RepeatTime) VALUES('$subject','$hierarchyId', '$type', '$room', '$start', '$end', '$period')";
				$res = query($query, $link);
				if (!$res){
					header('HTTP/1.1 500 Internal Server Error');
					$error = mb_convert_encoding(db_error($link), 'utf-8', 'windows-1251');
					echo json_encode(array("error"=>$error));
					die();
				}
				$id = insert_id($link);
				close($link);
				header('HTTP/1.1 201 Created');
				echo json_encode(array('result' => 'ok', 'id' => $id));
			} else if ($request[1] == 'delete'){
				$id=$request[0];
				$date = date('Y-m-d H:i:s');
				$query = "UPDATE Lesson SET RemovedAt='$date' WHERE ID='$id'";
				$res = query($query, $link);
				if (!$res){
					header('HTTP/1.1 500 Internal Server Error');
					$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
					echo json_encode(array("error"=>$error));
					die();
				}
				header('HTTP/1.1 200 OK');
				echo json_encode(array("result" => "ok"));
				die();
			}
			else {
				header('HTTP/1.1 404 Not found');
				echo json_encode(array("error" => "Страница не найдена"));
				die();
			}
		} break;
		case 'DELETE':{
			$id=$request[0];
			$date = date('Y-m-d H:i:s');
			$query = "UPDATE Lesson SET RemovedAt='$date' WHERE ID='$id'";
			$res = query($query, $link);
			if (!$res){
				header('HTTP/1.1 500 Internal Server Error');
				$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
				echo json_encode(array("error"=>$error));
				die();
			}
			header('HTTP/1.1 200 OK');
			echo json_encode(array("result" => "ok"));
			die();
		}break;
		default:{
			header('HTTP/1.1 405 Method Not Supported');
			echo json_encode(array("error" => "Метод не поддерживается сервисом"));
			die();
		}break;
	}
	close($link);
?>
