import React, {Component} from 'react';
import SubeComponent from "../components/subeComponent";
import {connect} from 'react-redux';

class HomePage extends Component {


    render() {
        return (
            <div>
                <SubeComponent {...this.props}/>
            </div>
        );
    }
}

const mapStateToProps = (state,ownProps,dispatch) => ({

});

export default connect(mapStateToProps)(HomePage);

