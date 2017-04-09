<?php
	include 'mysqli_db.php';
	error_reporting(E_ERROR | E_PARSE);
	date_default_timezone_set ('GMT');
	header('Content-Type: application/json; charset=utf-8');
	$method = $_SERVER['REQUEST_METHOD'];
	$link = connect();
	$request = parse_request($link);
	switch($method){
		case 'POST':{
			$action = $request[0];
			switch($action){
				case 'login':{
					$email=real_escape_string($link, $_POST["email"]);
					$pass=real_escape_string($link, $_POST["password"]);
					$query = "SELECT ID, Surname, Name, Email, HierarchyId FROM Users WHERE Email='$email' AND PasswordHash='$pass'";
					$res = query($query, $link);
					if (!$res){
						header('HTTP/1.1 500 Internal Server Error');
						$error = mb_convert_encoding(error(), 'utf-8', 'windows-1251');
						echo json_encode(array("error"=>$error));
						die();
					}
					$rowNum = num_rows($res); $nowRow = 0;
					if ($rowNum>0){
						while ($row=fetch_array($res, ASSOC)) {
							header('HTTP/1.1 200 OK');
							echo json_encode($row);
						}
					} else {
						header('HTTP/1.1 404 Not found');
						echo json_encode(array("error"=>"User ".$email."/".$pass." not found"));
					}
				} break;
				case 'register':{
					$surname=real_escape_string($link, $_POST["surname"]);
					$name=real_escape_string($link, $_POST["name"]);
					$email=real_escape_string($link, $_POST["email"]);
					$hash=real_escape_string($link, $_POST["password"]);
					$parentId=real_escape_string($link, $_POST["parentId"]);
					$query="INSERT INTO Users(Surname, Name, Email, PasswordHash, HierarchyId) VALUES('$surname', '$name', '$email', '$hash', '$parentId')";
					$res = query($query, $link);
					if (!$res){
						header('HTTP/1.1 500 Internal Server Error');
						$error = errno()==1062?"E-mail уже занят.":mb_convert_encoding(error(), 'utf-8', 'windows-1251');
						echo json_encode(array("error"=>$error));
						die();
					}
					$id = insert_id();
					close($link);
					header('HTTP/1.1 201 Created');
					echo json_encode(array('result' => 'ok', 'id' => $id));
				}break;
				case 'update':{
					$surname=real_escape_string($link, $_POST["surname"]);
					$name=real_escape_string($link, $_POST["name"]);
					$parentId=real_escape_string($link, $_POST["parentId"]);
					$hash=real_escape_string($link, $_POST["hash"]);
					$email=real_escape_string($link, $_POST["email"]);
					$query = "UPDATE `Users` SET `Surname` = '$surname',`Name` = '$name',`HierarchyId` = '$parentId' WHERE `Email` = '$email' AND `PasswordHash`='$hash';";
					$res = query($query, $link);
					if (!$res){
						header('HTTP/1.1 500 Internal Server Error');
						$error =mb_convert_encoding(error(), 'utf-8', 'windows-1251');
						echo json_encode(array("error"=>$error));
						die();
					}
					close($link);
					header('HTTP/1.1 200 OK');
					echo json_encode(array('result' => 'ok'));
				} break;
				default:{
					header('HTTP/1.1 405 Method Not Supported');
					echo json_encode(array("error" => "Метод не поддерживается сервисом"));
					die();
				} break;
			}
		} break;
		default:{
			header('HTTP/1.1 405 Method Not Supported');
			echo json_encode(array("error" => "Метод не поддерживается сервисом"));
			die();
		}break;
	}
	close($link);
?>
