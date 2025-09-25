import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import awsConfig from '../../temp-zeller-challenge/aws-exports';

const httpLink = new HttpLink({ uri: awsConfig.aws_appsync_graphqlEndpoint });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-api-key': awsConfig.aws_appsync_apiKey,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


export const LIST_CUSTOMERS = gql`
  query ListZellerCustomers {
    listZellerCustomers {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`;

export async function fetchZellerCustomers() {
  const { data } = await client.query({ query: LIST_CUSTOMERS });
  return data.listZellerCustomers.items;
}
