import React, {Component} from "react";
import {Button} from "helpers/reactstrap";

class Tribble extends Component {
  tribbles = 0;
  tribblesTimer = 0;
  breed = 0;
  multiplier = 0;

  addTribble = () => {
    clearTimeout(this.tribblesTimer);
    this.tribbles++;
    if(document.getElementById("tribbles")) {
      document.getElementById("tribbles").innerHTML = "Tribbles: " + (this.tribbles < 999 ? this.tribbles : "999+");
    }
    this.tribbles < 999 ? this.tribblesTimer = setTimeout(this.addTribble, Math.max(Math.round((((10*this.multiplier*Math.log(this.tribbles+1))/(Math.log(2)))-((10*this.multiplier*Math.log(this.tribbles))/(Math.log(2))))*60000)), 500) : null;
  }

  tribbleBtn = () => {
    this.tribbles = Math.floor(Number(prompt("Update Number Of Tribbles:")))-1;
    if(this.tribbles > -1) {
      this.breed = prompt("Fast, Normal, Slow", "Normal");
      this.multiplier = this.breed == "Fast" ? 0.8 : this.breed == "Normal" ? 1.0 : this.breed == "Slow" ? 1.2 : 1.0;
      this.addTribble();
    }
  }
  
  render() {
    return (
      <div className="pull-left">
        <Button
          color={"success"}
          size="sm"
          id="tribbles"
          onClick={this.tribbleBtn}
        >
          Tribbles: 0
        </Button>
      </div>
    );
  }
}

export default Tribble;
