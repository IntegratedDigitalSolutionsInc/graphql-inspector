import {loadSchemaSync} from '@graphql-tools/load';
import {buildSchema, Source} from 'graphql';

export function produceSchema(source: Source) {
  try {
    if (!source.body.trim().length) {
      throw new Error(`Content is empty`);
    }

    return loadSchemaSync(source.body, {
      loaders: [],
      schemas: [
        buildSchema(/* GraphQL */ `
          scalar AWSDate
          scalar AWSTime
          scalar AWSDateTime
          scalar AWSTimestamp
          scalar AWSEmail
          scalar AWSJSON
          scalar AWSURL
          scalar AWSPhone
          scalar AWSIPAddress
          scalar BigInt
          scalar Double

          directive @aws_subscribe(
            mutations: [String!]!
          ) on FIELD_DEFINITION

          directive @deprecated(
            reason: String
          ) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ENUM | ENUM_VALUE

          directive @aws_auth(
            cognito_groups: [String!]!
          ) on FIELD_DEFINITION
          directive @aws_api_key on FIELD_DEFINITION | OBJECT
          directive @aws_iam on FIELD_DEFINITION | OBJECT
          directive @aws_oidc on FIELD_DEFINITION | OBJECT
          directive @aws_cognito_user_pools(
            cognito_groups: [String!]
          ) on FIELD_DEFINITION | OBJECT
          directive @aws_lambda on FIELD_DEFINITION | OBJECT

          directive @function(name: String!, region: String) repeatable on FIELD_DEFINITION

          directive @model(
            queries: ModelQueryMap
            mutations: ModelMutationMap
            subscriptions: ModelSubscriptionMap
            timestamps: TimestampConfiguration
          ) on OBJECT
          input ModelMutationMap {
            create: String
            update: String
            delete: String
          }
          input ModelQueryMap {
            get: String
            list: String
          }
          input ModelSubscriptionMap {
            onCreate: [String]
            onUpdate: [String]
            onDelete: [String]
            level: ModelSubscriptionLevel
          }
          enum ModelSubscriptionLevel {
            off
            public
            on
          }
          input TimestampConfiguration {
            createdAt: String
            updatedAt: String
          }

          directive @key(name: String, fields: [String!]!, queryField: String) repeatable on OBJECT

          directive @auth(rules: [AuthRule!]!) on OBJECT | FIELD_DEFINITION
          input AuthRule {
            allow: AuthStrategy!
            identityField: String
            provider: AuthProvider
            identityClaim: String
            groupClaim: String
            ownerField: String # defaults to "owner"
            groupsField: String
            groups: [String]
            operations: [ModelOperation]
            queries: [ModelQuery]
            mutations: [ModelMutation]
          }
          enum AuthStrategy {
            owner
            groups
            private
            public
          }
          enum AuthProvider {
            apiKey
            iam
            oidc
            userPools
          }
          enum ModelOperation {
            create
            update
            delete
            read
          }
          enum ModelQuery {
            get
            list
          }
          enum ModelMutation {
            create
            update
            delete
          }
        `),
      ]
    });
  } catch (e) {
    throw new Error(`Failed to parse "${source.name}": ${e.message}`);
  }
}
