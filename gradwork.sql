-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 04:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gradwork`
--

-- --------------------------------------------------------

--
-- Table structure for table `archivos`
--

CREATE TABLE `archivos` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `tipo` enum('propuesta','anteproyecto','informe_final','otro') NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `subido_por` int(11) DEFAULT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `convocatorias`
--

CREATE TABLE `convocatorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('abierta','cerrada','finalizada') DEFAULT 'abierta',
  `creada_por` int(11) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Dumping data for table `convocatorias`
--

INSERT INTO `convocatorias` (`id`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`, `estado`, `creada_por`, `creado_en`) VALUES
(1, 'Convocatoria General 2025', 'Convocatoria para la presentación de propuestas y proyectos académicos correspondientes al periodo 2025.', '2025-01-15', '2025-12-15', '', 8, '2025-11-07 02:08:53');

-- --------------------------------------------------------

--
-- Table structure for table `evaluaciones`
--

CREATE TABLE `evaluaciones` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `evaluador_id` int(11) NOT NULL,
  `criterio_claridad` decimal(4,2) DEFAULT NULL,
  `criterio_metodologia` decimal(4,2) DEFAULT NULL,
  `criterio_originalidad` decimal(4,2) DEFAULT NULL,
  `promedio` decimal(4,2) GENERATED ALWAYS AS (round((`criterio_claridad` + `criterio_metodologia` + `criterio_originalidad`) / 3,2)) STORED,
  `veredicto` enum('aprobado','aprobado_con_modificaciones','no_aprobado') DEFAULT 'aprobado_con_modificaciones',
  `comentarios` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Dumping data for table `evaluaciones`
--

INSERT INTO `evaluaciones` (`id`, `proyecto_id`, `evaluador_id`, `criterio_claridad`, `criterio_metodologia`, `criterio_originalidad`, `veredicto`, `comentarios`, `fecha`) VALUES
(1, 10, 7, 5.00, 5.00, 5.00, 'aprobado_con_modificaciones', '', '2025-11-20 04:39:55'),
(2, 12, 7, 5.00, 5.00, 5.00, 'aprobado_con_modificaciones', '', '2025-11-20 04:40:22'),
(3, 11, 7, 4.00, 3.00, 5.00, 'aprobado_con_modificaciones', '', '2025-11-20 04:42:30');

-- --------------------------------------------------------

--
-- Table structure for table `historial_estados`
--

CREATE TABLE `historial_estados` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `estado_anterior` enum('propuesta','anteproyecto','en_revision','aprobado','rechazado','finalizado') DEFAULT NULL,
  `nuevo_estado` enum('propuesta','anteproyecto','en_revision','aprobado','rechazado','finalizado') DEFAULT NULL,
  `cambiado_por` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `observaciones`
--

CREATE TABLE `observaciones` (
  `id` int(11) NOT NULL,
  `proyecto_id` int(11) NOT NULL,
  `autor_id` int(11) NOT NULL,
  `rol_autor` enum('asesor','evaluador','coordinador') NOT NULL,
  `comentario` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proyectos`
--

CREATE TABLE `proyectos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `programa` varchar(120) NOT NULL,
  `opcion_grado` enum('monografia','articulo','proyecto_aplicado') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `archivo_nombre` varchar(255) DEFAULT NULL,
  `archivo_mime` varchar(100) DEFAULT NULL,
  `archivo_tamano` int(11) DEFAULT NULL,
  `archivo_path` varchar(255) DEFAULT NULL,
  `estudiante_id` int(11) NOT NULL,
  `colaborador_id` int(11) DEFAULT NULL,
  `asesor_id` int(11) DEFAULT NULL,
  `evaluador_id` int(11) DEFAULT NULL,
  `convocatoria_id` int(11) DEFAULT NULL,
  `estado` enum('propuesta','anteproyecto','en_revision','aprobado','rechazado','finalizado') DEFAULT 'propuesta',
  `calificacion_final` decimal(4,2) DEFAULT NULL,
  `observaciones_asesor` text DEFAULT NULL,
  `fecha_evaluacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Dumping data for table `proyectos`
--

INSERT INTO `proyectos` (`id`, `titulo`, `programa`, `opcion_grado`, `descripcion`, `archivo_nombre`, `archivo_mime`, `archivo_tamano`, `archivo_path`, `estudiante_id`, `colaborador_id`, `asesor_id`, `evaluador_id`, `convocatoria_id`, `estado`, `calificacion_final`, `observaciones_asesor`, `fecha_evaluacion`, `creado_en`) VALUES
(8, 'Sistema de Gestión Académica', '', 'monografia', 'Proyecto enfocado en optimizar la administración de notas, asistencia y procesos académicos.', NULL, NULL, NULL, NULL, 5, NULL, 6, 7, 1, 'aprobado', 4.80, NULL, NULL, '2025-11-07 02:09:10'),
(9, 'Optimización de Procesos Industriales', '', 'monografia', 'Análisis y mejora de las etapas productivas de una empresa manufacturera.', NULL, NULL, NULL, NULL, 5, NULL, 6, 7, 1, 'aprobado', 4.50, NULL, NULL, '2025-11-07 02:09:10'),
(10, 'Portal Estudiantil Inteligente', '', 'monografia', 'Desarrollo de una plataforma con funcionalidades automáticas para soporte al estudiante.', 'Portal Estudiantil Inteligente.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 12526, '/uploads/update_1762637930353.docx', 5, 9, 6, 7, 1, 'aprobado', 5.00, NULL, '2025-11-19 23:39:55', '2025-11-07 02:09:10'),
(11, 'prueba de proyecto', 'Ingeniería de Sistemas', 'articulo', 'prueba de proyecto', 'New Documento de Microsoft Word.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 12065, '/uploads/prop_1762551771243.docx', 5, 9, 6, 7, NULL, 'aprobado', 4.00, NULL, '2025-11-19 23:42:30', '2025-11-07 21:42:51'),
(12, 'segundo archivo a subir', 'Ingeniería Industrial', 'monografia', 'segundo archivo a subir', 'segundo archivo a subir.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 12065, '/uploads/prop_1762632775016.docx', 9, 5, 6, 7, NULL, 'en_revision', 5.00, 'asdfghjkjhgfdsasd', '2025-11-28 12:31:47', '2025-11-08 20:12:55');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `correo` varchar(120) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('estudiante','asesor','evaluador','coordinador','admin') NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`, `rol`, `activo`, `creado_en`) VALUES
(5, 'estudiante', 'estudiante@estudiante.com', '$2b$10$INBq/TP3x4H2/Fnhp/QDcuGVb7SShIpU/OyLMzKFtA4AhyUKgB9YC', 'estudiante', 1, '2025-11-06 20:45:38'),
(6, 'asesor', 'asesor@asesor.com', '$2b$10$384TuBAQF04uxPV2pHycmuqNl/c2AT28D0be.bjCCVWdlBWeYVENu', 'asesor', 1, '2025-11-06 20:46:19'),
(7, 'evaluador', 'evaluador@evaluador.com', '$2b$10$4WYANtrm6jDuwRnUb74nRuOtHwWtST2XyEEh8PrjDpFSD/KGeKLly', 'evaluador', 1, '2025-11-06 20:48:13'),
(8, 'coordinador', 'coordinador@coordinador.com', '$2b$10$YZNj8Tm06oxUZUMJGYKEIuslPNOvB/1MfPMv2Z0bl2S3sUqy6SDNq', 'coordinador', 1, '2025-11-06 20:48:48'),
(9, 'colaborador', 'colaborador@colaborador.com', '$2b$10$8ja7G9ZQn5hR6T668jtZEuaI.BYHn/ahpDCGPfYESTnU57zod1B8a', 'estudiante', 1, '2025-11-07 20:02:38');

-- --------------------------------------------------------

--
-- Stand-in structure for view `vista_proyectos_detalle`
-- (See below for the actual view)
--
CREATE TABLE `vista_proyectos_detalle` (
`id` int(11)
,`titulo` varchar(255)
,`descripcion` text
,`estudiante` varchar(150)
,`asesor` varchar(150)
,`evaluador` varchar(150)
,`convocatoria` varchar(150)
,`estado` enum('propuesta','anteproyecto','en_revision','aprobado','rechazado','finalizado')
,`calificacion_final` decimal(4,2)
,`creado_en` timestamp
);

-- --------------------------------------------------------

--
-- Structure for view `vista_proyectos_detalle`
--
DROP TABLE IF EXISTS `vista_proyectos_detalle`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_proyectos_detalle`  AS SELECT `p`.`id` AS `id`, `p`.`titulo` AS `titulo`, `p`.`descripcion` AS `descripcion`, `u`.`nombre` AS `estudiante`, `a`.`nombre` AS `asesor`, `e`.`nombre` AS `evaluador`, `c`.`nombre` AS `convocatoria`, `p`.`estado` AS `estado`, `p`.`calificacion_final` AS `calificacion_final`, `p`.`creado_en` AS `creado_en` FROM ((((`proyectos` `p` left join `usuarios` `u` on(`p`.`estudiante_id` = `u`.`id`)) left join `usuarios` `a` on(`p`.`asesor_id` = `a`.`id`)) left join `usuarios` `e` on(`p`.`evaluador_id` = `e`.`id`)) left join `convocatorias` `c` on(`p`.`convocatoria_id` = `c`.`id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `archivos`
--
ALTER TABLE `archivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`),
  ADD KEY `subido_por` (`subido_por`);

--
-- Indexes for table `convocatorias`
--
ALTER TABLE `convocatorias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creada_por` (`creada_por`);

--
-- Indexes for table `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`),
  ADD KEY `evaluador_id` (`evaluador_id`);

--
-- Indexes for table `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`),
  ADD KEY `cambiado_por` (`cambiado_por`);

--
-- Indexes for table `observaciones`
--
ALTER TABLE `observaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto_id` (`proyecto_id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indexes for table `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estudiante_id` (`estudiante_id`),
  ADD KEY `asesor_id` (`asesor_id`),
  ADD KEY `evaluador_id` (`evaluador_id`),
  ADD KEY `convocatoria_id` (`convocatoria_id`),
  ADD KEY `fk_proy_colaborador` (`colaborador_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `archivos`
--
ALTER TABLE `archivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `convocatorias`
--
ALTER TABLE `convocatorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `evaluaciones`
--
ALTER TABLE `evaluaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `historial_estados`
--
ALTER TABLE `historial_estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `observaciones`
--
ALTER TABLE `observaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `archivos`
--
ALTER TABLE `archivos`
  ADD CONSTRAINT `archivos_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `archivos_ibfk_2` FOREIGN KEY (`subido_por`) REFERENCES `usuarios` (`id`);

--
-- Constraints for table `convocatorias`
--
ALTER TABLE `convocatorias`
  ADD CONSTRAINT `convocatorias_ibfk_1` FOREIGN KEY (`creada_por`) REFERENCES `usuarios` (`id`);

--
-- Constraints for table `evaluaciones`
--
ALTER TABLE `evaluaciones`
  ADD CONSTRAINT `evaluaciones_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `evaluaciones_ibfk_2` FOREIGN KEY (`evaluador_id`) REFERENCES `usuarios` (`id`);

--
-- Constraints for table `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD CONSTRAINT `historial_estados_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `historial_estados_ibfk_2` FOREIGN KEY (`cambiado_por`) REFERENCES `usuarios` (`id`);

--
-- Constraints for table `observaciones`
--
ALTER TABLE `observaciones`
  ADD CONSTRAINT `observaciones_ibfk_1` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `observaciones_ibfk_2` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`);

--
-- Constraints for table `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `fk_proy_colaborador` FOREIGN KEY (`colaborador_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`asesor_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_3` FOREIGN KEY (`evaluador_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `proyectos_ibfk_4` FOREIGN KEY (`convocatoria_id`) REFERENCES `convocatorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
