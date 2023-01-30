import {
  GraphQLSchema,
} from 'graphql';
import { mutationType } from './types/mutationTypes';
import { queryType } from './types/queryType';

const schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

export { schema };
