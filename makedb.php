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

   
   // // create tables
   // $createtable = 'CREATE TABLE USERS (id INTEGER PRIMARY KEY, fbid TEXT NOT NULL)';
   // $ctable = $db->exec($createtable);
   // if(!$ctable) {
   //   echo $db->lastErrorMsg();
   // }
   // else {
   //   echo "Table created successfully\n";
   // }
   //
   // $secondtable = 'CREATE TABLE CHAINS (id INT NOT NULL, name TEXT NOT NULL, chain TEXT NOT NULL, FOREIGN KEY(id) REFERENCES USERS(fbid))';
   // $stable = $db->exec($secondtable);
   // if(!$stable) {
   //   echo $db->lastErrorMsg();
   // }
   // else {
   //   echo "Table created successfully\n";
   // }
   //

 ?>
