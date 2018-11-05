import React, { Component } from 'react'
import axios from 'axios';
import classnames from 'classnames';

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

      axios.post('api/users/register', newUser)
        .then(res => console.log('res.data :', res.data))
        .catch(err => this.setState({errors: err.response.data}))
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
                <div className="form-group">
                  <input 
                    type="text" 
                    className={classnames('form-control form-control-lg', {'is-invalid' : errors.name})}
                    placeholder="Name" 
                    name="name"
                    onChange={this.onChange}
                    value={this.state.name}
                    />
                    {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    className={classnames('form-control form-control-lg', {'is-invalid' : errors.email})}
                    placeholder="Email Address" 
                    name="email"
                    onChange={this.onChange}
                    value={this.state.email} />
                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <input 
                    type="password" 
                    className={classnames('form-control form-control-lg', {'is-invalid': errors.password})}
                    placeholder="Password" 
                    name="password"
                    onChange={this.onChange}
                    value={this.state.password} />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                  <input 
                    type="password" 
                    className={classnames('form-control form-control-lg', {'is-invalid': errors.passwordConfirmation})}
                    placeholder="Confirm Password" 
                    name="passwordConfirmation"
                    onChange={this.onChange}
                    value={this.state.passwordConfirmation} />
                    {errors.passwordConfirmation && (<div className="invalid-feedback">{errors.passwordConfirmation}</div>)}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Register;