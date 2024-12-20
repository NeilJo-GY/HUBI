// src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/api/graphql', // 指向您的 API 路由
    credentials: 'same-origin', // 根据需要配置
  }),
  cache: new InMemoryCache(),
});

export default client;