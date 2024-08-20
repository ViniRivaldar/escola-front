import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';

import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios'

function* loginRequest({payload}) {
  try {
    const response = yield call(axios.post, '/token', payload)
    yield put(actions.loginSuccess({...response.data}))

    toast.success("Login Realizado com sucesso")

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`

    window.location.href = payload.prevPath;
  } catch (e) {
    toast.error('Usuario ou senha invalidos')
    yield put(actions.loginFailure())
  }
}

function persistRehydrate({payload}){
  const token = get(payload, 'auth.token', '')
  if(!token) return
  axios.defaults.headers.Authorization = `Bearer ${token}`
}

function* registerRequest({payload}){
  const {id, nome, email, password} = payload
  try {
    if(id){
      yield call(axios.put, '/user', {
        nome,
        email,
        password: password || undefined
      })

      toast.success('Conta editada com sucesso!')
      yield put(actions.registerUpdatedSuccess({nome, email, password}))
    }else{
      yield call(axios.post, '/user', {
        nome,
        email,
        password
      })

      toast.success('Conta criada com sucesso!')
      yield put(actions.registerCreatedSuccess({nome, email, password}))
      window.location.href = '/login'
    }

  } catch (e) {
    const errors = get(e, 'response.data.errors', [])
    const status = get(e, 'response.status', 0)

    if(status === 401){
      toast.error('Você precisa fazer o login novamente')
      yield put(actions.registerFailure())
      window.location.href = '/login'
      return 
    }

    if(errors.length > 0){
      errors.map(error => toast.error(error))
    }else{
      toast.error('Erro desconhecido')
    }

    yield put(actions.registerFailure())
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest)
]);
