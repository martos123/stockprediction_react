import React, { Component } from "react";


import "./Home.css";
import { train } from "./model";
import CanvasJSReact from "../canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const token = "demo"; //your token here

var stock_symbol = "";
var name = "";
var url = "";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock_symbol: "",
      stock: [],
      predicted: [],
      epochs: null,
      n_input: null,
      batch_size: null,
      disabled: true,
      disabledStock: false,
      isLoading: false,
      epoch: 0

    };
    this.updateForm = this.updateForm.bind(this);
    this.updateEpoch = this.updateEpoch.bind(this);
    this.updateBatch = this.updateBatch.bind(this);
    this.updateN = this.updateN.bind(this);
  }

  handleClick = async () => {
    try {
      this.setState({disabled: true});
      this.setState({disabledStock: true})
      this.setState({epoch: 0})
      const fetchData = await fetch(url);
      const stock = await fetchData.json();
      var data_stock = [];
      var keys = [];

      for (let key in stock) {
        keys.push(key);
      }

      var k = 0;

      for (var i in stock[keys[1]]) {
        let key = Object.keys(stock[keys[1]][i])[0];
        data_stock[k] = {
          x: new Date(i),
          y: parseFloat(stock[keys[1]][i][key])
        };
        k++;
      }
      this.setState({isLoading: true})
      const callback = (epoch, log) => {
        console.log(epoch + 1 + " of " + this.state.epochs + "\n" + log.loss);
        this.setState({epoch: epoch+1});
      };
      const hist = await train(
        data_stock,
        parseInt(this.state.epochs),
        parseInt(this.state.batch_size),
        parseInt(this.state.n_input),
        callback
      );
      const date_predicted = data_stock
        .slice(data_stock.length - this.state.n_input, data_stock.length)
        .map(item => item.x);
      var data_predicted = [];
      for (let i = 0; i < date_predicted.length; i++) {
        data_predicted[i] = {
          x: date_predicted[i],
          y: hist.price[i]
        };
      }
      data_stock = data_stock.slice(
        data_stock.length - this.state.n_input - 60,
        data_stock.length
      );
      this.setState({ stock: data_stock, predicted: data_predicted });

      data_stock = [];
      keys = [];
      this.setState({disabled: false})
      this.setState({disabledStock: false})
      
    } catch (error) {
      console.log(error);
      this.setState({disabled: false});
      this.setState({disabledStock: false})
      
    }
  };

  handleApple = () => {
    stock_symbol = "AAPL";
    name = "Apple";
    url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock_symbol}&apikey=${token}`;
    this.setState({disabled: false})
    
  };
  handleTesla = () => {
    stock_symbol = "TSLA";
    name = "Tesla"
    url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock_symbol}&apikey=${token}`;
    this.setState({disabled: false})
    
  };
  handleBitcoin = () => {
    name = "Bitcoin"
    url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${token}`;
    this.setState({disabled: false})
    
  };

  updateEpoch = e => {
    this.setState({ epochs: e.target.value });
  };
  updateN = e => {
    this.setState({ n_input: e.target.value });
  };
  updateBatch = e => {
    this.setState({ batch_size: e.target.value });
  };

  updateForm = e => {
    e.preventDefault();
    this.handleClick();
    
  };

  render() {
    const option = {
      theme: "ligh2",
      title: {
        text: `Stock Price of ${name}`
      },
      axisY: {
        title: "Price in USD",
        prefix: "$",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      data: [
        {
          type: "line",
          name: "Real",
          showInLegend: true,
          xValueFormatString: "MMM YYYY",
          yValueFormatString: "$#,##0.00",
          dataPoints: this.state.stock
        },
        {
          type: "line",
          name: "Predicted",
          showInLegend: true,
          xValueFormatString: "MMM YYYY",
          yValueFormatString: "$#,##0.00",
          dataPoints: this.state.predicted
        }
      ]
    };

    return (
      
        <div>
          <div className="main-container">
            <nav>
              <ul className='nav-links'>
                <li className='list-link'>
                  <button disabled={this.state.disabledStock} onClick={this.handleApple}>Apple</button>
                </li>
                <li className='list-link'>
                  <button disabled={this.state.disabledStock} onClick={this.handleTesla}>Tesla</button>
                </li>
                <li className='list-link'>
                  <button disabled={this.state.disabledStock} onClick={this.handleBitcoin}><a>Bitcoin</a></button>
                </li>
              </ul>
              <div className="form-div">
          <form className="model-form" onSubmit={this.updateForm}>
            <label htmlFor="epochs">Epochs</label>
            <input
              name="epochs"
              type="number"
              value={this.state.epochs}
              onChange={this.updateEpoch}
              required
            />
            <label htmlFor="n_input">Predicting for x days</label>
            <input
              name="n_input"
              type="number"
              value={this.state.n_input}
              onChange={this.updateN}
              required
            />
            <label htmlFor="batch">Batch size</label>
            <input
              name="batch"
              type="number"
              value={this.state.batch_size}
              onChange={this.updateBatch}
              required
            />
            <button disabled={this.state.disabled} className="submit_button" type="submit">
              Train & predict{" "}
            </button>
          </form>
        </div>
            </nav>
          

          <div className="chart">
            <CanvasJSChart options={option} />
          </div>
        </div>
        <div>
          {this.state.isLoading ? <div  className='epoch-container'>{this.state.epoch}. epoch of {this.state.epochs}</div> : ""}
        </div>
       </div>
      
    );
  }
}
export default Home;
