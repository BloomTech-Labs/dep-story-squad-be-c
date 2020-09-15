# Story Squad API

> ## website here 

# Auth

> ## All the following routes require **`an okta token`** header



# - Parent register and login routes
>
> ### POST /api/register

```
Expects:
{
    pin: <pin for the parent account>,
    <also some subscription confirmation from stripe>
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

> ### GET /api/login

```
Returns:
{
    parent: {
              id: <int>,
              name: <string>
            }
    children:[
                {
                    id: <int>,
                    name: <string>
                },
                {
                    id: <int>,
                    name: <string>
                }
             ]
}
```

<br />

# Parent routes

## - Add a new Child

> #### POST /api/parent/:parentID

```
Expects:
{
    name: <str>,
    username: <str>,
    avatar_url: <str>,
    pin: <childs pin>
}
```

```

Returns:
{
  parent_info: {
                  name: <str>,
                  email: <str>
               },
  child_data:  [
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

## - Return birds eye child data

> #### GET /api/parent/:parentID/dashboard

```
Expects:
{
    pin: <Parent's pin Number>
}
```

```

Returns:
{
  parent_info: {
                  name: <str>,
                  email: <str>
               },
  child_data:  [
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

# Child routes

## - return a child's data

> #### POST /api/child/:childID/dashboard

```
Expects:
{
        pin: <childs pin number>
}
```

```
Returns:
    {
        "name": <string>,
        "username": <string>,
        "avatar_url": <string>,
        "parent_id": <integer>,
        "current_mission": <string>
    }
```

<br />

## - get a child's current mission

> #### GET /api/child/:childID/mission

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

## - post a new mission submission

> #### POST /api/child/:childID/mission/:missionID
> > #### Note: the body will need to be form data not JSON

```
Expects:
        writing: <writing png's>,
        drawing: <drawing png>

```

```
Returns:
    {
        message: "We got your submission!"
    }
```

<br />

# DS and Admin endpoints still need to be planned out



