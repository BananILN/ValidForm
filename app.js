let prevBtn;
let nextBtn;
let submitBtn;

let currentStep = 1;

let validInputs = 0;
let inputsInSteps = -1;


function ShowStep(){
    const steps = document.querySelectorAll(".form-step");
    steps.forEach((step,idx)=>{
        if(idx +1 === currentStep){
            step.style.display = 'block';
        }else{
            step.style.display = 'none';
        }
    });

    if(currentStep === steps.length){
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    }else{
        nextBtn.style.display ='block';
        submitBtn.style.display = 'none';
    }

    if(currentStep > 1 ){
        prevBtn.style.display = 'block';
    }else{
        prevBtn.style.display = 'none';
    }

    SetButtonEnabled();
}

function prevStep(){
    unsubscribeInputChange()
    currentStep--;
    ShowStep();
    subscribeinputChange() 
    updateStepsIndicators(1);

}
function nextStep(){
    if(!validateStep()) return;
    unsubscribeInputChange()
    currentStep++;
    ShowStep();
    subscribeinputChange()

    updateStepsIndicators(-1);
     

}

function updateStepsIndicators(diff){
    const currentInd = document.querySelector(`#step-${currentStep}`);
    const prevInd = document.querySelector(`#step-${currentStep + diff}`); 

    if(prevInd){
        prevInd.removeAttribute('data-active')
    }
    if(currentInd){
        currentInd.setAttribute('data-active','');
    }
}

function validateStep(){
    const inputs = document.querySelectorAll(`#form-step-${currentStep} .input`)
    let isValid = true;


    for(const input of inputs){
        isValid = validateInput(input) && isValid;
    }
    return isValid
}

function validateInput(input){
    const errorText = document.querySelector(`p#${input.getAttribute('name')}-error`);

    let isInputValid = true;

    if(!input.checkValidity()){
        isInputValid = false;
        errorText.innerHTML = input.validationMessage;
    }else{
        errorText.innerHTML = '';
    }

    return isInputValid;

}

function SetButtonEnabled(){
    const shouldBeEnabled = inputsInSteps == validInputs;
    const btn = submitBtn.style.display != 'none' ? submitBtn : nextBtn;
    if(shouldBeEnabled){
        nextBtn.removeAttribute('disabled');
    }else{
        nextBtn.setAttribute("disabled",'')
    }
}

function onInputchange(e){
    if(validateInput(e.target)){
        validInputs++;
    }

    SetButtonEnabled();
}

function subscribeinputChange()
{
    const inputs = document.querySelectorAll(`#form-step-${currentStep} .input`);
    inputsInSteps = inputs.length;
    validInputs= 0 ;

    inputs.forEach(input =>{
        input.addEventListener('change', onInputchange);
    })
}

function unsubscribeInputChange(){
const inputs = document.querySelectorAll(`#from-step-${currentStep} .input`);
    inputs.forEach(input =>{
        input.removeEventListener('change', onInputchange);
    })
}

    function sendForm(e){
        e.preventDefault();

        const form = e.target;
        const data = new FormData(form);
        fetch("http://127.0.0.1:5500/",{
            method: 'POST',
            body: data,
        })
        .then(res => res.json())
        .then(console.log())
        .catch((e)=>{
            form.reset();
        });
    }


window.addEventListener('load', () =>{
    const form = document.forms.namedItem('contact-form');
    form.addEventListener('submit',sendForm);
    prevBtn = document.querySelector('#prev-step-btn');
    nextBtn = document.querySelector('#next-step-btn');
    submitBtn = document.querySelector('#submit-step-btn');
    
    subscribeinputChange()

    ShowStep();
   
    
})

