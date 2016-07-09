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


   // create tables
   $filmsTable = 'CREATE TABLE FILMS (id INTEGER PRIMARY KEY, film_name TEXT NOT NULL, iso INTEGER NOT NULL, manufacturer TEXT NOT NULL)';
   $ctable = $db->exec($filmsTable);
   if(!$ctable) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Table created successfully\n";
   }

   $processesTable = 'CREATE TABLE PROCESSES (processid INTEGER PRIMARY KEY, film_id INT NOT NULL, process_name TEXT NOT NULL, FOREIGN KEY(film_id) REFERENCES FILMS(id))';
   $ptable = $db->exec($processesTable);
   if(!$ptable) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Table created successfully\n";
   }

   $stepsTable = 'CREATE TABLE STEPS (step_id INTEGER PRIMARY KEY, process_id INT NOT NULL, step_name TEXT NOT NULL, step_time INT NOT NULL, temp INT NOT NULL, interval INT NOT NULL, chemical TEXT NOT NULL, dilution TEXT, FOREIGN KEY(process_id) REFERENCES PROCESSES(processid))';
   $stable = $db->exec($stepsTable);
   if(!$stable) {
     echo $db->lastErrorMsg();
   }
   else {
     echo "Table created successfully\n";
   }


// SELECT film_name as filmname, iso, manufacturer, processid, process_name as processname, step_id, step_name as step, step_time as time, temp, interval, chemical, dilution FROM FILMS INNER JOIN PROCESSES ON id = film_id INNER JOIN STEPS ON process_id = process_id where film_id = 1
 ?>
