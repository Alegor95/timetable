<?php
  function connect() {
    include 'dbConstants.php';
    $link = mysql_connect($db_host, $db_user, $db_pass);
  	if (!$link) {
  		header('HTTP/1.1 500 Internal Server Error');
  		$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
  		if ($error == "") $errror="Ошибка подключения к базе";
  		echo json_encode(array("error"=>$error));
  		die();
  	}
  	mysql_set_charset('utf8', $link);
  	if (!mysql_select_db($db_name, $link)){
  		header('HTTP/1.1 500 Internal Server Error');
  		$error = mb_convert_encoding(mysql_error(), 'utf-8', 'windows-1251');
  		echo json_encode(array("error"=>$error));
  		die();
  	}
    return $link;
  }

  function parse_request($link) {
    $request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
  	foreach ($request as &$value) {
  		$value = mysql_real_escape_string($value);
  	}
    return $request;
  }

  function query($query, $link) {
    return mysql_query($query, $link);
  }

  function num_rows($res) {
    return mysql_num_rows($res);
  }

  function fetch_array($res){
    return mysql_fetch_array($res, MYSQL_ASSOC);
  }

  function fetch_assoc($resp) {
    return mysql_fetch_assoc($resp);
  }

  function db_error($link) {
    return mysql_error();
  }

  function real_escape_string($link, $var) {
    return mysql_real_escape_string($link, $var);
  }

  function close($link) {
    return mysql_close($link);
  }

  function inser_id() {
    return mysql_insert_id();
  }
?>
