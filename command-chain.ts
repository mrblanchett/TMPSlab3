interface Teapot {
    MakeTea(): void;
}

class SimpleTea implements Teapot {
    private payload: string;

    constructor(payload: string) {
        this.payload = payload;
    }

    public MakeTea(): void {
        console.log(`Tea Machine: Hi, I am brewing (${this.payload})`);
    }
}

class BubbleTea implements Teapot {
    private receiver: BubbleMaker;
    private a: string;
    private b: string;

    constructor(receiver: BubbleMaker, a: string, b: string) {
        this.receiver = receiver;
        this.a = a;
        this.b = b;
    }

    public MakeTea(): void {
        console.log('Bubble Tea Machine: Will be done by a Bubble Helper.');
        this.receiver.MakeBeverage(this.a);
        this.receiver.MakeBubbles(this.b);
    }
}

class BubbleMaker {
    public MakeBeverage(a: string): void {
        console.log(`Bubble Helper: Working on ${a} beverage.`);
    }

    public MakeBubbles(b: string): void {
        console.log(`Bubble Helper: Also working on ${b}.`);
    }
}

class Invoker {
    public LetsBrew(myPot: Teapot): void {
        myPot.MakeTea();
    }
}

interface DrinkMaker {
    setNext(handler: DrinkMaker): DrinkMaker;
    brew(request: string): string;
}

abstract class AbstractDrinkMaker implements DrinkMaker
{
    private nextHandler: DrinkMaker;

    public setNext(handler: DrinkMaker): DrinkMaker {
        this.nextHandler = handler;
        return handler;
    }

    public brew(request: string): string {
        if (this.nextHandler) {
            return this.nextHandler.brew(request);
        }
        return null;
    }
}

class TeaHandler extends AbstractDrinkMaker {
    public brew(request: string): string {
        if (request === 'Tea') {
            const invoker = new Invoker();
            invoker.LetsBrew(new SimpleTea('Mint'));
            return `Tea maker: Got your ${request}.`;
        }
        return super.brew(request);
    }
}

class BubbleTeaHandler extends AbstractDrinkMaker {
    public brew(request: string): string {
        if (request === 'Bubble Tea') {
            const invoker = new Invoker();
            invoker.LetsBrew(new BubbleTea(receiver, 'Blueberry', 'Double bubbles'));
            return `Bubble Tea maker: Got your ${request}.`;
        }
        return super.brew(request);
    }
}

class CoffeeHandler extends AbstractDrinkMaker {
    public brew(request: string): string {
        if (request === 'Coffee') {
            return `Coffee maker: I'll brew you ${request}.`;
        }
        return super.brew(request);
    }
}

class MilkshakeHandler extends AbstractDrinkMaker {
    public brew(request: string): string {
        if (request === 'Milkshake') {
            return `Milkshake maker: I'll mix you a ${request}.`;
        }
        return super.brew(request);
    }
}


function clientCode(handler: DrinkMaker) {
    const drinks = ['Milkshake', 'Tea', 'Bubble Tea', 'Coffee', 'Water'];

    for (const drink of drinks) {
        console.log(`Client: Make me a ${drink}`);

        const result = handler.brew(drink);
        if (result) {
            console.log(`${result}`);
        } else {
            console.log(`No one can make a ${drink}.`);
        }
    }
}

const tea = new TeaHandler();
const bubbletea = new BubbleTeaHandler();
const milkshake = new MilkshakeHandler();
const coffee = new CoffeeHandler();
const receiver = new BubbleMaker();

tea.setNext(bubbletea).setNext(milkshake).setNext(coffee);

clientCode(tea);