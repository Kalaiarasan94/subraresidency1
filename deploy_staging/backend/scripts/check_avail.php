<?php
$db=new PDO('mysql:host=localhost;dbname=subra','root','');
$q=$db->query('SELECT * FROM room_availability ORDER BY updated_at DESC LIMIT 20');
$rows=$q->fetchAll(PDO::FETCH_ASSOC);
foreach($rows as $r){ echo $r['room_id'] . "\t" . $r['date'] . "\t" . $r['status'] . "\t" . $r['note'] . "\n"; }
?>