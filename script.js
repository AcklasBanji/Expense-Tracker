const dataBase = JSON.parse(localStorage.getItem("transaction")) || [];
let editingId = null;

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const TransactionTypeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const submit = document.getElementById("submit");

const transacationList = document.getElementById("transaction-list");
const emptyMessage = document.getElementById("empty-message");
const form  = document.getElementById("transaction-form");


display();
summary();

function summary(){

    const incomeShow = document.getElementById("total-income");
    const expenseShow = document.getElementById("total-expense");
    const balanceShow = document.getElementById("balance");
    
    const totalIncome = dataBase.filter(trans =>
    trans.transactionType === "income").reduce((t, trans) =>
    t + trans.amount, 0);

    const totalExpense = dataBase.filter(trans =>
        trans.transactionType === "expense"
    ).reduce((t, trans) => t + trans.amount, 0);
    const balance = totalIncome - totalExpense;
    incomeShow.textContent = `K${totalIncome.toFixed(2)}`
    expenseShow.textContent = `K${totalExpense.toFixed(2)}`
   
    if(balance < 0){
        balanceShow.textContent = `K${balance.toFixed(2)} - Over Budget!`
    }else{
        balanceShow.textContent = `K${balance.toFixed(2)}`
    }

    

}

form.addEventListener("submit", (event)=>{
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const transactionType = TransactionTypeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if(description === "" || !Number.isFinite(amount)||amount <= 0 ||transactionType === "" || category === ""){
        alert("Enter Valid Informatioin in all the Fields");
        return;
    }
    if(editingId !== null){
        const transactionToEdit = dataBase.find(s => s.id === editingId);
        if(!transactionToEdit){
            alert("Transaction  not found.");
            return;
        }


        
        transactionToEdit.description = description.trim();
        transactionToEdit.amount = amount;
        transactionToEdit.transactionType = transactionType;
        transactionToEdit.category = category;
        transactionToEdit.date = date;
        editingId = null;
        submit.textContent = "Add Transaction";
        summary();

    }else{
        const transaction = {
            id: Date.now(),
            description,
            amount,
            transactionType,
            category,
            date
        }
        dataBase.push(transaction);
        
    }
    
    save();
    display();
    summary();
    form.reset();

})


function display(){
    
    const sectionSelect = document.getElementById("filter");
    const section = sectionSelect.value;

    transacationList.innerHTML = "";
    if(dataBase.length === 0){
        emptyMessage.textContent = "No Transactions yet"
        return;
    }

    let filteredTransactions;
    if(section === "income"){
        filteredTransactions = dataBase.filter(s => s.transactionType === "income");
    }else if(section === "expense"){
        filteredTransactions = dataBase.filter(s => s.transactionType === "expense");

    }else{
        filteredTransactions = dataBase;
    }
    if(filteredTransactions.length === 0){
        emptyMessage.textContent = "No Transactions match this filter";
        return;
    }
    emptyMessage.textContent =  "";

    filteredTransactions.forEach((trans) =>{
        const transactionElement = document.createElement("div");
        const decriptionElement = document.createElement("p");
        decriptionElement.textContent = "Description: " + trans.description;

        const amountElement = document.createElement("p");
        amountElement.textContent = "Amount: K" + Number(trans.amount).toFixed(2);

        const typeElement = document.createElement("p");
        typeElement.textContent = "Type: " + trans.transactionType;
        
        const categoryElement = document.createElement("p");
        categoryElement.textContent = "Category: " + trans.category;
        
        const dateElement = document.createElement("p");
        dateElement.textContent = "Date: " + trans.date;
    
        const delButton = document.createElement("button");
        delButton.textContent = "Delete";
        delButton.addEventListener("click", ()=>{
            const index = dataBase.findIndex(s => s.id === trans.id);
            if(index !== -1){
                dataBase.splice(index, 1);
            }
            save();
            display();
            summary();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "edit";
        editButton.addEventListener("click", ()=>{
            
            editingId = trans.id;
            descriptionInput.value = trans.description;
            amountInput.value = trans.amount;
            TransactionTypeInput.value = trans.transactionType;
            categoryInput.value = trans.category;
            dateInput.value = trans.date;
            submit.textContent = "Update transaction";

        });
        transactionElement.classList.add("transaction-card");
        editButton.classList.add("transaction-button", "transaction-edit");
        delButton.classList.add("transaction-button", "transaction-delete");

        transactionElement.appendChild(decriptionElement);
        transactionElement.appendChild(amountElement);
        transactionElement.appendChild(typeElement);
        transactionElement.appendChild(categoryElement);
        transactionElement.appendChild(dateElement);
        transactionElement.appendChild(delButton);
        transactionElement.appendChild(editButton);
        transacationList.appendChild(transactionElement);
        save();
            
        });
        
}
const filterInput = document.getElementById("filter");
filterInput.addEventListener("change", ()=>{
    display();
})

function save(){
    localStorage.setItem("transaction", JSON.stringify(dataBase));
}
