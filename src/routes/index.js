import React from 'react';
import { Routes, Route as RouterRoute } from 'react-router-dom'; 
import MyRoute from './MyRoute';
import Register from '../pages/Register';
import Alunos from '../pages/Alunos';
import Aluno from '../pages/Aluno'; 
import Fotos from '../pages/Fotos';
import Login from '../pages/Login';
import Page404 from '../pages/Page404';

export default function AppRoutes() {
  return (
    <Routes>
      <RouterRoute path="/" element={<MyRoute element={Alunos} isClosed={false} />} />
      <RouterRoute path="/aluno/:id/edit" element={<MyRoute element={Aluno} isClosed />} />
      <RouterRoute path="/aluno" element={<MyRoute element={Aluno} isClosed />} />
      <RouterRoute path="/fotos/:id" element={<MyRoute element={Fotos} isClosed />} />
      <RouterRoute path="/register" element={<MyRoute element={Register} isClosed={false} />} />
      <RouterRoute path="/login" element={<MyRoute element={Login} isClosed={false} />} />
      <RouterRoute path="*" element={<MyRoute element={Page404} />} />
    </Routes>
  );
}
