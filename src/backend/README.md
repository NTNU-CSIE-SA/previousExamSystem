## filter 
### get all tags
#### path
`/api/filter/tags`
#### input method
GET
#### output
```json
{
    "semester": [],
    "subject": [],
    "type": []
}
```

### list all file from selected tags
#### path
`/api/filter/file-lists`
#### input method
POST

with Authorization header
- with admin level < `env.UNVARIFIED_FILE_LEVEL`
```json
{
    "semester": [], // empty array mean all 
    "subject": [],  // empty array mean all
    "type": [],     // empty array mean all
}
```
- with admin level >= `env.UNVARIFIED_FILE_LEVEL` also can
```json
{
    "semester": [], // empty array mean all 
    "subject": [],  // empty array mean all
    "type": [],     // empty array mean all
    "varified": 0 // 0 or 1
}
```
#### output
```json
[
    {
        "id": 1,
        "upload_time": "2025-01-01 00:00:00",
        "subject": "subject",
        "semester": "semester",
        "exam_type": "type"
    },
    {
        "id": 2,
        "upload_time": "2025-01-01 00:00:00",
        "subject": "subject",
        "semester": "semester",
        "exam_type": "type"
    }
]

```

## admin
### list all user
#### path
`/api/admin/user-list`
#### input
GET
#### output
```json
[
    {
        "school_id": "40047000S",
        "name": "name",
        "ban_until": "2025-01-01 00:00:00"
    },
    {
        "school_id": "40047001S",
        "name": "name",
        "ban_until": "2025-01-01 00:00:00"
    }
]
```

### ban user
#### path
`/api/admin/ban`
#### input
POST

with Authorization header
```json
{
    "school_id": "40047000S",
    "ban_until": "2025-01-01 00:00:00"
}
```
#### output
```json
{
    "message": "User 40047000S is banned until 2025-01-01 00:00:00" // or other error http status code with error message
}
```

### unban user
#### path
`/api/admin/unban`
#### input
POST

with Authorization header
```json
{
    "school_id": "40047000S"
}
```
#### output
```json
{
    "message": "User 40047000S is unbanned" // or other error http status code with error message
}
```
