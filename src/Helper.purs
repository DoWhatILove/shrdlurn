module Helper where
import Prelude
import Data.List
import Data.Maybe
import Data.Tuple
import qualified Data.StrMap as SM

import Types

-- | Create a StrMap from an Array of (key, value) pairs
fromArray :: forall a. Array (Tuple String a) -> SM.StrMap a
fromArray = SM.fromList <<< toList

infixl 6 :>

-- | Operator to create tuples, especially for creating maps with
-- | `Map.fromList ["key1" :> "value1", "key2" :> "value2"]`
(:>) :: forall a b. a -> b -> Tuple a b
(:>) a b = Tuple a b

-- | Array analogs of the Stack and Wall types
type AStack = Array Cube
type AWall = Array AStack

-- | Convert 2D Array to List
convert :: AWall -> Wall
convert = toList <<< map toList

intToStack :: Array Int -> Stack
intToStack = toList <<< map intToCube

intToWall :: (Array (Array Int)) -> Wall
intToWall = toList <<< map intToStack

intToWalls :: (Array (Array (Array Int))) -> (List Wall)
intToWalls = toList <<< map intToWall