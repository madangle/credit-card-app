import React, {Component} from 'react';
import { FormErrors } from './cardErrors';
import * as Configuration from './../config';

class CardForm extends Component {

    constructor (props) {
        super(props);
        this.state = {
            cardName: '',
            cardNumber: '',
            cardLimit: '',
            formErrors: {cardName: '', cardNumber: '', cardLimit: ''},
            cardNameValid: false,
            cardNumberValid: false,
            cardLimitValid: false,
            formValid: false,
            cardAdded: false,
            cards: []
        }
    }

    fetchAllCards = () => {
        fetch(Configuration.API_URL+'getall')
        .then(res => res.json())
        .then((data) => {
          this.setState({cards: data})
        })
        .catch(console.log)
    }
    
    componentDidMount(){
        this.fetchAllCards();
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value}, () => { this.validateField(name, value) });
    }
    
    validateCreditCardNumber = (ccNum) => {
        //only four main card services are validated
        var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        var amexpRegEx = /^(?:3[47][0-9]{13})$/;
        var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        var isValid = false;
      
        if (visaRegEx.test(ccNum)) {
          isValid = true;
        } else if(mastercardRegEx.test(ccNum)) {
          isValid = true;
        } else if(amexpRegEx.test(ccNum)) {
          isValid = true;
        } else if(discovRegEx.test(ccNum)) {
          isValid = true;
        }
      
        return isValid;
    }
    
    validateLuhn = (value) => {
        if (/[^0-9-\s]+/.test(value)) return false;
        let nCheck = 0, bEven = false;
        value = value.replace(/\D/g, "");
        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);
            if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

            nCheck += nDigit;
            bEven = !bEven;
        }
        return (nCheck % 10) === 0;
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let cardNameValid = this.state.cardNameValid;
        let cardNumberValid = this.state.cardNumberValid;
        let cardLimitValid = this.state.cardLimitValid;

        switch(fieldName) {
            case 'cardName':
                cardNameValid = value.length >= 3;
                fieldValidationErrors.cardName = cardNameValid ? '' : 'Card name should contain minimum 3 letters';
                break;
            case 'cardNumber':
                cardNumberValid = this.validateLuhn(value);
                fieldValidationErrors.cardNumber = cardNumberValid ? '': ' Card number is invalid. Please provide a valid card number';
                break;
            case 'cardLimit':
                cardLimitValid = (typeof parseInt(value) == "number");
                fieldValidationErrors.cardLimit = cardLimitValid ? '' : ' Card limit should be a valid number';
                break;

            default:
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            cardNameValid: cardNameValid,
            cardNumberValid: cardNumberValid,
            cardLimitValid: cardLimitValid
        }, this.validateForm);
    }
    
    validateForm() {
        let isFormValid = this.state.cardNameValid && this.state.cardNumberValid && this.state.cardLimitValid;
        this.setState({formValid: isFormValid});
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }

    submitForm = (event) => {
        event.preventDefault();
        fetch(Configuration.API_URL+'add', {
			method: 'POST',
			body: JSON.stringify({
				name: this.state.cardName,
				number: parseInt(this.state.cardNumber),
				limit: parseInt(this.state.cardLimit)
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		}).then(response => {
            return response.json()
        }).then(res => {
            if(res._id !== undefined){
                this.setState({
                    cardAdded: true
                });
                this.fetchAllCards();
            }
        });
    }

    render () {
        return (
            <div className="col-md-12">
                <div className="col-md-6">
                    <h3>Add Card</h3>
                    <div className="panel panel-default">
                        <FormErrors formErrors={this.state.formErrors} />
                        {this.state.cardAdded ? <div className="alert alert-success"> Successfully added the card </div> : null }
                    </div>
                    <form onSubmit = {this.submitForm}>
                        <div className={`form-group ${this.errorClass(this.state.formErrors.cardName)}`}>
                            <label htmlFor="cardName">Card Name</label>
                            <input type="text" className="form-control" id="cardName" name="cardName" aria-describedby="cardNameHelp" 
                                placeholder="Enter Card Name"
                                value={this.state.cardName}
                                onChange={this.handleUserInput}  />
                            <small id="cardNameHelp" className="form-text text-muted">Please provide your full name</small>
                        </div>
                        <div className={`form-group ${this.errorClass(this.state.formErrors.cardNumber)}`}>
                            <label htmlFor="exampleInputCardNumber">Card Number</label>
                            <input type="number" className="form-control" id="CardNumber" name="cardNumber" 
                            placeholder="Enter Card Number"
                            value={this.state.cardNumber}
                                onChange={this.handleUserInput}  />
                            <small id="cardNumberHelp" className="form-text text-muted">Please provide a valid card number</small>
                        </div>
                        <div className={`form-group ${this.errorClass(this.state.formErrors.cardLimit)}`}>
                            <label htmlFor="cardLimit">Card Limit</label>
                            <input type="number" className="form-control" id="cardLimit" name="cardLimit" aria-describedby="cardLimitHelp" 
                            placeholder="Enter Card Limit"
                            value={this.state.cardLimit}
                                onChange={this.handleUserInput}
                            />
                            <small id="cardLimitHelp" className="form-text text-muted">Please provide a valid limit</small>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Add</button>
                    </form>
                </div>
                <br/> <hr/>
                <div className="col-md-12">
                    <h3>Existing Cards</h3>
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Card Number</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Limit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cards.map((card) => (
                            <tr key={card._id}>
                                <td>{card.name}</td>
                                <td>{card.number}</td>
                                <td>{card.balance}</td>
                                <td>{card.limit}</td>
                            </tr>
                            ))}                            
                        </tbody>
                    </table>                    
                </div>
            </div>
        )
    }
};

export default CardForm;