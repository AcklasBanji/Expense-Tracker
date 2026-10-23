const dataBase = JSON.parse(localStorage.getItem("transaction")) || [];

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const TransactionTypeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");
const transacationList = document.getElementById("transaction-list");
const emptyMessage = document.getElementById("empty-message");
const form  = document.getElementById("transaction-form");

display();


form.addEventListener("submit", (event)=>{
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = amountInput.value;
    const transactionType = TransactionTypeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    if(description === "" || transactionType === "" || category === ""){
        alert("Fill in all the Fields");
        return;
    }

    const transaction = {
        id:Date.now(),
        description,
        amount,
        transactionType,
        category,
        date
    }

    dataBase.push(transaction);
    save();
    descriptionInput.value = "";
    amountInput.value = "";
    TransactionTypeInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";

})

function display(){
    transacationList.innerHTML = "";

    if(dataBase.length === 0 || !dataBase){
        emptyMessage.textContent = "No transactions yet.";
        return;
    }
    emptyMessage.textContent = "";
    
    dataBase.forEach((trans) =>{
        const p = document.createElement("p");
        const delButton = document.createElement("button");
        p.innerHTML = ` Description: ${trans.description}<br>
        Amount in Kwacha: k${trans.amount}<br>
        Type: ${trans.transactionType}<br>
        Category: ${trans.category}<br>
        Date: ${trans.date}
        `;
        delButton.textContent = "delete";
        delButton.addEventListener("click", ()=>{
            const index = dataBase.findIndex(s => s.id === trans.id);
            if(index !== -1){
                dataBase.splice(index, 1);
            }
            save();
            display();
        });
        p.append(delButton);
        transacationList.appendChild(p);
       
    })
    save();
}
function save(){
    localStorage.setItem("transaction", JSON.stringify(dataBase));
}
