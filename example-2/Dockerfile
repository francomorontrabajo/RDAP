FROM node:lts

WORKDIR /rdap

COPY . .

RUN rm -rf node_modules package-lock.json && npm install

CMD [ "npm", "start" ]