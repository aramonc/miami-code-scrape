<?php
include_once "subsection-identifier.php";

$converter = new SubsectionIdentifier();
$converter->text = file_get_contents('miami-code.txt');

$code = $converter->parse();

if($code) {
    file_put_contents('structured.xml', print_r($converter->structured, true));
}



