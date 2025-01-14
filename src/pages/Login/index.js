import React, { useState } from 'react';
import { isEmail } from 'validator';
import {toast} from 'react-toastify'
import { useDispatch,useSelector } from 'react-redux';
import {get} from 'lodash'

import { Container } from '../../styles/GlobalStyles';
import {Form} from './styled'
import * as actions from '../../store/modules/auth/actions'
import Loading from '../../components/Loading';


export default function Login(props) {

  const dispatch = useDispatch()
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')

  const prevPath = get(props, 'location.state.prevPath', '/')

  const isLoading = useSelector(state=>state.auth.isLoading)

  const handleSubmit = e=>{
    e.preventDefault()

    let formErrors= false

    if(!isEmail(email)){
      formErrors = true
      toast.error('Email invalido')
    }

    if(password.length < 6 || password.length > 50 ){
      formErrors = true
      toast.error('A senha precisa de ter de 6 a 50 caracteres')
    }

    if(formErrors) return

    dispatch(actions.loginRequest({email,password, prevPath}))
    
  }

  return (
    <Container>
      <Loading isLoading={isLoading}/>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <input 
          type='text' 
          value={email} 
          onChange={e=> setEmail(e.target.value)}
          placeholder='Digite seu email'
        />
        <input 
          type='password' 
          value={password} 
          onChange={e=> setPassword(e.target.value)}
          placeholder='Digite sua senha'
        />
        <button type='submit'>Entrar</button>
      </Form>
    </Container>
  );
}
