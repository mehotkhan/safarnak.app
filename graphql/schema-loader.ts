// Read GraphQL schema from .graphql file
// This is used by the worker to load the schema at runtime

// Load from file at build-time using Wrangler `rules` (Text loader for .graphql)
// This keeps schema single-sourced in graphql/schema.graphql
// Note: Using relative path instead of alias to ensure Wrangler can resolve it at build time
import schemaSource from '../graphql/schema.graphql';

export const readGraphQLSchema = (): string => schemaSource as string;
