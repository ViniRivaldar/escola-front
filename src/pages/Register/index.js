import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify'
import { isEmail } from 'validator';
import{useSelector, useDispatch}from 'react-redux'

import { Container } from '../../styles/GlobalStyles';
import {Form} from './styled'
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions'



export default function Register() {

  const dispatch= useDispatch()

  const id = useSelector(state=>state.auth.user.id)
  const emailStorage = useSelector(state=>state.auth.user.email)
  const nomeStorage = useSelector(state=>state.auth.user.nome)
  const isLoading = useSelector(state => state.auth.isLoading)

  const[nome, setNome] = useState('')
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')

  useEffect(()=>{
    if(!id)return

    setEmail(emailStorage)
    setNome(nomeStorage)
  },[id,emailStorage,nomeStorage])

  const handleSubmit = async (e) =>{
    e.preventDefault()
    let formErrors = false

    if(nome.length < 3 || nome.length > 255 ){
      formErrors = true
      toast.error('Nome tem que ter entre 3 a 255 letras')
    }

    if(!isEmail(email)){
      formErrors = true
      toast.error('email invalido')
    }

    if(!id && (password.length < 6 || password.length > 50)){
      formErrors = true
      toast.error('A senha tem que ter mais de 6 e menos de 50 caracter')
    }


    if(formErrors)return

    dispatch(actions.registerRequest({id, nome, email, password}))

  }

  return (
    <Container>
      <Loading isLoading={isLoading}/>
      <h1>{id ? 'Edite sua conta' : 'Crie sua Conta'}</h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor='nome'>
          Nome:
          <input 
            type='text' 
            value={nome} 
            onChange={e=>setNome(e.target.value)}
            placeholder='Digite seu nome'
          />
        </label>
        <label htmlFor='email'>
          Email:
          <input 
            type='text' 
            value={email} 
            onChange={e=>setEmail(e.target.value)}
            placeholder='Digite seu email'
          />
        </label>
        <label htmlFor='password'>
          Password:
          <input 
            type='password' 
            value={password} 
            onChange={e=>setPassword(e.target.value)}
            placeholder={id ? 'Modifique sua senha, opcional' :'Digite sua senha'}
          />
        </label>
        <button type='submit'>{id ? 'Salvar' : 'Criar conta'}</button>
      </Form>
    </Container>
  );
}
