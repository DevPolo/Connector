import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
    }
  }

  componentDidMount() {
    // If user authenticated, redirection to dashboard
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }
  
  onSubmit = (e) => {
      e.preventDefault();
      const newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        passwordConfirmation: this.state.passwordConfirmation,
      }
    this.props.registerUser(newUser, this.props.history);
  }

  render() {

    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup 
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />

                <TextFieldGroup 
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar so if you want a profile image, use a Gravatar"
                />

                <TextFieldGroup 
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <TextFieldGroup 
                  placeholder="Confirm your password"
                  name="passwordConfirmation"
                  type="password"
                  value={this.state.passwordConfirmation}
                  onChange={this.onChange}
                  error={errors.passwordConfirmation}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />

              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// PropTypes
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));