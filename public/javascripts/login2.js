const form = document.querySelector("form"),
eField = form.querySelector(".email"),
eInput = eField.querySelector("input"),
pField = form.querySelector(".password"),
pInput = pField.querySelector("input");

const error_box = form.querySelector(".error-box")
const error_msg = form.querySelector("#error-msg")



setInterval(()=> {
    if(error_msg.textContent.length > 0){
        error_box.hidden = false
    }else{
        error_box.hidden = true
    }
}, 100)


form.onsubmit = (e)=>{
    e.preventDefault();
    if(eInput.value == ""){ 
        eField.classList.add("error");
        error_msg.textContent = "Please enter your username."
        if (pInput.value == ""){
            pField.classList.add("error");
            error_msg.textContent = "Please enter your username and password."
        }
    }
    else if(pInput.value == ""){ 
        pField.classList.add("error");
        error_msg.textContent = "Please enter your password."
    }
    else{
        eField.classList.remove("error");
        pField.classList.remove("error");

        error_msg.textContent = ""

        // e.submit()
        document.getElementById("login-form").submit();
    }

}  