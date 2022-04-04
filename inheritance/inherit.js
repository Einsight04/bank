const db = require('../db-connection/mysql')

class Account {
    constructor(balance) {
        this.balance = balance;
    }
}

class Checking extends Account {
    constructor(balance, error) {
        super(balance);
        this.interest = (1 + 0.001);
        this.error = error;
    }

    interestAdded() {
        return this.interest;
    }

    viewBalance() {
        if (this.balance < 0.01) {
            this.balance = "0"
        } else {
            this.balance = Math.round((this.balance + Number.EPSILON) * 100) / 100
        }

        return {
            account: "Checking",
            checking: true,
            balance: this.balance,
            error: this.error
        }
    }
}

class Saving extends Account {
    constructor(balance, error) {
        super(balance);
        this.interest = (1 + 0.0005);
        this.error = error;
    }

    interestAdded() {
        return this.interest;
    }

    viewBalance() {
        if (this.balance < 0.0001) {
            this.balance = "0"
        }
        else {
            this.balance = Math.round((this.balance + Number.EPSILON) * 100) / 100
        }

        return {
            account: "Saving",
            saving: true,
            balance: this.balance,
            error: this.error
        }
    }
}


class UpdateBalance {
    constructor(accountType, amount, uuid, res) {
        this.accountType = accountType;
        this.amount = amount;
        this.uuid = uuid;
        this.res = res;
    }

    deposit() {
        db.query("UPDATE users SET ?? = ?? + ? WHERE uuid = ?", [this.accountType, this.accountType, this.amount, this.uuid], (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Deposited $${this.amount} into ${this.accountType} account`);
        });
        return this.res.redirect(`/accounts/${this.accountType}`);
    }

    withdraw() {
        db.query("SELECT ?? FROM users WHERE uuid = ?", [this.accountType, this.uuid], (err, results) => {
            if (err) {
                console.log(err);
            }

            if (this.accountType === "saving") {
                if (this.amount > results[0].saving) {
                    console.log("Insufficient funds")
                    return this.res.render("account", (new Saving(results[0].saving, "Insufficient funds")).viewBalance());
                }
            } else if (this.accountType === "checking") {
                if (this.amount > results[0].checking) {
                    console.log("Insufficient funds")
                    return this.res.render("account", (new Checking(results[0].checking, "Insufficient funds")).viewBalance());
                }
            }

            db.query("UPDATE users SET ?? = ?? - ? WHERE uuid = ?", [this.accountType, this.accountType, this.amount, this.uuid], (err) => {
                if (err) {
                    console.log(err);
                }
                console.log(`Withdrew $${this.amount} from ${this.accountType} account`);
                return this.res.redirect(`/accounts/${this.accountType}`);
            });
        });
    }
}


module.exports = {
    Account: Account,
    Saving: Saving,
    Checking: Checking,
    UpdateBalance: UpdateBalance
}