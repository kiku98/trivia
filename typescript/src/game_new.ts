export class Player {
  public name: string;
  public place: number;
  public purse: number;
  public inPenaltyBox: boolean;

  constructor(name: string) {
    this.name = name;
    this.place = 0;
    this.purse = 0;
    this.inPenaltyBox = false;
  }
}

export class Place {
  place: number;
  getCategory(): Category {
    switch (this.place % 4) {
      case 0:
        return Category.POP;
      case 1:
        return Category.SCIENCE;
      case 2:
        return Category.POP;
      default:
        return Category.ROCK;
    }
  }
}

export enum Category {
  POP,
  SCIENCE,
  SPORTS,
  ROCK,
}

export interface Question {
  title: string;
}

export class RockQuestion implements Question {
  title: string;
}

export class Game {
  private players: Array<Player> = [];

  private currentPlayer: number = 0;

  private isGettingOutOfPenaltyBox: boolean = false;

  private popQuestions: Array<string> = [];
  private scienceQuestions: Array<string> = [];
  private sportsQuestions: Array<string> = [];
  private rockQuestions: Array<string> = [];

  constructor() {
    for (let i = 0; i < 50; i++) {
      this.popQuestions.push('Pop Question ' + i);
      this.scienceQuestions.push('Science Question ' + i);
      this.sportsQuestions.push('Sports Question ' + i);
      this.rockQuestions.push('Rock Question ' + i);
    }
  }

  public add(name: string): boolean {
    this.players.push(new Player(name));

    console.log(name + ' was added');
    console.log('They are player number ' + this.players.length);

    return true;
  }

  public roll(roll: number): void {
    console.log(this.players[this.currentPlayer] + ' is the current player');
    console.log('They have rolled a ' + roll);

    if (this.players[this.currentPlayer].inPenaltyBox) {
      if (roll % 2 != 0) {
        this.isGettingOutOfPenaltyBox = true;

        console.log(
          this.players[this.currentPlayer] +
            ' is getting out of the penalty box',
        );
        this.updatePlayerPlace(roll);

        console.log(
          this.players[this.currentPlayer] +
            "'s new location is " +
            this.players[this.currentPlayer].place,
        );
        console.log('The category is ' + this.currentCategory());
        this.askQuestion();
      } else {
        console.log(
          this.players[this.currentPlayer] +
            ' is not getting out of the penalty box',
        );
        this.isGettingOutOfPenaltyBox = false;
      }
    } else {
      this.updatePlayerPlace(roll);

      console.log(
        this.players[this.currentPlayer] +
          "'s new location is " +
          this.players[this.currentPlayer].place,
      );
      console.log('The category is ' + this.currentCategory());
      this.askQuestion();
    }
  }

  updatePlayerPlace(roll: number): void {
    this.players[this.currentPlayer].place =
      this.players[this.currentPlayer].place + roll;
    if (this.players[this.currentPlayer].place > 11) {
      this.players[this.currentPlayer].place =
        this.players[this.currentPlayer].place - 12;
    }
  }

  private askQuestion(): void {
    if (this.currentCategory() == 'Pop') console.log(this.popQuestions.shift());
    if (this.currentCategory() == 'Science')
      console.log(this.scienceQuestions.shift());
    if (this.currentCategory() == 'Sports')
      console.log(this.sportsQuestions.shift());
    if (this.currentCategory() == 'Rock')
      console.log(this.rockQuestions.shift());
  }

  private currentCategory(): string {
    switch (this.players[this.currentPlayer].place % 4) {
      case 0:
        return 'Pop';
      case 1:
        return 'Science';
      case 2:
        return 'Sports';
      default:
        return 'Rock';
    }
  }

  private didPlayerWin(): boolean {
    return !(this.players[this.currentPlayer].purse == 6);
  }

  public wrongAnswer(): boolean {
    console.log('Question was incorrectly answered');
    console.log(
      this.players[this.currentPlayer] + ' was sent to the penalty box',
    );
    this.players[this.currentPlayer].inPenaltyBox = true;

    this.currentPlayer += 1;

    this.setNextPlayer();
    return true;
  }

  private setNextPlayer(): void {
    if (this.currentPlayer == this.players.length) this.currentPlayer = 0;
  }

  public wasCorrectlyAnswered(): boolean {
    if (this.players[this.currentPlayer].inPenaltyBox) {
      if (this.isGettingOutOfPenaltyBox) {
        console.log('Answer was correct!!!!');
        this.players[this.currentPlayer].purse += 1;
        console.log(
          this.players[this.currentPlayer] +
            ' now has ' +
            this.players[this.currentPlayer].purse +
            ' Gold Coins.',
        );

        var winner = this.didPlayerWin();
        this.currentPlayer += 1;
        this.setNextPlayer();

        return winner;
      } else {
        this.currentPlayer += 1;
        this.setNextPlayer();
        return true;
      }
    } else {
      console.log('Answer was corrent!!!!');

      this.players[this.currentPlayer].purse += 1;
      console.log(
        this.players[this.currentPlayer] +
          ' now has ' +
          this.players[this.currentPlayer].purse +
          ' Gold Coins.',
      );

      var winner = this.didPlayerWin();

      this.currentPlayer += 1;
      this.setNextPlayer();

      return winner;
    }
  }
}
