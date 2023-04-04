// 1: [X,O,3] 
// 2: [4,5,6]
// 3: [7,8,9]
// "text": "Player X won"
// TicTacToe<'19'>

type Blank = '*'
type FirstPlayer = 'X'
type SecondPlayer = 'O'

type PlayerCharacterUnion = FirstPlayer | SecondPlayer
type PlacementCharacterUnion = PlayerCharacterUnion | Blank

// Board Logic
type BoardType = 
{
    "1": [PlacementCharacterUnion, PlacementCharacterUnion, PlacementCharacterUnion],
    "2": [PlacementCharacterUnion, PlacementCharacterUnion, PlacementCharacterUnion],
    "3": [PlacementCharacterUnion, PlacementCharacterUnion, PlacementCharacterUnion]
    "text"?: string
}

type InitialBoard = 
{
    "1": ["*","*","*"],
    "2": ["*","*","*"],
    "3": ["*","*","*"]
}

type BoardWithText<Board extends BoardType, text extends string> = {
    [prop in (keyof Board | "text")] : 
        prop extends "text" ?
            text:
        Board[prop]
}

type CheckBoardWithText = BoardWithText<InitialBoard, "Some Text">

// Winning Logic
type WinningByRow<Board extends BoardType> = 
    [Board["1"][0], Board["1"][1], Board["1"][2]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["1"][0] :
    [Board["2"][0], Board["2"][1], Board["2"][2]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["2"][0] :
    [Board["3"][0], Board["3"][1], Board["3"][2]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["3"][0] :
    false

type WinningByColumn<Board extends BoardType> = 
    [Board["1"][0], Board["2"][0], Board["3"][0]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["1"][0] :
    [Board["1"][1], Board["2"][1], Board["3"][1]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["1"][1] :
    [Board["1"][2], Board["2"][2], Board["3"][2]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["1"][2] :
    false

type WinningByDiagonal<Board extends BoardType> = 
    [Board["1"][0], Board["2"][1], Board["3"][2]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["1"][0] :
    [Board["1"][2], Board["2"][1], Board["3"][0]] extends [FirstPlayer, FirstPlayer, FirstPlayer] | [SecondPlayer, SecondPlayer , SecondPlayer] ?
        Board["1"][2] :
    false

type Winner<Board extends BoardType> = 
    WinningByRow<Board> extends PlayerCharacterUnion ?
        WinningByRow<Board> :
    WinningByColumn<Board> extends PlayerCharacterUnion ?
        WinningByColumn<Board> :
    WinningByDiagonal<Board> extends PlayerCharacterUnion ?
        WinningByDiagonal<Board> :
    false

type TurnToCordMat =
{
    "1": ["1", 0],
    "2": ["1", 1],
    "3": ["1", 2],
    "4": ["2", 0],
    "5": ["2", 1],
    "6": ["2", 2],
    "7": ["3", 0],
    "8": ["3", 1],
    "9": ["3", 2],
}

type TurnType = keyof TurnToCordMat

type AddOne<Number extends TurnType> = [never, "2", "3","4","5","6","7","8","9", never][Number]

type TurnToCord<Number extends TurnType> = TurnToCordMat[Number]

// Tie Logic
type Tie<Board extends BoardType, Count extends TurnType = "1" > = 
    [Count] extends [never] ?
        true:
    Board[TurnToCord<Count>[0]][TurnToCord<Count>[1]] extends Blank ?
        false:
    Tie<Board, AddOne<Count>>

// Invalid Cases
type DoublePlacing<Board extends BoardType, Turn extends TurnType> = 
    Board[TurnToCord<Turn>[0]][TurnToCord<Turn>[1]] extends PlacementCharacterUnion ?
        true:
    false

// TicTacToe Time!
type NewBoard<Board extends BoardType, Turn extends TurnType, PlayerCharacter extends PlayerCharacterUnion> =
{
    [prop in keyof Board]: 
        prop extends "text" ?
            "" :
        prop extends TurnToCord<Turn>[0] ?
            [
                TurnToCord<Turn>[1] extends 0 ? 
                    PlayerCharacter:
                Board[prop][0],
                TurnToCord<Turn>[1] extends 1 ? 
                    PlayerCharacter:
                Board[prop][1],
                TurnToCord<Turn>[1] extends 2 ? 
                    PlayerCharacter:
                Board[prop][2],
            ]:
        Board[prop]
}

type CheckNewBoard = NewBoard<InitialBoard, "1", "X">
//   ^?
type CheckNewBoard2 = NewBoard<CheckNewBoard, "2", "O">
//   ^?

type TicTacToe<Turns extends string, Board extends BoardType = InitialBoard, PlayerCharacter extends PlayerCharacterUnion = FirstPlayer> =
    Winner<Board> extends PlayerCharacterUnion ?
        BoardWithText<Board, `The winner is ${Winner<Board>}`> :
    Tie<Board> extends true ?
        BoardWithText<Board, `Tie!`> :
    Turns extends `${infer Turn}${infer RestOfTurns}`?
        Turn extends TurnType ?
            Board[TurnToCord<Turn>[0]][TurnToCord<Turn>[1]] extends Blank ?
                TicTacToe<RestOfTurns, NewBoard<Board, Turn, PlayerCharacter>, PlayerCharacter extends FirstPlayer ? SecondPlayer : FirstPlayer>:
            BoardWithText<Board, `Cannot to place twice on the same position -> ${Turn}`>:
        BoardWithText<Board, `Invalid Character ${Turn}`> :
    Board


type Result = TicTacToe<"5219732">
//    ^?



