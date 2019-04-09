# TMPS

## Lab №3
 - Chain of Responsibility and Command are implemented in 'command-chain.ts'
 - Mediator, Observer and State patterns are implemented in 'mediator-observer-state.ts'

### Chain of Responsibility Pattern
Chain of Responsibility is a behavioral design pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.

```
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
```

### Command Pattern
Command is a behavioral design pattern that turns a request into a stand-alone object that contains all information about the request. This transformation lets you parameterize methods with different requests, delay or queue a request’s execution, and support undoable operations.

```
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
```

### Mediator Pattern
Mediator is a behavioral design pattern that lets you reduce chaotic dependencies between objects. The pattern restricts direct communications between the objects and forces them to collaborate only via a mediator object.

```
interface Teacher {
    tell(sender: object, event: number): void;
}

class EnglishTeacher implements Teacher {
    private student: Student;
    private admin: Admin;

    constructor(s: Student, a: Admin) {
        this.student = s;
        this.student.setTeacher(this);
        this.admin = a;
        this.admin.setTeacher(this);
    }    

    public tell(sender: object, event: number): void {
        const context = new Context(new Perceive());
        if (event < 5) {
            console.log('Teacher reacts to a poorly done homework');
            this.student.RedoHomework();
            this.admin.TellParents();
            context.PoorJob();
        }

        if (event > 4 && event < 8) {
            console.log('Teacher reacts to an okay done homework');
        }

        if (event > 7) {
            console.log('Teacher reacts to a well done homework');
            context.GoodJob();
        }
    }
}
```

### Observer Pattern
Observer is a behavioral design pattern that lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they’re observing.

```
interface Admin {
    update(subject: Student): void;
    setTeacher(teacher: Teacher): void;
    TellParents(): void;
}

class Principal implements Admin {
    public update(subject: Student): void {
        if (subject.state < 4) {
            console.log('Principal: My students are underperforming');
        }
    }

    public TellParents(): void {
        console.log('Principal: Gotta call parents');
    }
    }
}
```

### State Pattern
State is a behavioral design pattern that lets an object alter its behavior when its internal state changes. It appears as if the object changed its class.

```
abstract class TeacherAction {
    protected context: Context;
    public setContext(context: Context) {
        this.context = context;
    }
    public abstract praise(): void;
    public abstract advice(): void;
}

class Perceive extends TeacherAction {
    public praise(): void {
        console.log('Acknowledged');
        const reaction = new GivePraise()
        this.context.transitionTo(reaction);
        reaction.praise();
    }
    public advice(): void {
        console.log('Acknowledged');
        const reaction = new GiveAdvice()
        this.context.transitionTo(reaction);
        reaction.advice();
    }
}

class GivePraise extends TeacherAction {
    public praise(): void {
        console.log('Proud face ready. Good job, kid!');
    }
    public advice(): void {
        console.log('Gotta put on my stern face');
        const reaction = new GiveAdvice()
        this.context.transitionTo(reaction);
        reaction.advice();
    }
}

class GiveAdvice extends TeacherAction {
    public praise(): void {
        console.log('Gotta put on my proud face');
        const reaction = new GivePraise()
        this.context.transitionTo(reaction);
        reaction.praise();
    }
    public advice(): void {
        console.log('Stern face ready. Gonna give advice');
    }
}
```
