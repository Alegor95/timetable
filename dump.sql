-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u7
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Апр 04 2017 г., 07:10
-- Версия сервера: 5.5.54
-- Версия PHP: 5.5.38-1~dotdeb+7.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `gorovoj_a_b`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Hierarchy`
--

CREATE TABLE IF NOT EXISTS `Hierarchy` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `HierarchyTypeId` varchar(10) NOT NULL,
  `ParentHierarchyId` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_Hierarchy_Type` (`HierarchyTypeId`),
  KEY `fk_Parent_Hierarchy` (`ParentHierarchyId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `Hierarchy`
--

INSERT INTO `Hierarchy` (`ID`, `Name`, `HierarchyTypeId`, `ParentHierarchyId`) VALUES
(1, 'ВГУ', 'UNIVERSITY', NULL),
(2, 'ФКН', 'FACULTY', 1),
(3, '3', 'COURSE', 2),
(4, '1.2', 'GROUP', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `HierarchyType`
--

CREATE TABLE IF NOT EXISTS `HierarchyType` (
  `ID` varchar(10) NOT NULL,
  `Name` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `HierarchyType`
--

INSERT INTO `HierarchyType` (`ID`, `Name`) VALUES
('COURSE', 'Курс'),
('FACULTY', 'Факультет'),
('GROUP', 'Группа'),
('UNIVERSITY', 'Университет');

-- --------------------------------------------------------

--
-- Структура таблицы `Hometask`
--

CREATE TABLE IF NOT EXISTS `Hometask` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` text,
  `CompletionDate` date DEFAULT NULL,
  `LessonId` int(11) NOT NULL,
  `RemovedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_Hometask_Lesson` (`LessonId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `Hometask`
--

INSERT INTO `Hometask` (`ID`, `Name`, `Description`, `CompletionDate`, `LessonId`, `RemovedAt`) VALUES
(1, 'test', 'test', '2015-10-22', 1, '2015-10-14 13:05:38');

-- --------------------------------------------------------

--
-- Структура таблицы `Lesson`
--

CREATE TABLE IF NOT EXISTS `Lesson` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  `SubjectId` int(11) NOT NULL,
  `HierarchyId` int(11) NOT NULL,
  `Room` varchar(10) DEFAULT NULL,
  `LessonTypeId` varchar(10) NOT NULL,
  `RepeatTime` varchar(2) NOT NULL,
  `PeriodStart` datetime NOT NULL,
  `PeriodEnd` datetime DEFAULT NULL,
  `RemovedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_Lesson_Repeat` (`RepeatTime`),
  KEY `fk_Lesson_Subject` (`SubjectId`),
  KEY `fk_Lesson_Hierarchy` (`HierarchyId`),
  KEY `fk_Lesson_Type` (`LessonTypeId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `Lesson`
--

INSERT INTO `Lesson` (`ID`, `Name`, `SubjectId`, `HierarchyId`, `Room`, `LessonTypeId`, `RepeatTime`, `PeriodStart`, `PeriodEnd`, `RemovedAt`) VALUES
(1, '', 1, 4, '297', 'PRACTICE', 'CH', '1970-01-02 09:45:00', '1970-01-02 11:20:00', NULL),
(7, '', 2, 4, '0', 'LECTURE', 'ZN', '1970-01-04 09:45:00', '1970-01-04 11:20:00', '2015-10-14 12:53:11');

-- --------------------------------------------------------

--
-- Структура таблицы `LessonRepeat`
--

CREATE TABLE IF NOT EXISTS `LessonRepeat` (
  `ID` varchar(2) NOT NULL,
  `Title` varchar(15) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `LessonRepeat`
--

INSERT INTO `LessonRepeat` (`ID`, `Title`) VALUES
('BH', 'Каждую неделю'),
('CH', 'Числитель'),
('ZN', 'Знаменатель');

-- --------------------------------------------------------

--
-- Структура таблицы `LessonType`
--

CREATE TABLE IF NOT EXISTS `LessonType` (
  `ID` varchar(10) NOT NULL,
  `Title` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `LessonType`
--

INSERT INTO `LessonType` (`ID`, `Title`) VALUES
('LECTURE', 'Лекция'),
('PRACTICE', 'Практика');

-- --------------------------------------------------------

--
-- Структура таблицы `Subjects`
--

CREATE TABLE IF NOT EXISTS `Subjects` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(40) NOT NULL,
  `Description` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `Subjects`
--

INSERT INTO `Subjects` (`ID`, `Title`, `Description`) VALUES
(1, 'ТИПС', 'ТИПС'),
(2, 'МТС', 'МТС');

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Surname` text,
  `Name` text,
  `Email` text NOT NULL,
  `PasswordHash` text NOT NULL,
  `HierarchyId` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_User_Hierarchy` (`HierarchyId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `Users`
--

INSERT INTO `Users` (`ID`, `Surname`, `Name`, `Email`, `PasswordHash`, `HierarchyId`) VALUES
(1, 'Горовой', 'Александр', 'alexgor95@live.com', 'b09c600fddc573f117449b3723f23d64', 4),
(2, 'Горовой', 'Александр', 'alexgor95@live.com', '0cc175b9c0f1b6a831c399e269772661', 4);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Hierarchy`
--
ALTER TABLE `Hierarchy`
  ADD CONSTRAINT `fk_Hierarchy_Type` FOREIGN KEY (`HierarchyTypeId`) REFERENCES `HierarchyType` (`ID`),
  ADD CONSTRAINT `fk_Parent_Hierarchy` FOREIGN KEY (`ParentHierarchyId`) REFERENCES `Hierarchy` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Hometask`
--
ALTER TABLE `Hometask`
  ADD CONSTRAINT `fk_Hometask_Lesson` FOREIGN KEY (`LessonId`) REFERENCES `Lesson` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Lesson`
--
ALTER TABLE `Lesson`
  ADD CONSTRAINT `fk_Lesson_Hierarchy` FOREIGN KEY (`HierarchyId`) REFERENCES `Hierarchy` (`ID`),
  ADD CONSTRAINT `fk_Lesson_Repeat` FOREIGN KEY (`RepeatTime`) REFERENCES `LessonRepeat` (`ID`),
  ADD CONSTRAINT `fk_Lesson_Subject` FOREIGN KEY (`SubjectId`) REFERENCES `Subjects` (`ID`),
  ADD CONSTRAINT `fk_Lesson_Type` FOREIGN KEY (`LessonTypeId`) REFERENCES `LessonType` (`ID`);

--
-- Ограничения внешнего ключа таблицы `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `fk_User_Hierarchy` FOREIGN KEY (`HierarchyId`) REFERENCES `Hierarchy` (`ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
