import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";

export class App extends Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.web3 = await getWeb3();
        console.log(this.web3.version);
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">¡Reconocimientos!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">

                    </Panel>
                </div>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Productos disponibles">


                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Tus compras">

                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}