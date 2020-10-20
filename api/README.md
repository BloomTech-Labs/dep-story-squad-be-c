# Story Squad API

> ## website here

# Auth

> ## All the following routes require **`an okta token`** header

# - Parent register and login routes

> ### POST /auth/register

```
Expects:
    header:{
        authorization: <oktaID token>
    }
    body:{
        pin: <pin for parent account>
    }
```

```
Returns:
{
    id: <int>,
    message: "parent account created!",
}
```

<br />

> ### POST /auth/login

```
Expects:
    header:{
        authorization: bearer <oktaID token>
    }
```

```
Returns:
{
    accounts:[
                {
                    id: <int>,
                    name: <string>,
                    type: <either 'parent' or 'child'>
                },
                {
                    id: <int>,
                    name: <string>,
                    type: <either 'parent' or 'child'>

                }
             ]
}
```

<br />

# Parent routes

## - Login to Parent Account

> #### Get /parent/:parentID

```
Expects:
    header:{
        authorization: <oktaID token>
    }
    body:{
        pin: <pin for parent account>
    }
```

```

Returns:
{
    message: 'logged in',
    token: token,
    parent: {
                id: <parent's ID>
                name: <str>
                email: <str>
                admin: <str>
            }
}
```

<br />

## - Return birds eye child data

> #### GET /parent/:parentID/dashboard

```
Expects:
    header:{
        authorization: bearer <JWT token>
    }
```

```

Returns:
{
                [
                   <array of data objects for each of that parents children>
                   {
                       name: <str>,
                       reading_score: <int>,
                       current_mission: <int>
                   }
               ]
}

```

<br />

## - Add a new Child

> #### Post /parent/:parentID

```
Expects:
    header:{
        authorization: bearer <JWT token>
    }

body:{
        name: <str>,
        username: <str>,
        avatar_url: <str>,
        pin: <childs pin>,
        grade: <int>,
        dyslexic: <boolean>
    }
```

<br />

# Child routes

## - login for a child account

> #### Get /child/:childID

```
Expects:
    header:{
        authorization: <oktaID token>
    }
    body:{
        pin: <pin for parent account>
    }
```

```
Returns:
Returns:
{
    message: 'logged in',
    token: token,
    child:{
            name: <string>,
            username: <string>,
            avatar_url: <string>,
            parent_id: <integer>,
            current_mission: <string>
        }
```

<br />

## - get a child's current mission

> #### GET /child/:childID/mission

```
Expects:
    header:{
        authorization: bearer <JWT token>
    }
```

```
Returns:
    {
        id: <id of mission>,
        read: [
                <array of image url's for the assigned reading>
              ],
        write: <writing prompt>,
        draw: <drawing prompt>
    }
```

<br />

## - get a  child's mission progress

> #### GET /child/:childID/progress

```
Expects:
    header:{
        authorization: bearer <JWT token>
    }
```

```
Returns:
    {
        progress: {
            "id": <int>,
            "child_id": <int>,
            "mission_id": <int>,
            "read": <boolean>,
            "write": <boolean>,
            "draw": <boolean>
        }
    }
```

<br />

## - update read progress

> #### PUT /child/:childID/mission/read

```
Returns:
    {
        progress: {
            "id": <int>,
            "child_id": <int>,
            "mission_id": <int>,
            "read": <boolean>,
            "write": <boolean>,
            "draw": <boolean>
        }
    }
```

<br />

## - post a new writing submission

> #### POST /child/:childID/mission/write
>
> > #### Note: the body will need to be form data not JSON

```
Expects:
    header: {
        authorization: bearer <JWT token>
    }
        image: <writing png's>,

```

```
Returns:
    {
        message: "We got your submission!"
        progress: {
            "id": <int>,
            "child_id": <int>,
            "mission_id": <int>,
            "read": <boolean>,
            "write": <boolean>,
            "draw": <boolean>
        }
    }
```

<br />

## - post a new drawing submission

> #### POST /child/:childID/mission/draw
>
> > #### Note: the body will need to be for data not JSON

```
Expects:
    header: {
        authorization: bearer <JWT token>
    }
        image: <writing png>,

```

```
Returns:
    {
        message: "We got your submission!"
        progress: {
            "id": <int>,
            "child_id": <int>,
            "mission_id": <int>,
            "read": <boolean>,
            "write": <boolean>,
            "draw": <boolean>
        }
    }
```

<br />

# DS and Admin endpoints still need to be planned out
