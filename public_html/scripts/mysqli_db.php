<?php
  function connect() {
    include 'dbConstants.php';
    $link = mysqli_connect($db_host, $db_user, $db_pass);
  	if (!$link) {
  		header('HTTP/1.1 500 Internal Server Error');
  		$error = mb_convert_encoding(mysqli_error($link), 'utf-8', 'windows-1251');
  		if ($error == "") $errror="Ошибка подключения к базе";
  		echo json_encode(array("error"=>$error));
  		die();
  	}
  	mysqli_set_charset($link, 'utf8');
  	if (!mysqli_select_db($link, $db_name)){
  		header('HTTP/1.1 500 Internal Server Error');
  		$error = mb_convert_encoding(mysqli_error($link), 'utf-8', 'windows-1251');
  		echo json_encode(array("error"=>$error));
  		die();
  	}
    return $link;
  }

  function parse_request($link) {
    $request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
  	foreach ($request as &$value) {
  		$value = real_escape_string($link, $value);
  	}
    return $request;
  }

  function query($query, $link) {
    return mysqli_query($link, $query);
  }

  function num_rows($res) {
    return mysqli_num_rows($res);
  }

  function fetch_array($res){
    return mysqli_fetch_array($res, MYSQLI_ASSOC);
  }

  function fetch_assoc($resp) {
    return mysqli_fetch_assoc($resp);
  }

  function db_error($link) {
    return mysqli_error($link);
  }

  function real_escape_string($link, $var) {
    return mysqli_real_escape_string($link, $var);
  }

  function close($link) {
    return mysqli_close($link);
  }

  function insert_id() {
    return mysqli_insert_id();
  }
?>
