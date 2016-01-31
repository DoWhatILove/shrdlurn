module Types where

import Prelude
import Data.List
import Data.Enum
import Data.Maybe
import qualified Data.StrMap as SM

-- Cube, Stack, Wall

data Cube = Cyan | Brown | Red | Orange | Yellow

instance showCube :: Show Cube where
    show Cyan   = "Cyan"
    show Brown  = "Brown"
    show Red    = "Red"
    show Orange = "Orange"
    show Yellow = "Yellow"

instance eqCube :: Eq Cube where
    eq a b = fromEnum a == fromEnum b

instance ordCube :: Ord Cube where
    compare a b = fromEnum a `compare` fromEnum b

instance boundedCube :: Bounded Cube where
    top    = Yellow
    bottom = Cyan

instance enumCube :: Enum Cube where
    cardinality = Cardinality 5
    succ = defaultSucc cubeToEnum cubeFromEnum
    pred = defaultPred cubeToEnum cubeFromEnum
    toEnum = cubeToEnum
    fromEnum = cubeFromEnum

cubeFromEnum Cyan   = 0
cubeFromEnum Brown  = 1
cubeFromEnum Red    = 2
cubeFromEnum Orange = 3
cubeFromEnum Yellow = 4

cubeToEnum 0 = Just Cyan
cubeToEnum 1 = Just Brown
cubeToEnum 2 = Just Red
cubeToEnum 3 = Just Orange
cubeToEnum 4 = Just Yellow
cubeToEnum _ = Nothing

intToCube :: Int -> Cube
intToCube 0 = Cyan
intToCube 1 = Brown
intToCube 2 = Red
intToCube 3 = Orange
intToCube 4 = Yellow
intToCube _ = Yellow

type Stack = List Cube

type Wall = List Stack

-- Transformer
type Transformer = Wall -> Wall

type TransformerId = String

type TransformerRecord = {
    name :: String,
    function :: Transformer
}

-- Levels and chapters

type LevelId = String

data Difficulty = Easy | Medium | Hard

instance showDifficulty :: Show Difficulty where
    show Easy = "Easy"
    show Medium = "Medium"
    show Hard = "Hard"

type Level = {
    name       :: String,
    help       :: Maybe String,
    difficulty :: Difficulty,
    initial    :: Wall,
    target     :: Wall
}

type Chapter = {
    name         :: String,
    transformers :: SM.StrMap TransformerRecord,
    levels       :: SM.StrMap Level
}

-- Game state

type GameState = {
    currentLevel :: LevelId,
    levelState   :: SM.StrMap (List String)
}
