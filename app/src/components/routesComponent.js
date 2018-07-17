import React, {Component} from 'react';
import {Route,Switch,withRouter } from 'react-router-dom'
import HomePage from "../pages/homePage";
import {connect} from "react-redux";

class RoutesComponent extends Component {
    render() {
        return (
            <section className="content-root">
                <Switch>

                    {/*<Route exact path="/app" component={HomePage}/>*/}
                    <Route exact path="/" component={HomePage}/>

                </Switch>
            </section>
        );
    }
}

const mapToStateProps = (state, dispatch) => {
    return {
        dispatch: dispatch,
    };
};
export default withRouter(connect(mapToStateProps)(RoutesComponent));

