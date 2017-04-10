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
			$id = $request?$request[0]:null;
			switch ($id){
				case 'types':{
					$query = 'SELECT * FROM HierarchyType';
					$res = query($query, $link);
					$rowNum = num_rows($res); $nowRow = 0;
					header('HTTP/1.1 200 OK');
					//Output data
					echo '[';
					if ($res){
						while ($row=fetch_array($res)) {
							//Rember hierarchy type
							if (!$type){
								$type = $row["HierarchyTypeId"];
							}
							echo json_encode(array('ID'=>$row['ID'], 'Name'=>$row['Name']));
							if (++$nowRow != $rowNum) echo ',';
						}
					}
					echo ']';
				} break;
				case 'parentId':{
					$parent = $request[1]?$request[1]:'null';
					$query = 'SELECT ID, Name, HierarchyTypeId FROM Hierarchy ';
					if ($parent == 'null'){
						$query = $query.'WHERE ParentHierarchyId is '.$parent;
					}
					else {
						$query = $query.'WHERE ParentHierarchyId='.$parent;
					}
					$res = query($query, $link);
					$rowNum = num_rows($res); $nowRow = 0;
					header('HTTP/1.1 200 OK');
					//Output data
					echo '[';
					if ($res){
						while ($row=fetch_array($res)) {
							//Rember hierarchy type
							if (!$type){
								$type = $row["HierarchyTypeId"];
							}
							echo json_encode(array(
								'ID'=>$row['ID'],
								'Name'=>$row['Name'],
								'HierarchyTypeId'=>$row['HierarchyTypeId']
							));
							if (++$nowRow != $rowNum) echo ',';
						}
					}
					echo ']';
				} break;
				case 'hierarchyList':{
					$firstId = $request[1];
					$result = array();
					if ($firstId){
						while ($firstId!=null){
							$query = "select id, parentHierarchyId, hierarchyTypeId from Hierarchy where id=$firstId";
							$resp = query($query, $link);
							$res = fetch_assoc($resp);
							$result[$res["hierarchyTypeId"]] = $res["id"];
							$firstId=$res["parentHierarchyId"];
						}
					}
					header('HTTP/1.1 200 OK');
					echo json_encode($result);
				} break;
				case 'hierarchy':{
					$firstId = $request[1];
					$result = array();
					if ($firstId){
						$query = "select ID, Name, ParentHierarchyId, HierarchyTypeId from Hierarchy where id=$firstId";
						$resp = query($query, $link);
						$res = fetch_assoc($resp);
						header('HTTP/1.1 200 OK');
						echo json_encode(array(
							'ID'=>$res['ID'],
							'Name'=>$res['Name'],
							'HierarchyTypeId'=>$res['HierarchyTypeId'],
							'ParentHierarchyId'=>$res['ParentHierarchyId']
						));
					} else {
						header('HTTP/1.1 400 Not Found');
					}
				} break;
				default:{
					header('HTTP/1.1 405 Method Not Supported');
					echo json_encode(array("error"=>"Сервис не поддерживает данный метод"));
					die();
				}
			}
		} break;
		case 'POST':{
			if ($request[0]=='add'){
				$parent=real_escape_string($link, $_POST["parentId"]);
				$parent = $parent == null?'null':$parent;
				$name=real_escape_string($link, $_POST["name"]);
				$type=real_escape_string($link, $_POST["type"]);
				$query = "INSERT INTO Hierarchy(Name, ParentHierarchyId, HierarchyTypeId) VALUES ('$name', $parent, '$type')";
				$res = query($query, $link);
				if (!$res){
					header('HTTP/1.1 500 Internal Server Error');
					$error = mb_convert_encoding(db_error($link), 'utf-8', 'windows-1251');
					echo json_encode(array("error"=>$error));
					die();
				}
				$id = insert_id($link);
				header('HTTP/1.1 201 Created');
				echo json_encode(array('result' => 'ok', 'id' => $id));
			} else {
				header('HTTP/1.1 405 Method Not Supported');
				echo json_encode(array("error"=>"Сервис не поддерживает данный метод"));
				die();
			}
		} break;
		default:{
			header('HTTP/1.1 405 Method Not Supported');
			echo json_encode(array("error"=>"Сервис не поддерживает данный метод"));
			die();
		}
	}
	close($link);
?>
