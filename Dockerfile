FROM node:alpine

WORKDIR /frontend

COPY package.json package-lock.json ./
# RUN npm install

COPY . /frontend/

# Construction de l'application
#RUN npm run build

# Nettoyage des fichiers non nécessaires après la construction
#RUN rm -rf src .dockerignore Dockerfile


# Expose le port utilisé par l'application
EXPOSE 3000


CMD [ "npm", "run", "dev", "--", "-H", "0.0.0.0"]