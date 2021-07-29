class JSValidator {

    status = true;

    errors = [];

    via = 'http'

    constructor (formId) {

        this.setForm(formId);

        this.setInputs();

        this.parseInputs();

    }

    setForm (formId) {

        this.form = document.getElementById(formId);
    }

    setInputs () {

        this.inputs = document.querySelectorAll(`#${this.form.id} .JSValidator`);

    }

    setAjax() {

        this.via = 'ajax';

        return this;

    }

    setHttp() {

        this.via = 'http';

        return this;

    }

    parseInputs () {

        this.inputs.forEach( input => {

            this.appendErrorTag(input);

        });

    }

    appendErrorTag (input) {

        let parent = input.parentNode;

        let span = document.createElement('span');

        span.setAttribute("class", "error-msg");    

        parent.appendChild(span);

    }

    validateForm() {

        this.form.addEventListener('submit', (e) => {

            this.resetValidation();

            this.inputs.forEach(input => {

                this.validateInput(input);

            });

            if(!this.status) {

                e.preventDefault();

            } else {

                if (this.via == 'ajax'){

                    e.preventDefault();        
                    
                    this.submitHandler();

                } else {

                    // solo para fines demostrativos
                    e.preventDefault(); 

                    console.log('se ha enviado');


                }

            }
            
        });

    }

    validateInputs() {

        this.inputs.forEach( input => {

            input.addEventListener('input', (e) => {

                this.resetValidation();

                this.validateInput(input);

            });

        });

    }

    validateInput (input) {

        let validators = input.dataset.validators;

        if (validators !== undefined) {

            validators = validators.split(' ');

            validators.forEach(validator => {

                this[`_${validator}`](input);

            });

        }

    }

    setError(input, msg){

        this.status = false;

        this.setStackError(input, msg);

        this.setErrorMessage(input, msg);

    }

    setStackError (input, msg) {

        this.errors.push({input: input, msg: msg})

    }

    setErrorMessage (input, msg){

        let span = input.nextElementSibling;

        span.innerHTML += (msg + '<br />');

    }

    resetValidation() {

        this.status = true;

        this.resetStackError();

        this.resetErrorMessages();

    }

    resetStackError () {

        this.errors = [];

    }

    resetErrorMessages () {

        let spans = document.querySelectorAll(`#${this.form.id} .error-msg`);

        spans.forEach( span => {

            span.innerHTML = "";

        });

    }

    submitHandler() {

        let data = new FormData(this.form);

        fetch(this.form.action, {

            method: this.form.method, 
            body: data

        })

        .then(response => response.json())
        .then(data => {

            console.log(data);

        })

        .catch(error => {

            console.log(error);

        });

    }

    init () {

        this.validateForm();

        this.validateInputs();

        return this; 

    }

}


JSValidator.prototype._required = function (input) {

    let value = input.value;

    let msg = this.msg.required;

    if (value.trim() === "" || value.length < 1) {

        this.setError(input, msg);

    }

};

JSValidator.prototype._length = function (input) {



};