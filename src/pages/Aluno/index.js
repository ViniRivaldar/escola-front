import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux'; 

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';

export default function Aluno() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [foto, setFoto] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const getData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/alunos/${id}`);
        const foto = get(data, 'Fotos[0].url', '');

        setFoto(foto);
        setNome(data.nome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setIdade(data.idade);
        setPeso(data.peso);
        setAltura(data.altura);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const error = get(err, 'response.data.errors', []);

        if (status === 400) {
          error.map((erro) => toast.error(erro));
          navigate('/');
        }
      }
    };

    getData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formsError = false;

    if (nome.length < 3 || nome.length > 255) {
      formsError = true;
      toast.error('O nome precisa ser maior que 3 ou menor que 255 letras');
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
      formsError = true;
      toast.error('O sobrenome precisa ser maior que 3 ou menor que 255 letras');
    }

    if (!isEmail(email)) {
      formsError = true;
      toast.error('Email inválido');
    }
    if (!isInt(String(idade))) {
      formsError = true;
      toast.error('Idade inválida');
    }
    if (!isFloat(String(peso))) {
      formsError = true;
      toast.error('Peso inválido');
    }
    if (!isFloat(String(altura))) {
      formsError = true;
      toast.error('Altura inválida');
    }

    if (formsError) return;

    try {
      setIsLoading(true);
      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) editado(a) com sucesso!');
        navigate('/');
      } else {
        const { data } = await axios.post(`/alunos`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success('Aluno(a) criado(a) com sucesso!');
        navigate(`${data.id}/edit`);
      }
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.status', 0);
      const data = get(error, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((err) => toast.error(err));
      } else {
        toast.error('Erro desconhecido');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Editar Aluno' : 'Novo aluno'}</Title>

      {id && (
        <ProfilePicture>
          {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
          <Link to={`/fotos/${id}`}><FaEdit size={24} /></Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type='text'
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder='Nome'
        />
        <input
          type='text'
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          placeholder='Sobrenome'
        />
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          type='number'
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder='Idade'
        />
        <input
          type='text'
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder='Peso'
        />
        <input
          type='text'
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder='Altura'
        />
        <button type='submit'>{id ? 'Salvar' : 'Enviar'}</button>
      </Form>
    </Container>
  );
}

