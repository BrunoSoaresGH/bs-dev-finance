let buttonNewTransaction = document.querySelector(".button-new");
let newTransaction = document.querySelector(".modal-overlay");
let buttonCancelTransaction = document.querySelector(".button.cancel");

buttonNewTransaction.addEventListener("click", () => {
    newTransaction.classList.toggle("active");
});

buttonCancelTransaction.addEventListener("click", () => {
    newTransaction.classList.toggle("active");
});

const transactions = [
    {
        description: "Grocery",
        amount: -700,
        date: "02/03/2022",
    },
    {
        description: "Credit card",
        amount: -1100,
        date: "10/03/2022",
    },
    {
        description: "Salary",
        amount: 5500,
        date: "01/03/2022",
    },
];

const Transaction = {
    all: transactions,

    addTransaction(newTransaction) {
        Transaction.all.push(newTransaction);
        App.reload();
    },

    removeTransaction(index) {
        console.log(index);
        Transaction.all.splice(index, 1);
        App.reload();
    },

    getIncomes() {
        let totalIncomes = 0;
        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0) totalIncomes += transaction.amount;
        });
        return totalIncomes;
    },

    getExpenses() {
        let totalExpenses = 0;
        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) totalExpenses += transaction.amount;
        });
        return totalExpenses;
    },

    getTotal() {
        return this.getIncomes() + this.getExpenses();
    },
};

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.index = index;
        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img
                    src="./assets/minus.svg"
                    alt="remove transaction"
                    onclick="Transaction.removeTransaction(${index})"
                />
            </td>
            `;
        return html;
    },

    updateBalance() {
        document.querySelector("#total-incomes").innerHTML =
            Utils.formatCurrency(Transaction.getIncomes());

        document.querySelector("#total-expenses").innerHTML =
            Utils.formatCurrency(Transaction.getExpenses());

        document.querySelector("#total").innerHTML = Utils.formatCurrency(
            Transaction.getTotal()
        );
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    },
};

const Utils = {
    formatAmount(value) {
        value = Number(value);
        return Math.round(value);
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[0]}/${splittedDate[1]}/${splittedDate[2]}`;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value);

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return signal + " " + value;
    },
};

const Form = {
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    date: document.querySelector("#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        };
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();

        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === ""
        ) {
            throw new Error("Please, fill all the fields!");
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date,
        };
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateFields();
            const transaction = Form.formatValues();
            Transaction.addTransaction(transaction);
            Form.clearFields();
            newTransaction.classList.toggle("active");
        } catch (error) {
            alert(error.message);
        }
    },
};

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index);
        });

        DOM.updateBalance();
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    },
};

App.init();
