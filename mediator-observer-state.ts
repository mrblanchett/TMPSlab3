interface Student {
    state: number;
    attach(observer: Admin): void;
    detach(observer: Admin): void;
    notify(): void;

    setTeacher(teacher: Teacher): void;

    RedoHomework(): void;
}

class MiddleSchoolStudent implements Student {
    public state: number;
    private observers: Admin[] = [];

    public attach(observer: Admin): void {
        console.log('Student: I am being watched');
        this.observers.push(observer);
    }

    public detach(observer: Admin): void {
        const observerIndex = this.observers.indexOf(observer);
        this.observers.splice(observerIndex, 1);
        console.log('Student: I am not being watched');
    }

    public notify(): void {
        console.log('Student: Yo, I did my homework');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    public DoHomework(): void {
        console.log('Student: I\'m doing homework.');
        this.state = Math.floor(Math.random() * (10 + 1));
        console.log('Student: it was graded ', this.state);
        this.notify();
        this.teacher.tell(this, this.state);
    }

    public RedoHomework(): void {
        console.log('Student: I redid my bad homework');
    }

    //teacher as a mediator
    protected teacher: Teacher;
    public setTeacher(teacher: Teacher): void {
        this.teacher = teacher;
    }
}


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

    //teacher as a mediator
    protected teacher: Teacher;
    public setTeacher(teacher: Teacher): void {
        this.teacher = teacher;
    }
}

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

class Context {
    private action: TeacherAction;

    constructor(action: TeacherAction) {
        this.transitionTo(action);
    }

    public transitionTo(action: TeacherAction): void {
        console.log('Switching to', (<any>action).constructor.name);
        this.action = action;
        this.action.setContext(this);
    }

    public GoodJob(): void {
        this.action.praise();
    }

    public PoorJob(): void {
        this.action.advice();
    }
}

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

const kid = new MiddleSchoolStudent();

const principal = new Principal();
const teacher = new EnglishTeacher(kid, principal);
kid.attach(principal);

kid.DoHomework();
console.log('\n');
kid.DoHomework();
console.log('\n');
kid.DoHomework();