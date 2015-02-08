# History

## 목차
1. [스키마](#schema)
1. [생성](#create)
1. [등록](#update)
1. [호출](#get)
1. [위치 변경](#shift)
1. [삭제](#remove)

## <a name="schema"></a> 스키마

```
{
    _id: 히스토리 오브젝트 아이디,
    title: 제목 스트링,
    body: 본문 스트링,
    link: 링크 스트링(선택),
    url: 경로 스트링,
    keyword: {키워드 오브젝트},
    parent: {부모 히스토리 오브젝트},
    children: [자식 히스토리 오브젝트 목록]
    registered: 생성일시,
    updated: 히스토리 데이터 등록일시
}
```

## <a name="create"></a> 생성

* header
    * Authorization: 유저 Bearer 토큰
* method: POST
* path: /api/histories

히스토리 생성을 위해서는 반드시 `Authorization`헤더 정보가 존재해야 한다.

### 리턴 데이터

해당 히스토리의 유일키인 `_id`를 포함한 오브젝트를 리턴한다.

```
{
    "code": 0,
    "status": 201,
    "message": "성공",
    "data": {
        "__v": 0,
        "registered": "2015-02-07T08:51:15.153Z",
        "_id": "54d5d2039df327390861f197",
        "children": []
    }
}
```

## <a name="update"></a> 등록

* header
    * Authorization: 유저 Bearer 토큰
* method: PUT
* path: /api/histories/:id
    * id: 등록하고자 하는 히스토리 오브젝트 아이디
* data
    * title: 제목 스트링
    * body: 본문 스트링
    * link: 링크 스트링(선택)
    * url: 경로 스트링
    * parent: 부모 히스토리 오브젝트 아이디(없을 시 루트 히스토리)

히스토리 등록을 위해서는 반드시 `Authorization`헤더 정보가 존재해야 한다.
`title`, `body`, `url` 전송은 필수이며 `link`는 선택이다.
또한 부모-자식 관계가 필요한 경우, `parent` 데이터를 함께 전송한다.

### 리턴 데이터

`updated`를 포함한 히스토리 데이터가 출력된다.
 - 현재 키워드 파트를 바인딩 하지 않아, 키워드(`keyword`)는 출력되지 않는다.

```
{
    "code": 0,
    "status": 201,
    "message": "성공",
    "data": {
        "url": "http://haha.com",
        "body": "world",
        "title": "hello",
        "parent": "54d5bad1540ba44d07c1f411",
        "updated": "2015-02-07T08:54:35.547Z",
        "_id": "54d5d2039df327390861f197",
        "registered": "2015-02-07T08:51:15.153Z",
        "__v": 0,
        "children": []
    }
}
```

### 에러 리턴

`title` 데이터 전송 누락시,

```
{
    "code": 10411,
    "status": 422,
    "message": "타이틀이 누락되었습니다."
}
```

`body` 데이터 전송 누락시,

```
{
    "code": 10412,
    "status": 422,
    "message": "본문이 누락되었습니다."
}
```

`url` 데이터 전송 누락시,

```
{
    "code": 10413,
    "status": 422,
    "message": "URL이 누락되었습니다."
}
```

히스토리 아이디를 잘못 전송한 경우,

```
{
    "code": 10401,
    "status": 404,
    "message": "해당 히스토리를 찾을 수 없습니다."
}
```

등록 처리된 히스토리에 대해 중복 요청시,

```
{
    "code": 10402,
    "status": 403,
    "message": "해당 히스토리의 데이터는 이미 처리되었습니다."
}
```

`parent` 데이터가 유효하지 않은 경우,

```
{
    "code": 10403,
    "status": 404,
    "message": "유효하지 않은 부모 히스토리 오브젝트 아이디입니다."
}
```

## <a name="get"></a> 호출

* header
    * Authorization: 유저 Bearer 토큰
* method: GET
* path: /api/histories/:id
    * id: 호출 하는 히스토리 오브젝트 아이디

히스토리 호출을 위해서는 반드시 `Authorization`헤더 정보가 존재해야 한다.
해당 히스토리 데이터 및 하위 히스토리(`children`) 트리구조를 리턴한다.
 - 현재 키워드 파트를 바인딩 하지 않아, 키워드(`keyword`)는 출력되지 않는다.

### 리턴 데이터

히스토리의 `_id`, `registered`, `title`, `url`, `keyword`(미구현), `parent`(포함시), `children`를 출력한다.
`children`의 경우, 하위 트리 구조 모두를 포함한다.
`children`은 히스토리 오브젝트 이며, `_id`, `registered`, `title`, `url`, `keyword`(미구현), `parent`, `children`을 키로 갖는다.

```
{
    "code": 0,
    "status": 200,
    "message": "성공",
    "data": {
        "_id": "54d3a64de2e3ff04189d20bf",
        "registered": "2015-02-05T17:20:13.873Z",
        "title": "hello2",
        "url": "http://naver.com",
        "children": [
            {
                "_id": "54d5bad1540ba44d07c1f411",
                "registered": "2015-02-05T17:20:24.170Z",
                "title": "child",
                "url": "http://naver.com",
                "parent": "54d3a64de2e3ff04189d20bf",
                "children": [
                    {
                         "_id": "54d5d2039df327390861f197",
                         "registered": "2015-02-07T08:51:15.153Z",
                         "title": "hello",
                         "url": "http://haha.com",
                         "parent": "54d5bad1540ba44d07c1f411",
                         "children": []
                     }
                 ]
            },
            {
                "_id": "54d3a659e2e3ff04189d20c1",
                "registered": "2015-02-05T17:20:25.697Z",
                "title": "child2",
                "url": "http://naver.com",
                "parent": "54d3a64de2e3ff04189d20bf",
                "children": []
            }
        ]
    }
}
```

### 에러 리턴

히스토리 아이디를 잘못 전송한 경우,

```
{
    "code": 10401,
    "status": 404,
    "message": "해당 히스토리를 찾을 수 없습니다."
}
```

## <a name="shift"></a> 위치 변경

* header
    * Authorization: 유저 Bearer 토큰
* method: PUT
* path: /api/histories/:id/shift
    * id: 위치를 변경할 히스토리 오브젝트 아이디
* data
    * parent: 변경될 위치의 부모 히스토리 오브젝트 아이디(없을 시 루트 히스토리에 등록된다.)
    * index: 변경될 위치 인덱스 값(없을시 첫번째 위치에 등록된다.)

히스토리 위치 변경을 위해서는 반드시 `Authorization`헤더 정보가 존재해야 한다.

### 리턴 데이터

성공시 데이터를 포함하지 않는다.

```
{
    "code": 0,
    "status": 201,
    "message": "성공"
}
```

### 에러 리턴

히스토리 아이디를 잘못 전송한 경우,

```
{
    "code": 10401,
    "status": 404,
    "message": "해당 히스토리를 찾을 수 없습니다."
}
```

`parent` 값으로 해당 히스토리 하부의 값을 전달한 경우,

```
{
    "code": 10404,
    "status": 405,
    "message": "히스토리를 자기 자신의 하부로 옮길 수 없습니다."
}
```

`parent` 데이터가 유효하지 않은 경우,

```
{
    "code": 10403,
    "status": 404,
    "message": "유효하지 않은 부모 히스토리 오브젝트 아이디입니다."
}
```

`parent`에 해당하는 히스토리 자식에 이미 원하는 히스토리가 등록되어 있는 경우,

```
{
    "code": 10404,
    "status": 405,
    "message": "해당 자식 히스토리는 이미 배열에 포함되어 있습니다."
}
```

## <a name="remove"></a> 삭제

* header
    * Authorization: 유저 Bearer 토큰
* method: DELETE
* path: /api/histories/:id
    * id: 삭할 히스토리 오브젝트 아이디

히스토리 삭제를 위해서는 반드시 `Authorization`헤더 정보가 존재해야 한다.
해당 히스토리 하부의 모든 도큐먼트는 삭제된다.

### 리턴 데이터

성공시 데이터를 포함하지 않는다.

```
{
    "code": 0,
    "status": 201,
    "message": "성공"
}
```

### 에러 리턴

히스토리 아이디를 잘못 전송한 경우,

```
{
    "code": 10401,
    "status": 404,
    "message": "해당 히스토리를 찾을 수 없습니다."
}
```
