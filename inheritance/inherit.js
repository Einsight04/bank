const path = require("path")
const db = require('../db-connection/mysql')


/**
 * Prepares balance info that user receives
 *
 * @param {string} account - Account type
 * @param {number} balance - Account balance
 * @param {string} error - Error message
 *
 * @returns {Object} Info used to render balance
 */
function balanceInfo(account, balance,  error) {
    if (balance < 0.01) {
        balance = 0
    } else {
        balance = Math.round((balance + Number.EPSILON) * 100) / 100
    }

    if (account === "Checking") {
        return {
            account: account,
            checking: true,
            balance: balance.toString(),
            error: error
        }
    } else {
        return {
            account: account,
            saving: true,
            balance: balance.toString(),
            error: error
        }
    }

}


/**
 * Extends balance into subclasses
 */
class Account {
    /**
     * Assigns balance to this.balance
     *
     * @param {number} balance - Account balance
     */
    constructor(balance) {
        this.balance = balance;
    }
}

/**
 * Handles checking account related tasks including interest value and balance information
 */
class Checking extends Account {
    /**
     * Assigns interest value and error message
     *
     * @param {number} balance - Account balance
     */
    constructor(balance) {
        super(balance);
    }

    /**
     * Retrieves checking account interest
     *
     * @returns {number} Interest yield
     */
    interestAdded() {
        return (1 + 0.0001);
    }

    /**
     * Calls function to prepare balance info
     *
     * @param {string} error - Error message
     *
     * @returns {Object} Info used to render balance
     */
    viewBalance(error) {
        return balanceInfo("Checking", this.balance, error)
    }
}


/**
 * Handles saving account related tasks including interest value and balance information
 */
class Saving extends Account {
    /**
     * Assigns interest value and error message
     *
     * @param {number} balance - Account balance
     */
    constructor(balance) {
        super(balance);
    }

    /**
     * Retrieves saving account interest
     *
     * @returns {number} Interest yield
     */
    interestAdded() {
        return (1 + 0.0005);
    }

    /**
     * Calls function to prepare balance info
     *
     * @param {string} error - Error message
     *
     * @returns {Object} Info used to render balance
     */
    viewBalance(error) {
        return balanceInfo("Saving", this.balance, error)
    }
}


/**
 * Converts inches to centimeters
 *
 * @param {number} length - The length of measurement to convert
 *
 * @returns {number} The converted value
 */
class UpdateBalance {
    #res
    #uuid
    #amount
    #accountType
    /**
     * Assigns user info to handle account changes
     *
     * @param {string} accountType - The account that will be accessed
     * @param {number} amount - Amount to deposit or withdraw
     * @param {string} uuid - UUID value from users cookie
     * @param {Response} res
     *
     * @returns {number} The converted value
     */
    constructor(accountType, amount, uuid, res) {
        this.#res = res;
        this.#uuid = uuid;
        this.#amount = amount;
        this.#accountType = accountType;
    }

    /**
     * Makes a deposit into the account
     *
     * @returns {void} Reloads page with updated balance
     */
    deposit() {
        db.query("UPDATE users SET ?? = ?? + ? WHERE uuid = ?", [this.#accountType, this.#accountType, this.#amount, this.#uuid], (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Deposited $${this.#amount} into ${this.#accountType} account`);
        });
        this.#res.redirect(`/accounts/${this.#accountType}`);
    }

    /**
     * Attempts to make a withdrawal from the account
     *
     * @returns {void} Reloads page with updated balance or error message
     */
    withdraw() {
        db.query("SELECT ?? FROM users WHERE uuid = ?", [this.#accountType, this.#uuid], (err, results) => {
            if (err) {
                console.log(err);
            }

            if (this.#accountType === "saving") {
                if (this.#amount > results[0].saving) {
                    console.log("Insufficient funds")
                    return this.#res.render(path.join(__dirname, "..", "/views/account"), (new Saving(results[0].saving)).viewBalance("Insufficient funds"));
                }
            } else if (this.#accountType === "checking") {
                if (this.#amount > results[0].checking) {
                    console.log("Insufficient funds")
                    return this.#res.render(path.join(__dirname, "..", "/views/account"), (new Checking(results[0].checking)).viewBalance("Insufficient funds"));
                }
            }

            db.query("UPDATE users SET ?? = ?? - ? WHERE uuid = ?", [this.#accountType, this.#accountType, this.#amount, this.#uuid], (err) => {
                if (err) {
                    console.log(err);
                }
                console.log(`Withdrew $${this.#amount} from ${this.#accountType} account`);
                this.#res.redirect(`/accounts/${this.#accountType}`);
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