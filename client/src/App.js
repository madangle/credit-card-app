import React, {Component} from 'react';
import './App.css';
import Cards from './components/cards';
import CardForm from './components/cardForm';
import * as Configuration from './config';

class App extends Component {
  state = {
    cards: []
  }
  componentDidMount(){
    fetch(Configuration.API_URL+'getall')
    .then(res => res.json())
    .then((data) => {
      this.setState({cards: data})
    })
    .catch(console.log)
  }
  render () {
    return (
      <div>
        
        <div className="col-md-12">
          <h2>Credit Card System</h2>
          <hr/>
        </div>
        <CardForm />
        <br/> <hr/>
        <Cards cards={this.state.cards} />
      </div>
      );
  }
}
export default App;
