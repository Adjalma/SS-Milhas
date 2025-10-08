#!/bin/bash

echo "Iniciando servidor SS Milhas..."

cd server

echo "Instalando dependências..."
npm install

echo "Iniciando servidor..."
npm run dev
