create database demo;
use demo;

--create table

CREATE TABLE `foodItem` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` integer DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

ALTER TABLE foodItem add createdOn datetime DEFAULT now();

ALTER TABLE foodItem add isDeleted bool DEFAULT false;

ALTER TABLE foodItem add deletedOn datetime DEFAULT NULL;


INSERT INTO foodItem(name,description,price) values('sada dosa','made from rice floor',20);
INSERT INTO foodItem(name,description,price) values('masal dosa','made from rice floor & potato',40);