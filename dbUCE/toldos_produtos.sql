-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: toldos
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `imagem` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'Toldo Comercial','Toldos','toldos_comercial.png'),(2,'Toldo Residencial','Toldos','toldos_residencial.png'),(3,'Toldo Cortina','Toldos','toldos_cortina.png'),(4,'Toldo Articulado','Toldos','toldo_articulado.png'),(5,'Toldo Policarbonato','Toldos','toldo_policabornato.png'),(6,'Sombreador Estacionamento','Sombreadores','sombreador_estacionamento.png'),(7,'Sombreador Piscina','Sombreadores','sombreador_piscina.png'),(8,'Sombreador Garagem','Sombreadores','sombreador_garagem.png'),(9,'Sombreador Galpao','Sombreadores','sombreador_galpao.png'),(10,'Sombreador Estacionamento 2','Sombreadores','sombreador_estacionamento2.png'),(11,'Luminoso 1','Luminosos','luminoso_card01.png'),(12,'Luminoso 2','Luminosos','luminosos_card02.png'),(13,'Luminoso 3','Luminosos','luminosos_card03.png'),(14,'Luminoso 4','Luminosos','img-card04-luminoso.png'),(15,'Luminoso 5','Luminosos','luminosos_card05.png'),(16,'Letra Caixa 1','Letras-caixa','letrasCaixa_card01.png'),(17,'Letra Caixa 2','Letras-caixa','letrasCaixa_card02.png'),(18,'Letra Caixa 3','Letras-caixa','letrasCaixa_card03.png'),(19,'Letra Caixa 4','Letras-caixa','letrasCaixa_card04.png'),(20,'Letra Caixa 5','Letras-caixa','letras-caixa-card05.png'),(21,'Fachada 1','Fachadas','fachadas_card01.png'),(22,'Fachada 2','Fachadas','fachadas_card02.png'),(23,'Fachada 3','Fachadas','mc donalds 1.png'),(24,'Fachada 4','Fachadas','fachadas_card04.png'),(25,'Fachada 5','Fachadas','fachadas_card05.png');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-06 17:56:58
