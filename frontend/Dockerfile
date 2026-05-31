FROM node:20-slim

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código do frontend
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Comando para rodar o Vite aceitando conexões externas
CMD ["npm", "run", "dev", "--", "--host"]