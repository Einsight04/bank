class Account {
    constructor(balance) {
        this.balance = balance;
    }
} class Checking extends Account {
    constructor(balance) {
        super(balance);
        this.interest = (1 + 0.05)
    }
    newBalance() {
        return this.balance * this.interest
    }
} class Saving extends Account {
    constructor(balance) {
        super(balance);
        this.interest = (1 + 0.01)
    }
    newBalance() {
        return this.balance * this.interest
    }
}


module.exports = {
    Account: Account,
    Saving: Saving,
    Checking: Checking
}

