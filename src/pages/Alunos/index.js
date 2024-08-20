import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get } from 'lodash'
import {FaUserCircle,FaEdit, FaWindowClose, FaExclamation} from 'react-icons/fa'

import { Container } from '../../styles/GlobalStyles';
import {AlunoContainer,ProfilePicture, NovoAluno} from './styled'
import axios from '../../services/axios'
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';



export default function Alunos() {

  const navigate = useNavigate()
  const[alunos, setAlunos] = useState([])
  const[isLoading, setIsloading] = useState(false)

  useEffect(() => {
    async function getData() {
      setIsloading(true)
      const response = await axios.get('/alunos');
      setAlunos(response.data);
      setIsloading(false)
    }
  
    getData();
  }, []);

  const handleDeleteAsk = e=>{
    e.preventDefault()
    const exclamation = e.currentTarget.nextSibling
    exclamation.setAttribute('display','block')
    e.currentTarget.remove()
  }

  const handleDelete = async (e,id,index)=>{
    e.persist()

    try {
      setIsloading(true)
      await axios.delete(`/alunos/${id}`)

      const novosAlunos = [...alunos]
      novosAlunos.splice(index,1)
      setAlunos(novosAlunos)
      setIsloading(false)

    } catch (err) {
      console.log(err.response.status)
     const status = get(err, 'response.status', 0)

     if(status === 401){
      toast.error('Para excluir o aluno, você precisa fazer login')
      navigate('/login')
      return
     }else{
      toast.error('Ocorreu um erro ao excluir o aluno')
     }
    }

  }

  return (
    
    <Container>
      <Loading isLoading={isLoading}/>

      <h1>Alunos</h1>

      <NovoAluno to='/aluno/'>Novo Aluno</NovoAluno>

      <AlunoContainer>
        {alunos.map((aluno,index)=>(
          <div key={String(aluno.id)}>
            <ProfilePicture>
              {get(aluno, 'Fotos[0].url', false) ?(
                <img src={aluno.Fotos[0].url} alt=''/>
              ):(
                <FaUserCircle size={36}/>
              )}
            </ProfilePicture>
            <span>{aluno.nome}</span>
            <span>{aluno.email}</span>
            <Link to={`/aluno/${aluno.id}/edit`}size={16}><FaEdit/></Link>
            <Link 
            onClick={handleDeleteAsk}
            to={`/aluno/${aluno.id}/delete`}
            size={16}>
              <FaWindowClose/>
            </Link>
            <FaExclamation 
              size={16} 
              display='none' 
              cursor='pointer'
              onClick={e=>handleDelete(e,aluno.id, index)}
            />
          </div>
        ))}
      </AlunoContainer>
    </Container>
  );
}
