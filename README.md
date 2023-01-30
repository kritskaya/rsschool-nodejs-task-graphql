## Assignment: Graphql
### Tasks:
1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
   1.1. npm run test - 100%  
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR.  
All dynamic values should be sent via "variables" field.  
If the properties of the entity are not specified, then return the id of it.  
`userSubscribedTo` - these are users that the current user is following.  
`subscribedToUser` - these are users who are following the current user.  
   
   * Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.  
   2.3. Get users with their posts, profiles, memberTypes.  
   2.4. Get user by id with his posts, profile, memberType.  
   2.5. Get users with their `userSubscribedTo`, profile.  
   2.6. Get user by id with his `subscribedToUser`, posts.  
   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).  
   * Create gql requests:   
   2.8. Create user.  
   2.9. Create profile.  
   2.10. Create post.  
   2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  
   * Update gql requests:  
   2.12. Update user.  
   2.13. Update profile.  
   2.14. Update post.  
   2.15. Update memberType.  
   2.16. Subscribe to; unsubscribe from.  
   2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  

3. Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
   You can use only one "findMany" call per loader to consider this task completed.  
   It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.  
   3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).  
4. Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.   
   4.1. Provide a link to the line of code where it was used.  
   4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.  

### Description:  
All dependencies to complete this task are already installed.  
You are free to install new dependencies as long as you use them.  
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.  
All templates for restful endpoints are placed, just fill in the logic for each of them.  
Use the "db" property of the "fastify" object as a database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).  

### Description for the 1 task:
If the requested entity is missing - send 404 http code.  
If operation cannot be performed because of the client input - send 400 http code.  
You can use methods of "reply" to set http code or throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors).  
If operation is successfully completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).  

Relation fields are only stored in dependent/child entities. E.g. profile stores "userId" field.  
You are also responsible for verifying that the relations are real. E.g. "userId" belongs to the real user.  
So when you delete dependent entity, you automatically delete relations with its parents.  
But when you delete parent entity, you need to delete relations from child entities yourself to keep the data relevant.   
(In the next rss-school task, you will use a full-fledged database that also can automatically remove child entities when the parent is deleted, verify keys ownership and instead of arrays for storing keys, you will use additional "join" tables)  

To determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).  

### Description for the 2 task:  
You are free to create your own gql environment as long as you use predefined graphql endpoint (./src/routes/graphql/index.ts).  
(or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))  

