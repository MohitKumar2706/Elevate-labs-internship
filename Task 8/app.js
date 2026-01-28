//To DO  App

let taskinput=document.querySelector(".TD input");
let taskbtn=document.querySelector(".TD button");
let taskOl=document.querySelector(".TD ol");


taskbtn.addEventListener("click", function(e){
    //! Create a new <li> for the task
    let li=document.createElement("li");
    li.innerText=taskinput.value;
    taskinput.value="";
    taskOl.appendChild(li);


    //! Create delete button for that task
    let bt=document.createElement("Button");
    bt.innerText="Delete";
    bt.classList.add("Delete")
    li.appendChild(bt);

})

//! Event delegation on <ol> for handling deletes
taskOl.addEventListener("click", function(e){
    if(e.target.tagName=="BUTTON")
    {
        e.target.parentElement.remove();      //! Remove the parent <li> of that button (the entire task)
    }
})



