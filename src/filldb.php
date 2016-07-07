<?php

    class MyDB extends SQLite3
     {
        function __construct()
        {
           $this->open('filmomat.db');
        }
     }

     $db = new MyDB();

     if(!$db){
        echo $db->lastErrorMsg();
     } else {
        echo "Opened database successfully\n";
     }


   // Insert film into table
   $insertFilm = $db->prepare('INSERT INTO FILMS (film_name, iso, manufacturer) VALUES (:name, :iso, :manufacturer)');
   $insertFilm->bindValue(':name', 'TMAX', SQLITE3_TEXT);
   $insertFilm->bindValue(':iso', 400, SQLITE3_INTEGER);
   $insertFilm->bindValue(':manufacturer', 'Kodak', SQLITE3_TEXT);
   $ins = $insertFilm->execute();
   if(!$ins) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Insert film completed";
     $matchcheck = false;
   }

   // Insert process into table
   $insertProc = $db->prepare('INSERT INTO PROCESSES (film_id, process_name) VALUES (:filmid, :name)');
   $insertProc->bindValue(':filmid', 1, SQLITE3_INTEGER);
   $insertProc->bindValue(':name', 'Process for TMAX 400', SQLITE3_TEXT);
   $ins = $insertProc->execute();
   if(!$ins) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Insert process completed";
     $matchcheck = false;
   }

   // Insert step into table
   $insert = $db->prepare('INSERT INTO STEPS (process_id, step_name, step_time, temp, interval, chemical, dilution) VALUES (:process_id, :name, :step_time, :temp, :interval, :chemical, :dilution)');
   $insert->bindValue(':process_id', 1, SQLITE3_INTEGER);
   $insert->bindValue(':name', 'pre-rinse', SQLITE3_TEXT);
   $insert->bindValue(':step_time', 300, SQLITE3_INTEGER);
   $insert->bindValue(':temp', 21, SQLITE3_INTEGER);
   $insert->bindValue(':interval', 30, SQLITE3_INTEGER);
   $insert->bindValue(':chemical', 'Water', SQLITE3_TEXT);
   $insert->bindValue(':dilution', '', SQLITE3_TEXT);
   $ins = $insert->execute();
   if(!$ins) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Insert step completed";
     $matchcheck = false;
   }

   // Insert step into table
   $insert2 = $db->prepare('INSERT INTO STEPS (process_id, step_name, step_time, temp, interval, chemical, dilution) VALUES (:process_id, :name, :step_time, :temp, :interval, :chemical, :dilution)');
   $insert2->bindValue(':process_id', 1, SQLITE3_INTEGER);
   $insert2->bindValue(':name', 'Developing', SQLITE3_TEXT);
   $insert2->bindValue(':step_time', 300, SQLITE3_INTEGER);
   $insert2->bindValue(':temp', 21, SQLITE3_INTEGER);
   $insert2->bindValue(':interval', 30, SQLITE3_INTEGER);
   $insert2->bindValue(':chemical', 'T-max developer', SQLITE3_TEXT);
   $insert2->bindValue(':dilution', '1:4', SQLITE3_TEXT);
   $ins = $insert2->execute();
   if(!$ins) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Insert step completed";
     $matchcheck = false;
   }

   // Insert step into table
   $insert3 = $db->prepare('INSERT INTO STEPS (process_id, step_name, step_time, temp, interval, chemical, dilution) VALUES (:process_id, :name, :step_time, :temp, :interval, :chemical, :dilution)');
   $insert3->bindValue(':process_id', 1, SQLITE3_INTEGER);
   $insert3->bindValue(':name', 'Fix', SQLITE3_TEXT);
   $insert3->bindValue(':step_time', 300, SQLITE3_INTEGER);
   $insert3->bindValue(':temp', 21, SQLITE3_INTEGER);
   $insert3->bindValue(':interval', 30, SQLITE3_INTEGER);
   $insert3->bindValue(':chemical', 'T-max fixer', SQLITE3_TEXT);
   $insert3->bindValue(':dilution', '1:4', SQLITE3_TEXT);
   $ins = $insert3->execute();
   if(!$ins) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Insert step completed";
     $matchcheck = false;
   }






 ?>