!!! To check this task you need the Postman program (or similar)  
- choose POST method for every request  
- the endpoint is the same for every request  
- you should paste the body in the QUERY section in the Postman, the variables in GRAPHQL VARIABLES section  
![screen](https://i.ibb.co/H7y4CNV/2023-01-30-165355.jpg)

Despite condition ``If the properties of the entity are not specified, then return the id of it`` some additional fields were added to the queries for easier task check and verification.

Examples of POST body and dynamic variables for the GraphQL queries:

2.1  
body:
```
query {
    allEntities {  
       users {  
           id  
           firstName  
           lastName  
       }  
       posts {  
           id  
           title  
           content  
       }
       profiles {
           id
           sex
           birthday
       }
       memberTypes {
           id
           discount
           monthPostsLimit
       }
   }
}
```

2.2  
body 
```
query {
   allEntities {
       users {
           id
           firstName
           lastName
       }
       posts {
           id
           title
           content
       }
       profiles {
           id
           sex
           birthday
       }
       memberTypes {
           id
           discount
           monthPostsLimit
       }
   }
}
```
variables: 
```
{
    "userId": "INSERT_USER_ID",
    "profileId": "INSERT_PROFILE_ID",
    "postId": "INSERT_POST_ID",
    "memberTypeId": "INSERT_MEMBER_TYPE_ID"
}
```

2.3  
body:
```
query {
    usersWithData {
        id,
        firstName
        lastName
        profile {
            id
            memberTypeId
            userId
        }
        posts {
            id
            title
            userId
        }
        memberType {
            id
            discount
            monthPostsLimit
        }
    }
}
```

2.4  
body:
```
query ($userId: ID!) {
    userWithDataById (userId: $userId) {
        id
        firstName
        lastName
        profile {
            id
            sex
            birthday
        }
        posts {
            id
            title
            content
        }
        memberType {
            id
            discount
            monthPostsLimit
        }
    }
}
```
variables:
```
{
    "userId": "INSERT_USER_ID"
}
```

2.5  
body:
```
query {
    usersWithUsersSubscribeToAndProfile {
        id
        firstName
        lastName
        usersSubscribedTo {
            id
            firstName
            lastName
        }
        profile {
            id
            sex
            birthday
            userId
        }
    }
}
```

2.6  
body:
```
query ($userId: ID!) {
    userWithSubscribersAndPosts (userId: $userId) {
        id
        firstName
        lastName
        subscribedToUsers {
            id
            firstName
            lastName
            subscribedToUserIds
        }
        posts {
            id
            title
            content
            userId
        }
    }
}
```
variables:
```
{
    "userId": "INSERT_USER_ID"
}
```

2.7  
body:
```
query {
    usersSubscribtions {
        id
        firstName
        lastName
        usersSubscribedTo {
            ...subscription
            usersSubscribedTo {
                ...subscription
            }
        }
        subscribedToUser {
            ...subscription
            subscribedToUser {
                ...subscription
            }
        }
    }
}

fragment subscription on usersSubscriptions {
    id
    firstName
    lastName
}
```

2.8  
body:
```
mutation ($userData: createUserInput) {
    createUser (userData: $userData) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
    }
}
```
variables:
```
{
    "userData": {
        "firstName": "Ivan",
        "lastName": "Ivanov",
        "email": "email@no.email"
    }
}
```

2.9  
body:
```
mutation ($profileData: createProfileInput){
    createProfile (profileData: $profileData) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
}
```
variables:
```
{
    "profileData": {
        "avatar": "no avatar",
        "sex": "male",
        "birthday": 124578925,
        "country": "Belarus",
        "street": "Street",
        "city": "Minsk",
        "memberTypeId": "basic",
        "userId": "INSERT_USER_ID"
    }
}
```

2.10  
body:
```
mutation ($postData: createPostInput) {
    createPost (postData: $postData) {
        id
        title
        content
        userId
    }
}
```

variables:
```
{
    "postData": {
        "title": "Post",
        "content": "Post content",
        "userId": "INSERT_USER_ID"
    }
}
```

2.11 InputObjectType for DTO were created in ``src\routes\graphql\types\mutationTypes.ts``

2.12  
body:
```
mutation ($userData: updateUserInput) {
   updateUser (userData: $userData) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
    }
}
```
variables:
```
{
    "userData": {
        "id": "INSERT_USER_ID",
        "firstName": "Ivan2",
        "lastName": "Ivanov2",
        "email": "email@no.email2"
    }
}
```

2.13  
body:
```
mutation ($profileData: updateProfileInput) {
    updateProfile (profileData: $profileData) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
}
```
variables:
```
{
    "profileData": {
        "id": "INSERT_PROFILE_ID",
        "avatar": "no_avatar",
        "sex": "male",
        "birthday": 124578925,
        "country": "Belarus2",
        "street": "street2",
        "city": "Minsk2",
        "memberTypeId": "basic"
    }
}
```

2.14  
body:
```
mutation ($postData: updatePostInput) {
    updatePost (postData: $postData) {
        id
        title
        content
        userId
    }
}
```

variables:
```
{
    "postData": {
        "id": "INSERT_POST_ID",
        "title": "Post2",
        "content": "Post content2"
    }
}
```

2.15  
body:
```
mutation ($memberTypeData: updateMemberTypeInput) {
    updateMemberType ( memberTypeData: $memberTypeData) {
        id
        discount
        monthPostsLimit
    }
}
```

variables:
```
{
    "memberTypeData": {
        "id": "basic", 
        "discount": 2, 
        "monthPostsLimit": 30
    }
}
```

2.16   
body for subscribe:
```
mutation ($subscribingData: subscribingInput) {
    subscribedToUsers (subscribingData: $subscribingData){
        id
        firstName
        lastName
        subscribedToUserIds
    }
}
```

variables:
```
{
    "subscribingData": {
        "userId": "INSERT_USER_ID",
        "subscribeToId": "INSER_USER_ID"
    }
}
```

body for unsubscribe:
```
mutation ($unsubscribingData: subscribingInput) {
    unsubscribedToUsers (unsubscribingData: $unsubscribingData){
        id
        firstName
        lastName
        subscribedToUserIds
    }
}
```

variables:
```
{
    "unsubscribingData": {
        "userId": "INSERT_USER_ID",
        "subscribeToId": "INSER_USER_ID"
    }
}
```

2.17 InputObjectType for DTO were created in ``src\routes\graphql\types\mutationTypes.ts``

### Description for the 3 task:
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  

Function that leads to data loaders creation in the gql context is called in file ``src\routes\graphql\index.ts`` at ``line 22``

Data loaders were called in the resolver:

for implementing task 2.3 and 2.4:
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 28
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 38
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 61

for implementing task 2.5:
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 91
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 106

for implementing task 2.6:
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 127
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 139

for implementing task 2.7:
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 161
- in file ``src\routes\graphql\types\queryTypes.ts`` at line 174

### Description for the 4 task:  
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties `userSubscribedTo`, `subscribedToUser` and users within them can also have `userSubscribedTo`, `subscribedToUser` and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to (for example) 6 levels max.

POST body of gql query:
```
query {
    usersSubscribtions {
        id
        firstName
        lastName
        usersSubscribedTo {
            ...subscription
            usersSubscribedTo {
                ...subscription
                usersSubscribedTo {
                    ...subscription
                    usersSubscribedTo {
                        ...subscription
                        usersSubscribedTo {
                            ...subscription
                            usersSubscribedTo {
                                ...subscription
                            }
                        }
                    }
                }
            }
        }
    }
}

fragment subscription on usersSubscriptions {
    id
    firstName
    lastName
}
```

expected result:
```
{
    "errors": {
        "message": "query exceeds maximum operation depth of 6"
    },
    "data": null
}
```
