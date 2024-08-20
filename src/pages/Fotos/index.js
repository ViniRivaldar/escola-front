import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';


import { Container } from '../../styles/GlobalStyles';
import {Title, Form} from './styled'
import Loading from '../../components/Loading'
import axios from '../../services/axios'
import * as actions from '../../store/modules/auth/actions'


export default function Fotos() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams()
  const[isLoading, setIsLoading] = useState(false)
  const [foto, setFoto] = useState('') 

  useEffect(()=>{
    const getData = async ()=>{
      try {
        setIsLoading(true)
        const {data} = await axios.get(`/alunos/${id}`)
        setFoto(get(data, 'Fotos[0].url', ''))
        setIsLoading(false)
      } catch {
        toast.error('Error ao obter imagen')
        setIsLoading(false)
        navigate('/')
      }
    }

    getData()
  },[id, navigate])

  const handleChange = async (e) =>{
    const file = e.target.files[0]
    const fotoUrl = URL.createObjectURL(file);

    setFoto(fotoUrl)

    const formData = new FormData()

    formData.append('aluno_id', id)
    formData.append('foto',file)

    try {
      setIsLoading(true)
      await axios.post('/fotos/', formData, {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Foto enviada')
      setIsLoading(false)

      navigate('/')
    } catch (err) {
      setIsLoading(false)
      toast.error('Erro ao enviar foto')

      dispatch(actions.loginFailure())
      
    }


  }

  return (
    <Container>
      <Loading isLoading={isLoading}/>

      <Title>Fotos</Title>

      <Form>
        <label htmlFor='foto'>
          {foto ? <img src={foto} alt='foto'/> : 'Selecionar foto'}
          <input type='file' id='foto' onChange={handleChange}/>
        </label>
      </Form>
    </Container>
  );
}