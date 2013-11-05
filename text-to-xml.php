<?php
include_once "subsection-identifier.php";

$converter = new SubsectionIdentifier();
$converter->text = file_get_contents('miami-code.txt');

$code = $converter->parse();

if($code) {
    echo "here \n";
    file_put_contents('structured.txt', print_r($converter->structured, true));
    echo "done \n";
}



