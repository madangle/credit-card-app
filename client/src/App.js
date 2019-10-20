import React, {Component} from 'react';
import './App.css';
import CardForm from './components/cardForm';

class App extends Component {
  render () {
    return (
      <div>
        
        <div className="col-md-12">
          <h2>Credit Card System</h2>
          <hr/>
        </div>
        <CardForm />
      </div>
      );
  }
}
export default App;
