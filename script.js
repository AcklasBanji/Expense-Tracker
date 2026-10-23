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
    form.reset();

})
function display(){
    transacationList.innerHTML = "";
    if(dataBase === 0){
        emptyMessage.textContent = "No transactions yet.";
        return;

    }
    emptyMessage.textContent = "";

    dataBase.forEach((trans) =>{
        const p = document.createElement("p");
        const delButton = document.createElement("button");
        const editButton = document.createElement("button");
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
        p.append(delButton, editButton);
        transacationList.appendChild(p);
        save();
            
        })
        
}

function save(){
    localStorage.setItem("transaction", JSON.stringify(dataBase));
}
