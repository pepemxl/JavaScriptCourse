FROM node:21

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5173

#CMD ["npm", "run", "dev"]
CMD ["npm", "run", "dev",  "--", "--host", "0.0.0.0", "--port", "5173"]