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
whith Authorization header
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